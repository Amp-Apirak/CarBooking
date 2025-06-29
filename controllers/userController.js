// controllers/userController.js
// ควบคุมการทำงานเกี่ยวกับ User Profile และ User Management

const bcryptjs = require("bcryptjs");
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  updateUserStatus,
  changeUserPassword,
  searchUsers,
  countUsers
} = require("../models/userModel");

/**
 * GET /api/users/profile
 * ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // จาก JWT middleware
    
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้"
      });
    }
    
    // ไม่ส่งรหัสผ่านกลับไป
    delete user.password;
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์",
      error: error.message
    });
  }
};

/**
 * PUT /api/users/profile
 * อัปเดตโปรไฟล์ผู้ใช้ปัจจุบัน
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // จาก JWT middleware
    const {
      first_name,
      last_name,
      gender,
      citizen_id,
      phone,
      address,
      country,
      province,
      postal_code
    } = req.body;
    
    // ตรวจสอบข้อมูลพื้นฐาน
    if (!first_name && !last_name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกชื่อหรือนามสกุล"
      });
    }
    
    const updatedUser = await updateUserProfile(userId, {
      first_name,
      last_name,
      gender,
      citizen_id,
      phone,
      address,
      country,
      province,
      postal_code
    });
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้"
      });
    }
    
    // ไม่ส่งรหัสผ่านกลับไป
    delete updatedUser.password;
    
    res.json({
      success: true,
      message: "อัปเดตโปรไฟล์สำเร็จ",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์",
      error: error.message
    });
  }
};

/**
 * POST /api/users/avatar
 * อัปโหลด avatar ของผู้ใช้
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.user_id; // จาก JWT middleware
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "กรุณาเลือกไฟล์รูปภาพ"
      });
    }
    
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    const updated = await updateUserAvatar(userId, avatarPath);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้"
      });
    }
    
    res.json({
      success: true,
      message: "อัปโหลด avatar สำเร็จ",
      data: {
        avatar_path: avatarPath
      }
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัปโหลด avatar",
      error: error.message
    });
  }
};

/**
 * PUT /api/users/change-password
 * เปลี่ยนรหัสผ่านของผู้ใช้ปัจจุบัน
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id; // จาก JWT middleware
    const { current_password, new_password } = req.body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่"
      });
    }
    
    // ตรวจสอบความยาวรหัสผ่านใหม่
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร"
      });
    }
    
    // ดึงข้อมูลผู้ใช้เพื่อตรวจสอบรหัสผ่านปัจจุบัน
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้"
      });
    }
    
    // ตรวจสอบรหัสผ่านปัจจุบัน
    const isCurrentPasswordValid = await bcryptjs.compare(current_password, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านปัจจุบันไม่ถูกต้อง"
      });
    }
    
    // เข้ารหัสรหัสผ่านใหม่
    const hashedNewPassword = await bcryptjs.hash(new_password, 10);
    
    // อัปเดตรหัสผ่าน
    const updated = await changeUserPassword(userId, hashedNewPassword);
    
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
      });
    }
    
    res.json({
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
      error: error.message
    });
  }
};

// ===== Admin Functions =====

/**
 * GET /api/users
 * ดึงรายการผู้ใช้ทั้งหมด (สำหรับ admin)
 */
exports.list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      organization_id
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const options = {
      limit: parseInt(limit),
      offset,
      status,
      organization_id
    };
    
    const [users, totalCount] = await Promise.all([
      getAllUsers(options),
      countUsers({ status, organization_id })
    ]);
    
    // ลบรหัสผ่านออกจากทุก record
    const sanitizedUsers = users.map(user => {
      delete user.password;
      return user;
    });
    
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    res.json({
      success: true,
      data: sanitizedUsers,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: totalCount,
        total_pages: totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      error: error.message
    });
  }
};

/**
 * GET /api/users/:id
 * ดึงข้อมูลผู้ใช้ตาม ID (สำหรับ admin)
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบผู้ใช้ที่ต้องการ"
      });
    }
    
    // ไม่ส่งรหัสผ่านกลับไป
    delete user.password;
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      error: error.message
    });
  }
};

/**
 * PUT /api/users/:id
 * อัปเดตข้อมูลผู้ใช้ (สำหรับ admin)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;
    
    const updatedUser = await updateUserProfile(id, profileData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบผู้ใช้ที่ต้องการอัปเดต"
      });
    }
    
    // ไม่ส่งรหัสผ่านกลับไป
    delete updatedUser.password;
    
    res.json({
      success: true,
      message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้",
      error: error.message
    });
  }
};

/**
 * PUT /api/users/:id/status
 * เปลี่ยนสถานะผู้ใช้ (สำหรับ admin)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "สถานะไม่ถูกต้อง (active, inactive, suspended)"
      });
    }
    
    const updated = await updateUserStatus(id, status);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบผู้ใช้ที่ต้องการอัปเดต"
      });
    }
    
    res.json({
      success: true,
      message: "เปลี่ยนสถานะผู้ใช้สำเร็จ"
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะผู้ใช้",
      error: error.message
    });
  }
};

/**
 * GET /api/users/search
 * ค้นหาผู้ใช้
 */
exports.search = async (req, res) => {
  try {
    const { q, organization_id, status } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกคำค้นหาอย่างน้อย 2 ตัวอักษร"
      });
    }
    
    const users = await searchUsers(q.trim(), {
      organization_id,
      status
    });
    
    // ลบรหัสผ่านออกจากทุก record
    const sanitizedUsers = users.map(user => {
      delete user.password;
      return user;
    });
    
    res.json({
      success: true,
      data: sanitizedUsers,
      total: sanitizedUsers.length,
      search_term: q.trim()
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการค้นหาผู้ใช้",
      error: error.message
    });
  }
};