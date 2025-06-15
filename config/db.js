// config/db.js
// จัดการการเชื่อมต่อกับฐานข้อมูล MySQL

require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ:", err);
  } else {
    console.log("เชื่อมต่อฐานข้อมูลสำเร็จ");
    connection.release();
  }
});

module.exports = pool.promise();
