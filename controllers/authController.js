/**
 * controllers/authController.js
 * ควบคุมการทำงาน Authentication ทั้งหมดของระบบ
 * - สมัครสมาชิก (register)
 * - เข้าสู่ระบบ (login)
 * - ขอ access token ใหม่ (refresh)
 * - ออกจากระบบ (logout)
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const {
  createUser,
  getUserByUsername,
  updateUserProfileByUsername,
} = require("../models/userModel");
const {
  createRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} = require("../models/authTokenModel");
const ldap = require("../config/ldap"); // เชื่อม LDAP client

/* ---------- ฟังก์ชันช่วยสร้าง Access Token (อายุ 15 นาที) ---------- */
function signAccessToken(user) {
  const jti = uuidv4(); // ไว้ใช้สำหรับตรวจสอบใน jwt_blacklist
  return jwt.sign(
    { jti, user_id: user.user_id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

/* ---------- สมัครสมาชิกใหม่ (Register) ---------- */
exports.register = async (req, res) => {
  try {
    const { username, email, password, ...rest } = req.body;

    const existing = await getUserByUsername(username);
    if (existing) {
      return res
        .status(400)
        .json({ error: "มีผู้ใช้นี้ในระบบแล้ว (อาจสร้างจาก AD หรือสมัครเอง)" });
    }

    // ตรวจสอบว่ามีชื่อผู้ใช้นี้อยู่ในระบบหรือไม่
    if (await getUserByUsername(username)) {
      return res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" });
    }

    // เข้ารหัสรหัสผ่านด้วย bcrypt
    const hash = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่ลงในฐานข้อมูล
    const user_id = await createUser({
      username,
      email,
      password: hash,
      ...rest,
    });

    // สร้าง Access Token และ Refresh Token
    const accessToken = signAccessToken({ user_id, username });
    const refreshToken = await createRefreshToken(user_id, 7); // 7 วัน

    // ส่ง Token และข้อมูล user กลับไปที่ Client
    res.json({ accessToken, refreshToken, user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะสมัครสมาชิก" });
  }
};

/* ---------- เข้าสู่ระบบ (Login) ---------- */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ดึงข้อมูลผู้ใช้งานจากชื่อผู้ใช้ (username)
    const user = await getUserByUsername(username);

    // ตรวจสอบความถูกต้องของ username/password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง Access Token และ Refresh Token
    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.user_id, 7); // 7 วัน

    // ส่ง Token กลับไปที่ Client
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะเข้าสู่ระบบ" });
  }
};

/* ---------- เข้าสู่ระบบผ่าน LDAP / Active Directory ---------- */
exports.ldapLogin = async (req, res) => {
  const { username, password } = req.body;
  // ตรวจว่ามีข้อมูลครบไหม
  if (!username || !password) {
    return res.status(400).json({ error: "กรุณาใส่ username และ password" });
  }

  // เรียก authenticate ของ ldapauth-fork
  ldap.authenticate(username, password, async (err, ldapUser) => {
    if (err) {
      console.error("LDAP authenticate error:", err);
      return res
        .status(401)
        .json({ error: "LDAP: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // ldapUser คือข้อมูลผู้ใช้จาก AD เช่น { sAMAccountName, mail, cn, ... }
    try {
      // 1) ตรวจว่ามี user ใน DB local หรือยัง ถ้ายังไม่มีให้สร้าง
      let user = await getUserByUsername(ldapUser.sAMAccountName);
      if (!user) {
        const newId = await createUser({
          username: ldapUser.sAMAccountName,
          email: ldapUser.mail || "",
          password: "", // ไม่ใช้ bcrypt กับ LDAP
          first_name: ldapUser.givenName || "",
          last_name: ldapUser.sn || "",
          status: "active",
        });
        user = { user_id: newId, username: ldapUser.sAMAccountName };
      }

      // 2) สร้าง Access + Refresh Token เช่นเดียวกับ login ปกติ
      const accessToken = signAccessToken(user);
      const refreshToken = await createRefreshToken(user.user_id, 7);

      // 3) ตอบกลับ client
      res.json({ accessToken, refreshToken, user_id: user.user_id });
    } catch (dbErr) {
      console.error("DB error on LDAP login:", dbErr);
      res.status(500).json({ error: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  });
};

exports.ldapLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "กรุณาใส่ username และ password" });
  }

  // เชื่อมกับ AD
  ldap.authenticate(username, password, async (err, ldapUser) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "LDAP: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
    try {
      // เตรียม profile ข้อมูลที่ต้อง sync
      const adProfile = {
        username: ldapUser.sAMAccountName,
        email: ldapUser.mail || "",
        first_name: ldapUser.givenName || "",
        last_name: ldapUser.sn || "",
        phone: ldapUser.telephoneNumber || "",
        department: ldapUser.department || "", // หรือ map ตรงกับ id ในระบบ
        status: "active",
      };

      // ป้องกัน user ซ้ำ (อัปเดตทับ ไม่สร้าง record ใหม่ถ้ามีอยู่แล้ว)
      let user = await getUserByUsername(adProfile.username);
      if (!user) {
        // insert user ใหม่ถ้าไม่เจอ
        const newId = await createUser({ ...adProfile, password: "" });
        user = { user_id: newId, username: adProfile.username };
      } else {
        // update field จาก AD ทุกครั้งที่ login
        await updateUserProfileByUsername(adProfile.username, adProfile);
        user = { user_id: user.user_id, username: adProfile.username };
      }

      // ส่ง JWT + refresh กลับ
      const accessToken = signAccessToken(user);
      const refreshToken = await createRefreshToken(user.user_id, 7);
      res.json({ accessToken, refreshToken, user_id: user.user_id });
    } catch (dbErr) {
      res.status(500).json({ error: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  });
};

/* ---------- ขอ Access Token ใหม่ (Refresh Token) ---------- */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // ตรวจสอบว่ามีการส่ง refresh token มาหรือไม่
    if (!refreshToken) {
      return res.status(400).json({ error: "กรุณาแนบ Refresh Token มาด้วย" });
    }

    // ตรวจสอบความถูกต้องของ refresh token
    const tokenData = await verifyRefreshToken(refreshToken);
    if (!tokenData) {
      return res
        .status(401)
        .json({ error: "Refresh Token ไม่ถูกต้องหรือหมดอายุ" });
    }

    // สร้าง Access Token ใหม่ส่งกลับไปให้ Client
    const accessToken = signAccessToken({
      user_id: tokenData.user_id,
      username: "",
    });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการขอ Access Token ใหม่" });
  }
};

/* ---------- ออกจากระบบ (Logout) ---------- */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // เพิกถอน Refresh Token (หากมีการส่งมาจาก Client)
    if (refreshToken) {
      const tokenData = await verifyRefreshToken(refreshToken);
      if (tokenData) {
        await revokeRefreshToken(tokenData.token_id);
      }
    }

    // เพิ่ม Access Token ปัจจุบันลงใน jwt_blacklist เพื่อป้องกันการนำไปใช้ต่อ
    await db.query(
      `INSERT IGNORE INTO jwt_blacklist (jti, user_id, expired_at)
       VALUES (?, ?, FROM_UNIXTIME(?))`,
      [req.user.jti, req.user.user_id, req.user.exp]
    );

    // ส่งข้อความยืนยันว่าการ Logout สำเร็จ
    res.json({ message: "ออกจากระบบเรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการออกจากระบบ" });
  }
};
