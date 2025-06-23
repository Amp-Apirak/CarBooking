const {
  listByBooking,
  getPaged,
  getById,
  addEquipment,
  updateEquipment,
  removeEquipment,
  countAll,
} = require("../models/bookingEquipmentModel");

exports.getAll = async (req, res) => {
  const bookingId = req.params.id;
  const items = await listByBooking(bookingId);
  res.json(items);
};

exports.getPaged = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const data = await getPaged(page, limit);
  const total = await countAll();
  res.json({
    data,
    pagination: { page, limit, totalPages: Math.ceil(total / limit) },
  });
};

exports.getById = async (req, res) => {
  const { id, equipId } = req.params;
  const item = await getById(id, equipId);
  if (!item) return res.status(404).json({ error: "ไม่พบข้อมูล" });
  res.json(item);
};

exports.add = async (req, res) => {
  const bookingId = req.params.id;
  const { equipment_id, quantity } = req.body;
  await addEquipment(bookingId, equipment_id, quantity);
  res.status(201).json({
    message: "เพิ่มอุปกรณ์เรียบร้อย",
    equipment_id,
    quantity,
  });
};

exports.update = async (req, res) => {
  const bookingId = req.params.id;
  const equipmentId = req.params.equipId;
  const { quantity } = req.body;
  await updateEquipment(bookingId, equipmentId, quantity);
  res.json({ message: "อัปเดตจำนวนเรียบร้อย" });
};

exports.remove = async (req, res) => {
  const bookingId = req.params.id;
  const equipmentId = req.params.equipId;
  await removeEquipment(bookingId, equipmentId);
  res.json({ message: "ลบอุปกรณ์เรียบร้อย" });
};
