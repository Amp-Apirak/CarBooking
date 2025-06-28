// controllers/authController.js
/**
 * ควบคุม Authentication ทั้งหมด: register, login, ldapLogin, refresh, logout
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
const ldap = require("../config/ldap"); // LDAP client

/** สร้าง Access Token (1 วัน) พร้อม jti, user_id, username, organization_id */
function signAccessToken({ user_id, username, organization_id }) {
  const jti = uuidv4();
  return jwt.sign(
    { jti, user_id, username, organization_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

/* ---------- สมัครสมาชิกใหม่ (Register) ---------- */
exports.register = async (req, res) => {
  try {
    // รับข้อมูลจาก body (ต้องมี organization_id ด้วย)
    const { username, email, password, organization_id, ...rest } = req.body;

    // ตรวจ username ซ้ำ
    if (await getUserByUsername(username)) {
      return res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" });
    }

    // เข้ารหัส password
    const hash = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const user_id = await createUser({
      username,
      email,
      password: hash,
      organization_id,   // บันทึก org_id ลง DB
      ...rest,
    });

    // สร้าง tokens
    const accessToken  = signAccessToken({ user_id, username, organization_id });
    const refreshToken = await createRefreshToken(user_id, 7);

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

    // ดึง user พร้อม organization_id
    const user = await getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง tokens ใส่ org_id ลง payload
    const accessToken  = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.user_id, 7);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะเข้าสู่ระบบ" });
  }
};

/* ---------- เข้าสู่ระบบผ่าน LDAP / Active Directory ---------- */
exports.ldapLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "กรุณาใส่ username และ password" });
  }

  ldap.authenticate(username, password, async (err, ldapUser) => {
    if (err) {
      console.error("LDAP authenticate error:", err);
      return res.status(401).json({ error: "LDAP: ชื่อหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // เตรียม profile จาก AD
    const adProfile = {
      username:           ldapUser.sAMAccountName,
      email:              ldapUser.mail || "",
      first_name:         ldapUser.givenName || "",
      last_name:          ldapUser.sn || "",
      phone:              ldapUser.telephoneNumber || "",
      organization_id:    ldapUser.departmentId || "", // *ต้องแมป department → org_id*
      status:             "active",
    };

    try {
      // หา หรือสร้าง user ใหม่
      let user = await getUserByUsername(adProfile.username);
      if (!user) {
        const newId = await createUser({ ...adProfile, password: "" });
        user = { user_id: newId, ...adProfile };
      } else {
        await updateUserProfileByUsername(adProfile.username, adProfile);
        // เติม organization_id จาก DB (ในกรณี departmentId ไม่ตรง)
        user.organization_id = user.organization_id;
      }

      // สร้าง tokens
      const accessToken  = signAccessToken(user);
      const refreshToken = await createRefreshToken(user.user_id, 7);
      res.json({ accessToken, refreshToken, user_id: user.user_id });
    } catch (dbErr) {
      console.error("DB error on LDAP login:", dbErr);
      res.status(500).json({ error: "เกิดข้อผิดพลาดภายในระบบ" });
    }
  });
};

/* ---------- ขอ Access Token ใหม่ (Refresh Token) ---------- */
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: "กรุณาแนบ Refresh Token มา" });
    }

    const tokenData = await verifyRefreshToken(refreshToken);
    if (!tokenData) {
      return res.status(401).json({ error: "Refresh Token ไม่ถูกต้องหรือหมดอายุ" });
    }

    // ดึงข้อมูล user ใหม่ เพื่อเอา organization_id
    const [[userRow]] = await db.query(
      "SELECT username, organization_id FROM users WHERE user_id = ? LIMIT 1",
      [tokenData.user_id]
    );
    if (!userRow) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

    // สร้าง Access Token ใหม่
    const accessToken = signAccessToken({
      user_id:         tokenData.user_id,
      username:        userRow.username,
      organization_id: userRow.organization_id,
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
    const refreshToken = req.body?.refreshToken;

    // เพิกถอน Refresh Token
    if (refreshToken) {
      try {
        const tokenData = await verifyRefreshToken(refreshToken);
        if (tokenData) {
          await revokeRefreshToken(tokenData.token_id);
        }
      } catch {/* ignore */}
    }

    // ใส่ Access Token ปัจจุบันลง blacklist
    if (req.user?.jti && req.user?.user_id && req.user?.exp) {
      await db.query(
        `INSERT IGNORE INTO jwt_blacklist (jti,user_id,expired_at)
         VALUES(?, ?, FROM_UNIXTIME(?))`,
        [req.user.jti, req.user.user_id, req.user.exp]
      );
    }

    res.json({ message: "ออกจากระบบเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการออกจากระบบ" });
  }
};
