/**
 * server.js
 *  เริ่มต้นเซิร์ฟเวอร์ Express และตั้งค่า Middleware พื้นฐาน
 */

require('dotenv').config();           // โหลดตัวแปรจาก .env

const express     = require('express');
const morgan      = require('morgan');
const cors        = require('cors');  
const bodyParser  = require('body-parser');
const adRoutes = require('./routes/adRoutes');


const db          = require('./config/db'); // เชื่อมต่อ MySQL (pool)

// ทดสอบเชื่อมต่อ DB
db.getConnection()
  .then((connection) => {
    console.log("✅ Connected to MySQL database");
    connection.release(); // คืน connection ให้ pool
  })
  .catch((err) => {
    console.error("❌ Error connecting to MySQL:", err);
  });


const app = express();

/* ---------- Middleware พื้นฐาน ---------- */
app.use(morgan('dev'));               // แสดง log request
app.use(cors());                      // เปิด CORS ทุกโดเมน (ปรับให้เข้มขึ้นภายหลัง)
app.use(bodyParser.json());           // รับ JSON body
app.use(bodyParser.urlencoded({ extended: true })); // รับ form-urlencoded body
app.use('/api/ad', adRoutes);         // เส้นทาง AD

/* ---------- Routes ---------- */
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes   = require('./routes/vehicleRoutes');

app.use('/api/auth', authRoutes);     // เส้นทาง Auth ทั้งหมด
app.use('/api/vehicles', vehicleRoutes); // เส้นทาง Vehicles 

/* ---------- ทดสอบเส้นทาง root ---------- */
app.get('/', async (req, res) => {
  // ตรวจสอบเชื่อม DB ได้หรือไม่
  const [rows] = await db.query('SELECT NOW() AS now');
  res.json({ message: 'ระบบพร้อมทำงาน', dbTime: rows[0].now });
});

/* ---------- เริ่มต้นเซิร์ฟเวอร์ ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server รันที่ http://localhost:${PORT}`));
