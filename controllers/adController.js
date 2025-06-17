// controllers/adController.js

/**
 * ฟีเจอร์เปลี่ยนรหัสผ่าน AD ผ่านเว็บ
 * ใช้ไลบรารี ldapjs
 */
const ldapjs = require('ldapjs');

exports.changeAdPassword = (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
  }

  const client = ldapjs.createClient({ url: process.env.LDAP_URL });

  // กำหนด DN ของ user (อาจต้องปรับตาม AD ขององค์กร)
  const userDN = `CN=${username},${process.env.LDAP_SEARCH_BASE}`;

  client.bind(userDN, oldPassword, err => {
    if (err) {
      return res.status(401).json({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' });
    }
    // เตรียมรหัสผ่านใหม่ให้เป็นรูปแบบ UTF-16LE พร้อมเครื่องหมาย "
    const change = new ldapjs.Change({
      operation: 'replace',
      modification: {
        unicodePwd: Buffer.from('"' + newPassword + '"', 'utf16le')
      }
    });
    client.modify(userDN, change, err2 => {
      client.unbind();
      if (err2) {
        return res.status(500).json({ error: 'เปลี่ยนรหัสผ่านไม่สำเร็จ', detail: err2.message });
      }
      res.json({ message: 'เปลี่ยนรหัสผ่าน AD สำเร็จ' });
    });
  });
};
