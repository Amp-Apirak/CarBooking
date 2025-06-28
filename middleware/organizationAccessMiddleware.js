// middleware/organizationAccessMiddleware.js
// Middleware สำหรับตรวจสอบสิทธิ์การเข้าถึงองค์กร

const { checkOrganizationAccess, getOrganizationHierarchy } = require('../models/organizationModel');

/**
 * ตรวจสอบว่า user มีสิทธิ์เข้าถึงองค์กรที่ระบุหรือไม่
 * ใช้กับ routes ที่มี :organization_id parameter
 */
const checkOrgAccess = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const organization_id = req.params.organization_id || req.body.organization_id;

    if (!user_id) {
      return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    if (!organization_id) {
      return res.status(400).json({ error: 'ไม่พบ organization_id' });
    }

    const hasAccess = await checkOrganizationAccess(user_id, organization_id);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'คุณไม่มีสิทธิ์เข้าถึงองค์กรนี้' });
    }

    next();
  } catch (err) {
    console.error('Error in organizationAccess middleware:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' });
  }
};

/**
 * ตรวจสอบว่า user มีสิทธิ์เข้าถึงองค์กรหรือองค์กรลูกหลาน
 * ใช้สำหรับการดูข้อมูลแบบ hierarchy
 */
const checkOrgHierarchyAccess = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const organization_id = req.params.organization_id || req.body.organization_id;

    if (!user_id) {
      return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    if (!organization_id) {
      return res.status(400).json({ error: 'ไม่พบ organization_id' });
    }

    // ตรวจสอบว่ามีสิทธิ์เข้าถึงองค์กรนี้หรือไม่
    const hasAccess = await checkOrganizationAccess(user_id, organization_id);
    
    if (!hasAccess) {
      // ตรวจสอบว่าองค์กรนี้อยู่ใต้องค์กรที่ user มีสิทธิ์หรือไม่
      const hierarchy = await getOrganizationHierarchy(organization_id);
      let hasHierarchyAccess = false;
      
      for (const org of hierarchy) {
        if (await checkOrganizationAccess(user_id, org.organization_id)) {
          hasHierarchyAccess = true;
          break;
        }
      }
      
      if (!hasHierarchyAccess) {
        return res.status(403).json({ error: 'คุณไม่มีสิทธิ์เข้าถึงองค์กรนี้' });
      }
    }

    next();
  } catch (err) {
    console.error('Error in organizationHierarchyAccess middleware:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' });
  }
};

/**
 * Filter ข้อมูลให้แสดงเฉพาะองค์กรที่ user มีสิทธิ์เข้าถึง
 * ใช้กับ response ที่มีข้อมูลหลายองค์กร
 */
const filterAccessibleOrgs = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    
    if (!user_id) {
      return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    // เก็บ user_id ไว้ใน req เพื่อใช้ใน controller
    req.accessibleUserId = user_id;
    
    next();
  } catch (err) {
    console.error('Error in filterAccessibleOrgs middleware:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการกรองข้อมูล' });
  }
};

/**
 * ตรวจสอบว่า user เป็น Admin หรือมีสิทธิ์จัดการองค์กร
 */
const checkOrgManagePermission = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    // ตรวจสอบว่าเป็น admin หรือมี role ที่สามารถจัดการองค์กรได้
    // สามารถปรับแต่งตาม business logic ของแต่ละองค์กร
    if (user.role_name === 'admin' || user.role_name === 'org_manager') {
      return next();
    }

    return res.status(403).json({ error: 'คุณไม่มีสิทธิ์จัดการองค์กร' });
  } catch (err) {
    console.error('Error in checkOrgManagePermission middleware:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' });
  }
};

module.exports = {
  checkOrgAccess,
  checkOrgHierarchyAccess,
  filterAccessibleOrgs,
  checkOrgManagePermission,
};
