// scripts/seed-vehicle-data.js
// สคริปต์เพิ่มข้อมูลเริ่มต้นสำหรับ vehicle types และ brands

require("dotenv").config();
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

async function seedVehicleData() {
  try {
    console.log("🌱 เริ่มเพิ่มข้อมูลเริ่มต้น...");

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const [existingTypes] = await db.query("SELECT COUNT(*) as count FROM vehicle_types");
    const [existingBrands] = await db.query("SELECT COUNT(*) as count FROM vehicle_brands");

    if (existingTypes[0].count > 0) {
      console.log("✅ มีข้อมูล vehicle types อยู่แล้ว");
    } else {
      // เพิ่ม vehicle types
      const vehicleTypes = [
        "รถยนต์",
        "รถตู้",
        "รถบรรทุก",
        "รถจักรยานยนต์",
        "รถโดยสาร"
      ];

      for (const typeName of vehicleTypes) {
        const typeId = uuidv4().replace(/-/g, "");
        await db.query(
          "INSERT INTO vehicle_types (type_id, name) VALUES (?, ?)",
          [typeId, typeName]
        );
        console.log(`✅ เพิ่ม vehicle type: ${typeName} (${typeId})`);
      }
    }

    if (existingBrands[0].count > 0) {
      console.log("✅ มีข้อมูล vehicle brands อยู่แล้ว");
    } else {
      // เพิ่ม vehicle brands
      const vehicleBrands = [
        "Toyota",
        "Honda",
        "Nissan",
        "Mazda",
        "Ford",
        "Chevrolet",
        "Isuzu",
        "Mitsubishi"
      ];

      for (const brandName of vehicleBrands) {
        const brandId = uuidv4().replace(/-/g, "");
        await db.query(
          "INSERT INTO vehicle_brands (brand_id, name) VALUES (?, ?)",
          [brandId, brandName]
        );
        console.log(`✅ เพิ่ม vehicle brand: ${brandName} (${brandId})`);
      }
    }

    // แสดงข้อมูลที่มีอยู่
    console.log("\n📋 Vehicle Types ที่มีอยู่:");
    const [types] = await db.query("SELECT type_id, name FROM vehicle_types");
    types.forEach(type => {
      console.log(`  - ${type.name} (ID: ${type.type_id})`);
    });

    console.log("\n📋 Vehicle Brands ที่มีอยู่:");
    const [brands] = await db.query("SELECT brand_id, name FROM vehicle_brands");
    brands.forEach(brand => {
      console.log(`  - ${brand.name} (ID: ${brand.brand_id})`);
    });

    console.log("\n🎉 เพิ่มข้อมูลเริ่มต้นเสร็จสิ้น!");

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
  } finally {
    process.exit(0);
  }
}

seedVehicleData();
