// testUserModel.js
const bcrypt = require('bcryptjs');
const { createUser, getUserByUsername } = require('./models/userModel');

(async () => {
  // 1) สร้าง user ใหม่
  const hashed = await bcrypt.hash('P@ssw0rd!', 10);
  const newId = await createUser({
    username: 'testuser',
    email: 'test@example.com',
    password: hashed,
    first_name: 'ทดสอบ',
    last_name: 'โมเดล',
    gender: 'other',
    citizen_id: '1234567890123',
    phone: '0812345678',
    address: '123/4 ถ.ทดสอบ',
    country: 'Thailand',
    province: 'Bangkok',
    postal_code: '10200',
    avatar_path: null,
    department_id: '2e950612491a11f08b210242ac120002',
  });
  console.log('Created user_id:', newId);

  // 2) ดึงข้อมูลตาม username
  const user = await getUserByUsername('testuser');
  console.log('userData:', user);
  process.exit(0);
})();
