// config/ldap.js
require('dotenv').config();   // โหลดตัวแปรจาก .env

const LdapAuth = require('ldapauth-fork');  // ไลบรารีสำหรับเชื่อม AD/LDAP

// กำหนด options ตามที่ตั้งไว้ใน .env
const opts = {
  url:               process.env.LDAP_URL,           // ที่อยู่ LDAP server
  bindDN:            process.env.LDAP_BIND_DN,       // DN ของ Service Account
  bindCredentials:   process.env.LDAP_BIND_PASSWORD, // รหัสผ่าน Service Account
  searchBase:        process.env.LDAP_SEARCH_BASE,   // จุดเริ่มค้นหา users
  searchFilter:      process.env.LDAP_SEARCH_FILTER, // ฟิลเตอร์ค้นหาผู้ใช้
  reconnect:         true,                           // พยายามเชื่อมใหม่ถ้าหลุด
  timeout:           5000,                           // รอ response สูงสุด 5 วินาที
  tlsOptions: { rejectUnauthorized: false }          // ถ้าใช้ LDAPS, ปิด verify cert
};

// สร้าง instance ของ LdapAuth ด้วย options ข้างบน
const ldap = new LdapAuth(opts);

// ถ้ารันมอดูลนี้โดนตรง จะปิด connection ทันทีเพื่อไม่ให้ค้าง
ldap.on('error', err => {
  console.error('LDAP connection error:', err);
});

module.exports = ldap;
