// controllers/organizationController.js
const {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getChildOrganizations,
  getOrganizationHierarchy,
  getUserAccessibleOrganizations,
  grantOrganizationAccess,
  revokeOrganizationAccess,
  checkOrganizationAccess,
} = require('../models/organizationModel');

/**
 * GET /api/organizations
 */
exports.list = async (req, res) => {
  try {
    const rows = await getAllOrganizations();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการองค์กรได้' });
  }
};

/**
 * GET /api/organizations/:id
 */
exports.getById = async (req, res) => {
  try {
    const org = await getOrganizationById(req.params.id);
    if (!org) {
      return res.status(404).json({ error: 'ไม่พบบริษัท/องค์กรที่ระบุ' });
    }
    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะดึงข้อมูลองค์กร' });
  }
};

/**
 * POST /api/organizations
 */
exports.create = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อองค์กร' });
    }
    const id = await createOrganization(name, parent_id);
    res.status(201).json({ organization_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถสร้างองค์กรใหม่ได้' });
  }
};

/**
 * PUT /api/organizations/:id
 */
exports.update = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    await updateOrganization(req.params.id, { name, parent_id });
    res.json({ message: 'แก้ไขข้อมูลองค์กรเรียบร้อย' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถแก้ไของค์กรได้' });
  }
};

/**
 * DELETE /api/organizations/:id
 */
exports.remove = async (req, res) => {
  try {
    await deleteOrganization(req.params.id);
    res.json({ message: 'ลบองค์กรเรียบร้อย' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถลบองค์กรได้' });
  }
};

/**
 * GET /api/organizations/:id/children
 * ดึงองค์กรลูกทั้งหมด
 */
exports.getChildren = async (req, res) => {
  try {
    const children = await getChildOrganizations(req.params.id);
    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการองค์กรลูกได้' });
  }
};

/**
 * GET /api/organizations/:id/hierarchy
 * ดึงองค์กรทั้งหมดในสายงาน (รวมลูกหลาน)
 */
exports.getHierarchy = async (req, res) => {
  try {
    const hierarchy = await getOrganizationHierarchy(req.params.id);
    res.json(hierarchy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถดึงโครงสร้างองค์กรได้' });
  }
};

/**
 * GET /api/organizations/accessible
 * ดึงรายการองค์กรที่ user สามารถเข้าถึงได้
 */
exports.getAccessible = async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }
    const organizations = await getUserAccessibleOrganizations(user_id);
    res.json(organizations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการองค์กรที่เข้าถึงได้' });
  }
};

/**
 * POST /api/organizations/:id/grant-access
 * ให้สิทธิ์ user เข้าถึงองค์กร
 */
exports.grantAccess = async (req, res) => {
  try {
    const { user_id } = req.body;
    const organization_id = req.params.id;
    const granted_by = req.user?.user_id;

    if (!user_id) {
      return res.status(400).json({ error: 'กรุณาระบุ user_id' });
    }

    await grantOrganizationAccess(user_id, organization_id, granted_by);
    res.json({ message: 'ให้สิทธิ์เข้าถึงองค์กรเรียบร้อย' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถให้สิทธิ์เข้าถึงองค์กรได้' });
  }
};

/**
 * DELETE /api/organizations/:id/revoke-access
 * ยกเลิกสิทธิ์การเข้าถึงองค์กร
 */
exports.revokeAccess = async (req, res) => {
  try {
    const { user_id } = req.body;
    const organization_id = req.params.id;

    if (!user_id) {
      return res.status(400).json({ error: 'กรุณาระบุ user_id' });
    }

    await revokeOrganizationAccess(user_id, organization_id);
    res.json({ message: 'ยกเลิกสิทธิ์เข้าถึงองค์กรเรียบร้อย' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถยกเลิกสิทธิ์เข้าถึงองค์กรได้' });
  }
};
