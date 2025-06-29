// controllers/userAllowedOrgController.js
const allowedOrgModel = require("../models/userAllowedOrgModel");

exports.assignOrg = async (req, res) => {
  const { user_id, organization_id } = req.body;
  const granted_by = req.user.user_id;
  if (!user_id || !organization_id) {
    return res
      .status(400)
      .json({ error: "ต้องระบุ user_id และ organization_id" });
  }
  try {
    const id = await allowedOrgModel.assignOrg(
      user_id,
      organization_id,
      granted_by
    );
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "มอบสิทธิ์องค์กรให้ผู้ใช้ไม่สำเร็จ" });
  }
};

exports.removeOrg = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "ต้องระบุ id" });
  }
  try {
    await allowedOrgModel.removeOrg(id);
    res.json({ message: "ถอนสิทธิ์องค์กรเรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ถอนสิทธิ์องค์กรไม่สำเร็จ" });
  }
};

exports.listAllowedOrgs = async (req, res) => {
  const { user_id } = req.params;
  try {
    const rows = await allowedOrgModel.getAllowedOrgs(user_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถดึงสิทธิ์องค์กรของผู้ใช้ได้" });
  }
};
