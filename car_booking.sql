-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2025 at 06:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `approvals`
--

CREATE TABLE `approvals` (
  `approval_id` char(32) NOT NULL COMMENT 'รหัสการอนุมัติแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `booking_id` char(32) NOT NULL COMMENT 'รหัสการจอง (FK → bookings.booking_id)',
  `approver_id` char(32) NOT NULL COMMENT 'รหัสผู้อนุมัติ (FK → users.user_id)',
  `step` tinyint(4) NOT NULL COMMENT 'ลำดับขั้นการอนุมัติ (1–5)',
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending' COMMENT 'สถานะการอนุมัติ (pending=รอ, approved=อนุมัติ, rejected=ไม่อนุมัติ)',
  `comment` text DEFAULT NULL COMMENT 'ความคิดเห็นหรือเหตุผลในการอนุมัติ/ปฏิเสธ',
  `approved_at` timestamp NULL DEFAULT NULL COMMENT 'วันที่อนุมัติ/ปฏิเสธ',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้าง record การอนุมัติ',
  `step_id` char(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลการอนุมัติการจองรถแต่ละขั้น';

-- --------------------------------------------------------

--
-- Table structure for table `approval_flows`
--

CREATE TABLE `approval_flows` (
  `flow_id` char(32) NOT NULL,
  `flow_name` varchar(100) NOT NULL,
  `flow_description` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `approval_steps`
--

CREATE TABLE `approval_steps` (
  `step_id` char(32) NOT NULL,
  `flow_id` char(32) DEFAULT NULL,
  `step_order` int(11) NOT NULL,
  `role_id` char(32) DEFAULT NULL,
  `step_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` char(32) NOT NULL COMMENT 'รหัสบันทึกประวัติแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `user_id` char(32) NOT NULL COMMENT 'รหัสผู้ใช้งาน (FK → users.user_id)',
  `module` varchar(50) NOT NULL COMMENT 'ชื่อโมดูลที่มีการกระทำ เช่น bookings, users, vehicles',
  `action` varchar(100) NOT NULL COMMENT 'รายละเอียดการกระทำ เช่น create_booking, update_profile',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'ที่อยู่ IP ของผู้ใช้งาน',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่และเวลาที่บันทึกเหตุการณ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางบันทึกประวัติการใช้งานระบบ';

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` char(32) NOT NULL COMMENT 'รหัสการจองแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `user_id` char(32) NOT NULL COMMENT 'รหัสผู้จอง (FK → users.user_id)',
  `vehicle_id` char(32) NOT NULL COMMENT 'รหัสรถ (FK → vehicles.vehicle_id)',
  `driver_id` char(32) DEFAULT NULL COMMENT 'รหัสพนักงานขับรถ (FK → drivers.driver_id) ถ้าไม่มีคนขับให้เป็น NULL',
  `num_passengers` int(11) NOT NULL COMMENT 'จำนวนผู้โดยสาร',
  `reason` text DEFAULT NULL COMMENT 'เหตุผลหรือรายละเอียดการขอใช้งาน',
  `phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ผู้จอง',
  `start_date` date NOT NULL COMMENT 'วันที่เริ่มใช้งาน',
  `start_time` time NOT NULL COMMENT 'เวลาที่เริ่มใช้งาน',
  `end_date` date NOT NULL COMMENT 'วันที่สิ้นสุดการใช้งาน',
  `end_time` time NOT NULL COMMENT 'เวลาที่สิ้นสุดการใช้งาน',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างการจอง',
  `origin_location` varchar(255) DEFAULT NULL COMMENT 'สถานที่ต้นทาง',
  `destination_location` varchar(255) DEFAULT NULL COMMENT 'สถานที่ปลายทาง',
  `start_odometer` int(11) DEFAULT NULL COMMENT 'เลขไมค์ขาไป',
  `end_odometer` int(11) DEFAULT NULL COMMENT 'เลขไมค์ขากลับ',
  `total_distance` decimal(10,2) DEFAULT NULL COMMENT 'ระยะทางรวม (กิโลเมตร)',
  `status` enum('pending','approved','rejected','cancelled_by_user','cancelled_by_officer') NOT NULL DEFAULT 'pending' COMMENT 'สถานะการจอง (pending=รออนุมัติ, approved=อนุมัติ, rejected=ไม่อนุมัติ, cancelled_by_user=ยกเลิกโดยผู้จอง, cancelled_by_officer=ยกเลิกโดยเจ้าหน้าที่)',
  `flow_id` char(32) DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลการจองรถ';

-- --------------------------------------------------------

--
-- Table structure for table `booking_approval_logs`
--

CREATE TABLE `booking_approval_logs` (
  `log_id` char(32) NOT NULL,
  `booking_id` char(32) NOT NULL,
  `step_id` char(32) NOT NULL,
  `approved_by` char(32) NOT NULL,
  `approved_at` datetime DEFAULT current_timestamp(),
  `status` enum('approved','rejected') NOT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_approval_status`
--

CREATE TABLE `booking_approval_status` (
  `booking_id` char(32) NOT NULL,
  `flow_id` char(32) NOT NULL,
  `current_step_order` int(11) NOT NULL DEFAULT 1,
  `is_approved` tinyint(1) DEFAULT 0,
  `is_rejected` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_equipments`
--

CREATE TABLE `booking_equipments` (
  `booking_equipment_id` char(32) NOT NULL COMMENT 'รหัสเชื่อมโยงการจอง-อุปกรณ์แบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `booking_id` char(32) NOT NULL COMMENT 'รหัสการจอง (FK → bookings.booking_id)',
  `equipment_id` char(32) NOT NULL COMMENT 'รหัสอุปกรณ์เสริม (FK → equipments.equipment_id)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่เพิ่มอุปกรณ์เสริมให้กับการจอง',
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมการจองกับอุปกรณ์เสริม';

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` char(32) NOT NULL COMMENT 'รหัสพนักงานขับรถแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อ-นามสกุลพนักงานขับรถ',
  `phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์พนักงานขับรถ',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่เพิ่มพนักงานขับรถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลพนักงานขับรถ';

-- --------------------------------------------------------

--
-- Table structure for table `equipments`
--

CREATE TABLE `equipments` (
  `equipment_id` char(32) NOT NULL COMMENT 'รหัสอุปกรณ์เสริมแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `equipment_name` varchar(100) NOT NULL COMMENT 'ชื่ออุปกรณ์เสริม เช่น GPS, ที่ชาร์จมือถือ',
  `description` varchar(254) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างรายการอุปกรณ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลอุปกรณ์เสริม';

-- --------------------------------------------------------

--
-- Table structure for table `jwt_blacklist`
--

CREATE TABLE `jwt_blacklist` (
  `jti` char(36) NOT NULL COMMENT 'UUID v4 ของ token',
  `user_id` char(32) NOT NULL,
  `expired_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `organization_id` char(32) NOT NULL,
  `parent_id` char(32) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อแผนก',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างแผนก'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลแผนก';

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`organization_id`, `parent_id`, `path`, `name`, `created_at`) VALUES
('2e950612491a11f08b210242ac120002', NULL, '2e950612491a11f08b210242ac120002', 'Point TI', '2025-06-28 15:41:15'),
('bf4f9c05543611f097453417ebbed40a', '2e950612491a11f08b210242ac120002', '2e950612491a11f08b210242ac120002/bf4f9c05543611f097453417ebbed40a', 'องค์การบริหารส่วนจังหวัดชลบุรี', '2025-06-28 15:44:17'),
('bf515beb543711f097453417ebbed40a', 'bf4f9c05543611f097453417ebbed40a', '2e950612491a11f08b210242ac120002/bf4f9c05543611f097453417ebbed40a/bf515beb543711f097453417ebbed40a', 'โรงพยาบาลส่งเสริมสุขภาพบ้านห้วยสูบ', '2025-06-28 15:51:26'),
('d6149e48543811f097453417ebbed40a', 'bf4f9c05543611f097453417ebbed40a', '2e950612491a11f08b210242ac120002/bf4f9c05543611f097453417ebbed40a/d6149e48543811f097453417ebbed40a', 'โรงพยาบาลส่งเสริมสุขภาพหนองหงษ์', '2025-06-28 15:59:14');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` char(32) NOT NULL COMMENT 'รหัสสิทธิ์แบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อสิทธิ์ เช่น create_booking, approve_booking',
  `description` text DEFAULT NULL COMMENT 'รายละเอียดเพิ่มเติมของสิทธิ์',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างสิทธิ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บสิทธิ์ต่างๆ ในระบบ';

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `description`, `created_at`) VALUES
('6f6caa1d4d764e02b3ad938420d53bde', 'approve_booking', 'อนุมัติ/ปฏิเสธการจอง', '2025-06-28 16:02:08'),
('db208d5446734211b6f01c92cabf5f8e', 'manage_vehicles', 'จัดการรายการยานพาหนะ', '2025-06-28 16:02:17'),
('f0789ee3639f421d8c3a1131dd90423d', 'create_booking', 'สร้างการจอง', '2025-06-28 16:01:51');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `token_id` char(36) NOT NULL COMMENT 'รหัส token',
  `user_id` char(32) NOT NULL COMMENT 'FK → users.user_id',
  `token_hash` char(64) NOT NULL COMMENT 'เก็บเป็น hash เพื่อความปลอดภัย',
  `expired_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'วันหมดอายุ เช่น 7 วัน',
  `revoked_at` timestamp NULL DEFAULT NULL COMMENT 'วันเวลาที่เพิกถอน (NULL = ยังใช้ได้)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้าง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บ refresh token ต่อผู้ใช้';

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`token_id`, `user_id`, `token_hash`, `expired_at`, `revoked_at`, `created_at`) VALUES
('2a32af64-380c-4ba8-b58c-c22b9e28b963', '8b06d87178544b52b9269eafc89c4cb0', '31adad82e5ad885527590e64bc4e22c09b7873ca60e3744993d96c8539674429', '2025-07-05 16:15:10', NULL, '2025-06-28 16:15:10'),
('332548de-5752-4c7a-b10a-850be9bbc64a', '036354d67ec34f9eb28cd26c8b2ec26e', 'd804e56d887c12cd65f6f21e36df8d83adae20e7436d0e8b13f3011823ae5e34', '2025-07-05 15:49:54', NULL, '2025-06-28 15:49:54'),
('6af44aca-79c1-4fb5-92f3-1c93a6d4092b', '036354d67ec34f9eb28cd26c8b2ec26e', 'a9521b8d1ba3df0181bed085bc700fd44a6522ec2ac40a38b2edd5828080c9f2', '2025-07-05 16:08:55', NULL, '2025-06-28 16:08:55'),
('716e4fef-bd7f-4b5e-a58c-d561b41fbe44', 'f9591a0215794225b088d53b6d2ef37d', '030e78a415f0b3e3e8c929d62745f36d6b1c98d74d0fb16258aeea2a01386662', '2025-07-05 16:14:53', NULL, '2025-06-28 16:14:53'),
('779e1034-81a3-4d8b-891d-98985368e2d4', 'f31524fdbb9f4460b7c5f80fda33cf08', '5aa89304378ef45052c42a24eb5083c2a1561dd3031b15c5f9e312241085e5f6', '2025-07-05 16:14:13', NULL, '2025-06-28 16:14:13'),
('bd2c77bd-cf27-4ff6-9bb8-f400843d99da', 'aadaec379b964a44ac33896816f752ad', 'fe2e99d428ea85aaed75e903143024aec2c8a4edb848f0cffc735b20ca2c9c72', '2025-07-05 16:14:22', NULL, '2025-06-28 16:14:22'),
('cb65206b-5bea-4c78-ae69-0d5e737e4b89', '5ed0cce547ea4898aca5ee633449c2fb', 'c6532139a289aca1874014f59641d187abc3282c09e5ef672583db10739fb994', '2025-07-05 16:13:17', NULL, '2025-06-28 16:13:17'),
('e10479fa-7a0f-4609-b5b1-d1e2298a8fa0', '3699f1ea64684ac78b02afd1fb9b3cdd', 'b528c6f1fc385464c80998cdf67223301e4bf20f3c398b52f2ec439d750e57c7', '2025-07-05 16:14:02', NULL, '2025-06-28 16:14:02'),
('f3bac213-8f21-4028-bfc6-37fb7dd27193', '036354d67ec34f9eb28cd26c8b2ec26e', '1486bdc2552858bde5b349ec323394217393795ff55c12d149014e4badfb1404', '2025-07-05 15:43:14', NULL, '2025-06-28 15:43:14');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` char(32) NOT NULL COMMENT 'รหัสบทบาทแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) NOT NULL COMMENT 'ชื่อบทบาท เช่น admin, manager, staff',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างบทบาท'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บบทบาทของผู้ใช้งาน';

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `created_at`) VALUES
('5e600f16228846a59f512dcda88b1fc0', 'admin', '2025-06-28 16:00:40'),
('687e5497bfdc447da1e6e4d98827b46c', 'staff', '2025-06-28 16:00:56'),
('850f38dc62364a8ca0adadce762a46b5', 'manager', '2025-06-28 16:00:49'),
('ac171b33817c4b889666abe978e11baa', 'approve', '2025-06-28 16:01:07');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_permission_id` char(32) NOT NULL COMMENT 'รหัสเชื่อมโยงบทบาท-สิทธิ์ UUID v4 ไม่มีขีด (32 หลัก)',
  `role_id` char(32) NOT NULL COMMENT 'รหัสบทบาท (FK → roles.role_id)',
  `permission_id` char(32) NOT NULL COMMENT 'รหัสสิทธิ์ (FK → permissions.permission_id)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้าง mapping'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมบทบาทกับสิทธิ์';

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_permission_id`, `role_id`, `permission_id`, `created_at`) VALUES
('27f75f120e04480da922b5c5df432957', '5e600f16228846a59f512dcda88b1fc0', 'f0789ee3639f421d8c3a1131dd90423d', '2025-06-28 16:09:56'),
('6b66c835f4784b808e72168ff7aaad82', 'ac171b33817c4b889666abe978e11baa', 'f0789ee3639f421d8c3a1131dd90423d', '2025-06-28 16:11:21'),
('6c52f9ede5ae4c49a583f1d29b671aef', 'ac171b33817c4b889666abe978e11baa', '6f6caa1d4d764e02b3ad938420d53bde', '2025-06-28 16:11:15'),
('6dc555cac66448588366b57f802d21f7', '850f38dc62364a8ca0adadce762a46b5', 'db208d5446734211b6f01c92cabf5f8e', '2025-06-28 16:10:38'),
('9bd6da43bf63492e8f719a2c3573bba2', '850f38dc62364a8ca0adadce762a46b5', 'f0789ee3639f421d8c3a1131dd90423d', '2025-06-28 16:10:23'),
('bdf455fbc6874f8698db92a506e6e192', '5e600f16228846a59f512dcda88b1fc0', 'db208d5446734211b6f01c92cabf5f8e', '2025-06-28 16:09:51'),
('f099dec316a1441cbffcd71308da881b', '5e600f16228846a59f512dcda88b1fc0', '6f6caa1d4d764e02b3ad938420d53bde', '2025-06-28 16:09:45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(32) NOT NULL COMMENT 'รหัสผู้ใช้งานแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `username` varchar(50) NOT NULL COMMENT 'ชื่อบัญชี (Account) ใช้สำหรับล็อกอิน',
  `email` varchar(100) NOT NULL COMMENT 'อีเมลของผู้ใช้',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่าน (เก็บเป็น hash ด้วย bcryptjs)',
  `first_name` varchar(100) DEFAULT NULL COMMENT 'ชื่อจริงของผู้ใช้',
  `last_name` varchar(100) DEFAULT NULL COMMENT 'นามสกุลของผู้ใช้',
  `gender` enum('male','female','other') DEFAULT NULL COMMENT 'เพศ (ชาย, หญิง, ไม่ระบุ)',
  `citizen_id` varchar(13) DEFAULT NULL COMMENT 'เลขบัตรประชาชน 13 หลัก',
  `phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์',
  `address` text DEFAULT NULL COMMENT 'ที่อยู่',
  `country` varchar(100) DEFAULT NULL COMMENT 'ประเทศ',
  `province` varchar(100) DEFAULT NULL COMMENT 'จังหวัด',
  `postal_code` varchar(10) DEFAULT NULL COMMENT 'รหัสไปรษณีย์',
  `avatar_path` varchar(255) DEFAULT NULL COMMENT 'พาธหรือ URL รูปโปรไฟล์ (Avatar)',
  `organization_id` char(32) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'สถานะสมาชิก (active=ใช้งานได้, inactive=ระงับ)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างบัญชี',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'วันที่แก้ไขข้อมูลล่าสุด'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลสมาชิกระบบ';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `first_name`, `last_name`, `gender`, `citizen_id`, `phone`, `address`, `country`, `province`, `postal_code`, `avatar_path`, `organization_id`, `status`, `created_at`, `updated_at`) VALUES
('036354d67ec34f9eb28cd26c8b2ec26e', 'admin', 'admin@example.com', '$2b$10$IgWPGMwS9MRxNon7f5qu/uL8U.xihrNV.8VfgcI7x1iz/9Tit9aNq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2e950612491a11f08b210242ac120002', 'active', '2025-06-28 15:43:14', NULL),
('3699f1ea64684ac78b02afd1fb9b3cdd', 'approve_one', 'approve_one@example.com', '$2b$10$jY8gbo9G/JxStjsiBj7E5eBqGZ4L/GV01Q4QWo017eYi/aEutOHSO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bf4f9c05543611f097453417ebbed40a', 'active', '2025-06-28 16:14:02', NULL),
('5ed0cce547ea4898aca5ee633449c2fb', 'manager', 'manager@example.com', '$2b$10$BKg8rwgxgRJCR6yBxB1GheSABCjdD/5lGwCBwF4f/lZgPbb9mBtqe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bf4f9c05543611f097453417ebbed40a', 'active', '2025-06-28 16:13:17', NULL),
('8b06d87178544b52b9269eafc89c4cb0', 'staff_two', 'staff_two@example.com', '$2b$10$QM5UHLDfzzXPtxdidxdq7.QoE/go6.skRr9LcU8nthwqVCSIHddta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'd6149e48543811f097453417ebbed40a', 'active', '2025-06-28 16:15:10', NULL),
('aadaec379b964a44ac33896816f752ad', 'approve_tree', 'approve_tree@example.com', '$2b$10$TjRr6GYuYLa1rPWIsrZvH.d3NzGMNJZNH4saItXzUmr571X0/tFrW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bf4f9c05543611f097453417ebbed40a', 'active', '2025-06-28 16:14:22', NULL),
('f31524fdbb9f4460b7c5f80fda33cf08', 'approve_two', 'approve_two@example.com', '$2b$10$1Pa56mRTUNTwhJEfz09iGOkXH2.motGkC/ywzWwZyu509UnujRp52', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bf4f9c05543611f097453417ebbed40a', 'active', '2025-06-28 16:14:13', NULL),
('f9591a0215794225b088d53b6d2ef37d', 'staff_one', 'staff_one@example.com', '$2b$10$aIP0lKPI/3KsHnVdC0kO3OSdYtsOBBf8GZMBCIiotzEElESr1qQuK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bf515beb543711f097453417ebbed40a', 'active', '2025-06-28 16:14:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_allowed_orgs`
--

CREATE TABLE `user_allowed_orgs` (
  `id` char(32) NOT NULL,
  `user_id` char(32) NOT NULL,
  `organization_id` char(32) NOT NULL,
  `granted_by` char(32) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_role_id` char(32) NOT NULL COMMENT 'รหัสเชื่อมโยงผู้ใช้-บทบาท UUID v4 ไม่มีขีด (32 หลัก)',
  `user_id` char(32) NOT NULL COMMENT 'รหัสผู้ใช้ (FK → users.user_id)',
  `role_id` char(32) NOT NULL COMMENT 'รหัสบทบาท (FK → roles.role_id)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่กำหนดบทบาทให้ผู้ใช้'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมผู้ใช้กับบทบาท';

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` char(32) NOT NULL COMMENT 'รหัสยานพาหนะแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `license_plate` varchar(20) NOT NULL COMMENT 'ทะเบียนรถ เช่น กข 1234',
  `type_id` char(32) NOT NULL COMMENT 'รหัสประเภทยานพาหนะ (FK → vehicle_types.type_id)',
  `brand_id` char(32) NOT NULL COMMENT 'รหัสยี่ห้อรถ (FK → vehicle_brands.brand_id)',
  `capacity` int(11) NOT NULL COMMENT 'จำนวนที่นั่ง',
  `color` varchar(50) DEFAULT NULL COMMENT 'สีของยานพาหนะ',
  `description` text DEFAULT NULL COMMENT 'รายละเอียดเพิ่มเติมของยานพาหนะ',
  `image_path` varchar(255) DEFAULT NULL COMMENT 'พาธหรือ URL รูปภาพของรถ',
  `is_public` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'สถานะเผยแพร่ (1=เผยแพร่, 0=ไม่เผยแพร่)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่เพิ่มข้อมูลรถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลยานพาหนะ';

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_brands`
--

CREATE TABLE `vehicle_brands` (
  `brand_id` char(32) NOT NULL COMMENT 'รหัสยี่ห้อแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) NOT NULL COMMENT 'ชื่อยี่ห้อ เช่น Mitsubishi, Toyota',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างยี่ห้อ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บยี่ห้อของยานพาหนะ';

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_equipments`
--

CREATE TABLE `vehicle_equipments` (
  `vehicle_equipment_id` char(32) NOT NULL COMMENT 'รหัสเชื่อมโยงรถ-อุปกรณ์ UUID v4 ไม่มีขีด (32 หลัก)',
  `vehicle_id` char(32) NOT NULL COMMENT 'รหัสรถ (FK → vehicles.vehicle_id)',
  `equipment_id` char(32) NOT NULL COMMENT 'รหัสอุปกรณ์เสริม (FK → equipments.equipment_id)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่เพิ่มอุปกรณ์ให้รถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมรถกับอุปกรณ์เสริม';

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `type_id` char(32) NOT NULL COMMENT 'รหัสประเภทยานพาหนะแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) NOT NULL COMMENT 'ชื่อประเภท เช่น รถกระบะ, รถตู้',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างประเภทยานพาหนะ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บประเภทของยานพาหนะ';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approvals`
--
ALTER TABLE `approvals`
  ADD PRIMARY KEY (`approval_id`),
  ADD KEY `fk_apv_booking` (`booking_id`),
  ADD KEY `fk_apv_user` (`approver_id`),
  ADD KEY `step_id` (`step_id`);

--
-- Indexes for table `approval_flows`
--
ALTER TABLE `approval_flows`
  ADD PRIMARY KEY (`flow_id`);

--
-- Indexes for table `approval_steps`
--
ALTER TABLE `approval_steps`
  ADD PRIMARY KEY (`step_id`),
  ADD KEY `flow_id` (`flow_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_al_user` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `fk_b_user` (`user_id`),
  ADD KEY `fk_b_vehicle` (`vehicle_id`),
  ADD KEY `fk_b_driver` (`driver_id`),
  ADD KEY `flow_id` (`flow_id`);

--
-- Indexes for table `booking_approval_logs`
--
ALTER TABLE `booking_approval_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `step_id` (`step_id`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `booking_approval_status`
--
ALTER TABLE `booking_approval_status`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `flow_id` (`flow_id`);

--
-- Indexes for table `booking_equipments`
--
ALTER TABLE `booking_equipments`
  ADD PRIMARY KEY (`booking_equipment_id`),
  ADD KEY `fk_be_booking` (`booking_id`),
  ADD KEY `fk_be_equipment` (`equipment_id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`);

--
-- Indexes for table `equipments`
--
ALTER TABLE `equipments`
  ADD PRIMARY KEY (`equipment_id`);

--
-- Indexes for table `jwt_blacklist`
--
ALTER TABLE `jwt_blacklist`
  ADD PRIMARY KEY (`jti`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`organization_id`),
  ADD KEY `fk_org_parent` (`parent_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_permission_id`),
  ADD KEY `fk_rp_role` (`role_id`),
  ADD KEY `fk_rp_permission` (`permission_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_organization` (`organization_id`);

--
-- Indexes for table `user_allowed_orgs`
--
ALTER TABLE `user_allowed_orgs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_role_id`),
  ADD KEY `fk_ur_user` (`user_id`),
  ADD KEY `fk_ur_role` (`role_id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `license_plate` (`license_plate`),
  ADD KEY `fk_vehicle_type` (`type_id`),
  ADD KEY `fk_vehicle_brand` (`brand_id`);

--
-- Indexes for table `vehicle_brands`
--
ALTER TABLE `vehicle_brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `vehicle_equipments`
--
ALTER TABLE `vehicle_equipments`
  ADD PRIMARY KEY (`vehicle_equipment_id`),
  ADD KEY `fk_ve_vehicle` (`vehicle_id`),
  ADD KEY `fk_ve_equipment` (`equipment_id`);

--
-- Indexes for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`type_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `approvals`
--
ALTER TABLE `approvals`
  ADD CONSTRAINT `approvals_ibfk_1` FOREIGN KEY (`step_id`) REFERENCES `approval_steps` (`step_id`),
  ADD CONSTRAINT `fk_apv_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_apv_user` FOREIGN KEY (`approver_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `approval_steps`
--
ALTER TABLE `approval_steps`
  ADD CONSTRAINT `approval_steps_ibfk_1` FOREIGN KEY (`flow_id`) REFERENCES `approval_flows` (`flow_id`),
  ADD CONSTRAINT `approval_steps_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`flow_id`) REFERENCES `approval_flows` (`flow_id`),
  ADD CONSTRAINT `fk_b_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`),
  ADD CONSTRAINT `fk_b_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_b_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);

--
-- Constraints for table `booking_approval_logs`
--
ALTER TABLE `booking_approval_logs`
  ADD CONSTRAINT `booking_approval_logs_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `booking_approval_logs_ibfk_2` FOREIGN KEY (`step_id`) REFERENCES `approval_steps` (`step_id`),
  ADD CONSTRAINT `booking_approval_logs_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `booking_approval_status`
--
ALTER TABLE `booking_approval_status`
  ADD CONSTRAINT `booking_approval_status_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `booking_approval_status_ibfk_2` FOREIGN KEY (`flow_id`) REFERENCES `approval_flows` (`flow_id`);

--
-- Constraints for table `booking_equipments`
--
ALTER TABLE `booking_equipments`
  ADD CONSTRAINT `fk_be_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_be_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`),
  ADD CONSTRAINT `fk_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`);

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `fk_org_parent` FOREIGN KEY (`parent_id`) REFERENCES `organizations` (`organization_id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`),
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`);

--
-- Constraints for table `user_allowed_orgs`
--
ALTER TABLE `user_allowed_orgs`
  ADD CONSTRAINT `user_allowed_orgs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `user_allowed_orgs_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_vehicle_brand` FOREIGN KEY (`brand_id`) REFERENCES `vehicle_brands` (`brand_id`),
  ADD CONSTRAINT `fk_vehicle_type` FOREIGN KEY (`type_id`) REFERENCES `vehicle_types` (`type_id`);

--
-- Constraints for table `vehicle_equipments`
--
ALTER TABLE `vehicle_equipments`
  ADD CONSTRAINT `fk_ve_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`),
  ADD CONSTRAINT `fk_ve_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
