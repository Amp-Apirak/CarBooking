-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Jun 21, 2025 at 03:18 AM
-- Server version: 8.0.42
-- PHP Version: 8.2.27

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
  `approval_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสการอนุมัติแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `booking_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสการจอง (FK → bookings.booking_id)',
  `approver_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสผู้อนุมัติ (FK → users.user_id)',
  `step` tinyint NOT NULL COMMENT 'ลำดับขั้นการอนุมัติ (1–5)',
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'สถานะการอนุมัติ (pending=รอ, approved=อนุมัติ, rejected=ไม่อนุมัติ)',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'ความคิดเห็นหรือเหตุผลในการอนุมัติ/ปฏิเสธ',
  `approved_at` timestamp NULL DEFAULT NULL COMMENT 'วันที่อนุมัติ/ปฏิเสธ',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง record การอนุมัติ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลการอนุมัติการจองรถแต่ละขั้น';

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสบันทึกประวัติแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสผู้ใช้งาน (FK → users.user_id)',
  `module` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อโมดูลที่มีการกระทำ เช่น bookings, users, vehicles',
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รายละเอียดการกระทำ เช่น create_booking, update_profile',
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ที่อยู่ IP ของผู้ใช้งาน',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่และเวลาที่บันทึกเหตุการณ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางบันทึกประวัติการใช้งานระบบ';

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสการจองแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสผู้จอง (FK → users.user_id)',
  `vehicle_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสรถ (FK → vehicles.vehicle_id)',
  `driver_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'รหัสพนักงานขับรถ (FK → drivers.driver_id) ถ้าไม่มีคนขับให้เป็น NULL',
  `num_passengers` int NOT NULL COMMENT 'จำนวนผู้โดยสาร',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'เหตุผลหรือรายละเอียดการขอใช้งาน',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ผู้จอง',
  `start_date` date NOT NULL COMMENT 'วันที่เริ่มใช้งาน',
  `start_time` time NOT NULL COMMENT 'เวลาที่เริ่มใช้งาน',
  `end_date` date NOT NULL COMMENT 'วันที่สิ้นสุดการใช้งาน',
  `end_time` time NOT NULL COMMENT 'เวลาที่สิ้นสุดการใช้งาน',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างการจอง',
  `origin_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'สถานที่ต้นทาง',
  `destination_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'สถานที่ปลายทาง',
  `start_odometer` int DEFAULT NULL COMMENT 'เลขไมค์ขาไป',
  `end_odometer` int DEFAULT NULL COMMENT 'เลขไมค์ขากลับ',
  `total_distance` decimal(10,2) DEFAULT NULL COMMENT 'ระยะทางรวม (กิโลเมตร)',
  `status` enum('pending','approved','rejected','cancelled_by_user','cancelled_by_officer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'สถานะการจอง (pending=รออนุมัติ, approved=อนุมัติ, rejected=ไม่อนุมัติ, cancelled_by_user=ยกเลิกโดยผู้จอง, cancelled_by_officer=ยกเลิกโดยเจ้าหน้าที่)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลการจองรถ';

-- --------------------------------------------------------

--
-- Table structure for table `booking_equipments`
--

CREATE TABLE `booking_equipments` (
  `booking_equipment_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสเชื่อมโยงการจอง-อุปกรณ์แบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `booking_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสการจอง (FK → bookings.booking_id)',
  `equipment_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสอุปกรณ์เสริม (FK → equipments.equipment_id)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่เพิ่มอุปกรณ์เสริมให้กับการจอง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมการจองกับอุปกรณ์เสริม';

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสแผนกแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อแผนก',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างแผนก'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลแผนก';

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `name`, `created_at`) VALUES
('2e950612491a11f08b210242ac120002', 'ฝ่ายบุคคล', '2025-06-14 12:22:04'),
('2e950f1f491a11f08b210242ac120002', 'ฝ่ายวิชาการ', '2025-06-14 12:22:04'),
('2e95118c491a11f08b210242ac120002', 'สารบรรณ', '2025-06-14 12:22:04'),
('2e951234491a11f08b210242ac120002', 'พัสดุ', '2025-06-14 12:22:04'),
('2e95128f491a11f08b210242ac120002', 'IT Support', '2025-06-14 12:22:04'),
('3958bf25491a11f08b210242ac120002', 'ฝ่ายบุคคล', '2025-06-14 12:22:22'),
('3958c253491a11f08b210242ac120002', 'ฝ่ายวิชาการ', '2025-06-14 12:22:22'),
('3958c2d3491a11f08b210242ac120002', 'สารบรรณ', '2025-06-14 12:22:22'),
('3958c325491a11f08b210242ac120002', 'พัสดุ', '2025-06-14 12:22:22'),
('3958c371491a11f08b210242ac120002', 'IT Support', '2025-06-14 12:22:22'),
('84bda27f491a11f08b210242ac120002', 'ฝ่ายบุคคล', '2025-06-14 12:24:29'),
('84bdab44491a11f08b210242ac120002', 'ฝ่ายวิชาการ', '2025-06-14 12:24:29'),
('84bdace8491a11f08b210242ac120002', 'สารบรรณ', '2025-06-14 12:24:29'),
('84bdaf72491a11f08b210242ac120002', 'พัสดุ', '2025-06-14 12:24:29'),
('84bdb007491a11f08b210242ac120002', 'IT Support', '2025-06-14 12:24:29');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสพนักงานขับรถแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อ-นามสกุลพนักงานขับรถ',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'เบอร์โทรศัพท์พนักงานขับรถ',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่เพิ่มพนักงานขับรถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลพนักงานขับรถ';

-- --------------------------------------------------------

--
-- Table structure for table `equipments`
--

CREATE TABLE `equipments` (
  `equipment_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสอุปกรณ์เสริมแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่ออุปกรณ์เสริม เช่น GPS, ที่ชาร์จมือถือ',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างรายการอุปกรณ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลอุปกรณ์เสริม';

-- --------------------------------------------------------

--
-- Table structure for table `jwt_blacklist`
--

CREATE TABLE `jwt_blacklist` (
  `jti` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'UUID v4 ของ token',
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expired_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jwt_blacklist`
--

INSERT INTO `jwt_blacklist` (`jti`, `user_id`, `expired_at`) VALUES
('5c57a653-aee9-48cd-be6e-3876dd1e52f9', '85e1f279ea604c568fed6fa5c6ae1148', '2025-06-15 15:16:20');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสสิทธิ์แบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อสิทธิ์ เช่น create_booking, approve_booking',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'รายละเอียดเพิ่มเติมของสิทธิ์',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างสิทธิ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บสิทธิ์ต่างๆ ในระบบ';

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `description`, `created_at`) VALUES
('84c26c4c491a11f08b210242ac120002', 'create_booking', 'สร้างคำขอจองรถ', '2025-06-14 12:24:29'),
('84c28a2d491a11f08b210242ac120002', 'view_booking', 'ดูรายการจองของตนเอง', '2025-06-14 12:24:29'),
('84c28c43491a11f08b210242ac120002', 'approve_booking', 'อนุมัติคำขอจอง', '2025-06-14 12:24:29'),
('84c28d2b491a11f08b210242ac120002', 'cancel_booking', 'ยกเลิกคำขอจอง', '2025-06-14 12:24:29'),
('84c28dd0491a11f08b210242ac120002', 'manage_vehicle', 'จัดการข้อมูลรถยนต์', '2025-06-14 12:24:29'),
('84c28e7a491a11f08b210242ac120002', 'manage_user', 'จัดการข้อมูลผู้ใช้งาน', '2025-06-14 12:24:29'),
('84c2a72c491a11f08b210242ac120002', 'view_dashboard', 'ดู Dashboard สรุป', '2025-06-14 12:24:29');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `token_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัส token',
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK → users.user_id',
  `token_hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'เก็บเป็น hash เพื่อความปลอดภัย',
  `expired_at` timestamp NOT NULL COMMENT 'วันหมดอายุ เช่น 7 วัน',
  `revoked_at` timestamp NULL DEFAULT NULL COMMENT 'วันเวลาที่เพิกถอน (NULL = ยังใช้ได้)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บ refresh token ต่อผู้ใช้';

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`token_id`, `user_id`, `token_hash`, `expired_at`, `revoked_at`, `created_at`) VALUES
('076a4c3c-2e90-4405-a061-f79d0adee1ef', '1b695713b98d47acb3bc8767b2cc0e37', 'f20de2beef59217a91d535865a2a5d2defd6cadcdb622868347753ad38bc02e8', '2025-06-22 13:41:57', NULL, '2025-06-15 06:41:57'),
('0fe94b97-908d-4221-b3cd-45aa8ddb4265', '72343f5f32c64696be82bbbc79615765', '0058ccfd874d17a55c224b56f663abd6c5900f86a66e5f0e5db25d8ff4ab9cb0', '2025-06-22 23:10:06', NULL, '2025-06-15 16:10:05'),
('1781ae75-5360-4a48-a837-3cdedb09662a', '72343f5f32c64696be82bbbc79615765', '4ff9be63d49f152e22fcc51fecd88ee67c09d15daba81b0acd0c3c849bff1618', '2025-06-22 23:08:30', NULL, '2025-06-15 16:08:29'),
('191ee03a-0106-45bb-9861-d181e36e3c03', '72343f5f32c64696be82bbbc79615765', '3d4d3e63dca827fcd80596d1a116c9744239a139fe9f2bdfc8a3677d4ad6e610', '2025-06-22 23:21:06', NULL, '2025-06-15 16:21:05'),
('1ab206cb-893a-4d73-9103-d85b76ac75fb', '72343f5f32c64696be82bbbc79615765', '0737ab7e8dc7c01cedcb43e6bc7b4807d1fbfada551aa8381b100dea3f05db33', '2025-06-22 23:18:00', NULL, '2025-06-15 16:17:59'),
('2cab222b-9253-4a26-a672-280d89293678', '72343f5f32c64696be82bbbc79615765', 'a9a176852c65d2c4b7a09bc225e2268ddb8f20570d386e0d6883312582ffe5e4', '2025-06-28 00:15:09', NULL, '2025-06-20 17:15:08'),
('306cdb7b-5414-4f92-ac64-2fd384b88917', '1b695713b98d47acb3bc8767b2cc0e37', 'e421e557061d42ad28b3cbfbc981e51bb6529dd408193bb79c0c2783c54f71e2', '2025-06-22 13:56:19', NULL, '2025-06-15 06:56:19'),
('339e30fb-a758-4e8a-a34e-4ed1ff0f80f3', '72343f5f32c64696be82bbbc79615765', '7c1c4f51e7857c712feaad18cbae4909216753dd0f489769ba9bad71506679e2', '2025-06-22 23:17:44', '2025-06-15 16:17:48', '2025-06-15 16:17:43'),
('48d3267a-5446-4852-b79f-15efd52a812c', '72343f5f32c64696be82bbbc79615765', '4c0cfc69ba4a5f4896ecd70ec40ed47ba74defc9bd3b6d9a69337f61b5457c40', '2025-06-22 22:43:26', NULL, '2025-06-15 15:43:26'),
('694e3c87-afac-45c1-b0bd-dabfc3d5c8f9', '1b695713b98d47acb3bc8767b2cc0e37', 'b0ee84f2f5216ea2beed8d70376a10eefce6db5e407fa3a2645232bfa2357e29', '2025-06-22 13:42:58', NULL, '2025-06-15 06:42:58'),
('6f2c600a-0df9-47d9-b1e0-09b509cf77f3', '72343f5f32c64696be82bbbc79615765', 'ea3a65e4f43e2bb0c84af69f1fd54d24de3e848e618c14176876253f11bb2b66', '2025-06-27 23:52:20', NULL, '2025-06-20 16:52:20'),
('868bd1b6-fae0-42d4-a22b-246299bb4637', '72343f5f32c64696be82bbbc79615765', '0ee2c26be5a32105cabe265166592dfa00ed575ecc1f2b09d91e76c7c039c58c', '2025-06-22 23:03:38', NULL, '2025-06-15 16:03:37'),
('8feea8bf-2ca3-439b-bf17-ab5057391dfe', '72343f5f32c64696be82bbbc79615765', 'dfa2841d0cca5c365d58fd701dcc63b5c4873fca4a99f55f5e3606d541a9b119', '2025-06-22 23:12:25', NULL, '2025-06-15 16:12:24'),
('914b8050-f6f5-4b63-ae2c-d64e66da78a0', '72343f5f32c64696be82bbbc79615765', 'f2fe940b0ae0426dc701fb6f06ddb08bc8cc806fa86f701e4dd76fe682e999de', '2025-06-22 22:47:15', NULL, '2025-06-15 15:47:15'),
('93b00e63-dc1c-4f57-9bd9-8394fdde5d2e', '72343f5f32c64696be82bbbc79615765', '244e1215d002819961b6721da11feb025e1162e36b68790d8020b95863eca94b', '2025-06-22 22:40:55', NULL, '2025-06-15 15:40:55'),
('98b3d023-d291-4d6b-8405-a378c23cb369', '72343f5f32c64696be82bbbc79615765', '1949d756e43080f6326b7fe84cdce19fd5dbbbff5358477405e2468715f56bd9', '2025-06-27 23:59:07', NULL, '2025-06-20 16:59:07'),
('ade4090a-89ad-445b-8c04-8f7e6ac34b66', '72343f5f32c64696be82bbbc79615765', '29e5035a2b6fe849c9dde6f18f32903080f95ba6eb4b255fb41f35de92def97d', '2025-06-22 23:20:50', NULL, '2025-06-15 16:20:49'),
('b3dc0dca-844d-416b-8ddf-254c8c9dc4ec', '72343f5f32c64696be82bbbc79615765', 'ef5345dbe2a4a2448684944e3ce817136c4d446285854e7ad95bed661a7c5c40', '2025-06-22 23:13:34', NULL, '2025-06-15 16:13:34'),
('b9510093-9bbd-4c70-a5b2-10912411bc51', '72343f5f32c64696be82bbbc79615765', 'c9d5f3e644b4be4f614f29fde60b8e66679ddb13014b3f5a3d87dabb9456acdc', '2025-06-27 00:15:08', NULL, '2025-06-19 17:15:07'),
('baf4a027-da82-43f7-834c-f5a5f5a9010c', '72343f5f32c64696be82bbbc79615765', 'e6f038de3dac9a0c4673e407f1aa6d5ab46df02269def4cda42d7ea6dd2c61ae', '2025-06-22 23:06:42', NULL, '2025-06-15 16:06:41'),
('bd016a7a-5929-4fa5-9fbd-4ed277d3f6bc', '72343f5f32c64696be82bbbc79615765', '7fce7febfb8ffb84c7f62d6f71d46e7b6259421e3cc333b018583ad804254533', '2025-06-22 23:07:22', NULL, '2025-06-15 16:07:22'),
('c8ee3be9-1b5c-4784-86c0-8550afd9e05e', '72343f5f32c64696be82bbbc79615765', 'e8fee49e9ada0eba2c527726b1f8a250d79a84631301e9abc5e5e32c77b2a156', '2025-06-27 23:49:12', NULL, '2025-06-20 16:49:11'),
('cd5f5792-8d02-4fa9-81b1-b4c7d0e9bc05', '72343f5f32c64696be82bbbc79615765', '361395263e107b508046037b81fcc71cb5df867fd2d66cebb224e3b490908d04', '2025-06-22 23:06:13', NULL, '2025-06-15 16:06:12'),
('d662706e-e1fa-4481-91a5-592821d4037d', 'ab6da1cff94548bd9f45fa3c7962bbc9', '7f109a71041f87923d8f33c0a6e2bed266435bdb89dcf485602507feea00f9b9', '2025-06-22 22:38:29', NULL, '2025-06-15 15:38:28'),
('d8e508af-84cd-4c83-9045-2e9dd306e935', '85e1f279ea604c568fed6fa5c6ae1148', 'cd5012028384a7ca9964ecafe92a4ad76e46bffa43b7742d9b4bf4a686fc92f3', '2025-06-22 22:00:29', '2025-06-15 15:02:53', '2025-06-15 15:00:28'),
('daf7c28b-93f9-4de5-8fb7-e5f2d12e9871', '72343f5f32c64696be82bbbc79615765', 'ba5bb39e5d29ebc742220cc091c348b190aa5076281860344a0c14340e5f2541', '2025-06-28 00:02:44', NULL, '2025-06-20 17:02:44'),
('df7e2c67-9eab-4fc2-a73c-cac9b7a070e0', '85e1f279ea604c568fed6fa5c6ae1148', '08ba1a41e82a6a80dd95b2e9f4c2999aede540e069e63e7367a37be289a7a125', '2025-06-22 21:58:48', NULL, '2025-06-15 14:58:47'),
('e0cbb360-594f-48a8-a004-114ca1f03f37', '72343f5f32c64696be82bbbc79615765', '78c1e60543b1c653c121bb8dab27f2e8c0e6c518431485e6ecf7e64eaec63ad8', '2025-06-22 23:05:31', NULL, '2025-06-15 16:05:30'),
('eb235231-8cf4-47d4-84d3-65f981b77dd5', '72343f5f32c64696be82bbbc79615765', '5fbc44e8d2a610729e8cfde618ae9675a6a5bc021b5e03e45cd3e592ab15e66b', '2025-06-22 22:40:13', NULL, '2025-06-15 15:40:12'),
('ee9f5d84-a32d-4ec4-8767-e320eaa04090', '72343f5f32c64696be82bbbc79615765', '737a70ba413cd90165780b51e179091a49ff388091dd03331baf0b9c6d8b5542', '2025-06-22 22:41:13', NULL, '2025-06-15 15:41:12'),
('eef191ef-bc66-431d-af6c-659a32a052f7', '72343f5f32c64696be82bbbc79615765', '5777a1275404656cc533044d5f75e1133b97ec64647eef06e467142181f92082', '2025-06-22 22:27:24', NULL, '2025-06-15 15:27:24'),
('f5a960cc-6658-47ec-86a5-f5a2fc11aec7', '72343f5f32c64696be82bbbc79615765', '651d14c288111d6e0fa2bd82e96fb0d0feb7cb788ab160276a93f4027a21cc4e', '2025-06-22 23:19:21', '2025-06-15 16:19:37', '2025-06-15 16:19:20');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสบทบาทแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อบทบาท เช่น admin, manager, staff',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างบทบาท'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บบทบาทของผู้ใช้งาน';

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `created_at`) VALUES
('2e977588491a11f08b210242ac120002', 'admin', '2025-06-14 12:22:04'),
('2e977bff491a11f08b210242ac120002', 'manager', '2025-06-14 12:22:04'),
('2e977e66491a11f08b210242ac120002', 'staff', '2025-06-14 12:22:04');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_permission_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสเชื่อมโยงบทบาท-สิทธิ์ UUID v4 ไม่มีขีด (32 หลัก)',
  `role_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสบทบาท (FK → roles.role_id)',
  `permission_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสสิทธิ์ (FK → permissions.permission_id)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง mapping'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมบทบาทกับสิทธิ์';

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_permission_id`, `role_id`, `permission_id`, `created_at`) VALUES
('84c4ce8e491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c28c43491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c4fa15491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c28d2b491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c4fc99491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c26c4c491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c4fda9491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c28e7a491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c4fe7d491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c28dd0491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c4ff51491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c28a2d491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c5000e491a11f08b210242ac120002', '2e977588491a11f08b210242ac120002', '84c2a72c491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c72a82491a11f08b210242ac120002', '2e977bff491a11f08b210242ac120002', '84c28c43491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c72e39491a11f08b210242ac120002', '2e977bff491a11f08b210242ac120002', '84c26c4c491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c72f4c491a11f08b210242ac120002', '2e977bff491a11f08b210242ac120002', '84c28a2d491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c954b5491a11f08b210242ac120002', '2e977e66491a11f08b210242ac120002', '84c28d2b491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c959b9491a11f08b210242ac120002', '2e977e66491a11f08b210242ac120002', '84c26c4c491a11f08b210242ac120002', '2025-06-14 12:24:29'),
('84c95af3491a11f08b210242ac120002', '2e977e66491a11f08b210242ac120002', '84c28a2d491a11f08b210242ac120002', '2025-06-14 12:24:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสผู้ใช้งานแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อบัญชี (Account) ใช้สำหรับล็อกอิน',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'อีเมลของผู้ใช้',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสผ่าน (เก็บเป็น hash ด้วย bcryptjs)',
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ชื่อจริงของผู้ใช้',
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'นามสกุลของผู้ใช้',
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'เพศ (ชาย, หญิง, ไม่ระบุ)',
  `citizen_id` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'เลขบัตรประชาชน 13 หลัก',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'เบอร์โทรศัพท์',
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'ที่อยู่',
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ประเทศ',
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'จังหวัด',
  `postal_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'รหัสไปรษณีย์',
  `avatar_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'พาธหรือ URL รูปโปรไฟล์ (Avatar)',
  `department_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'รหัสแผนก (FK → departments.department_id)',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active' COMMENT 'สถานะสมาชิก (active=ใช้งานได้, inactive=ระงับ)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างบัญชี',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่แก้ไขข้อมูลล่าสุด'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลสมาชิกระบบ';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `first_name`, `last_name`, `gender`, `citizen_id`, `phone`, `address`, `country`, `province`, `postal_code`, `avatar_path`, `department_id`, `status`, `created_at`, `updated_at`) VALUES
('1b695713b98d47acb3bc8767b2cc0e37', 'testuser3', 'test3@example.com', '$2b$10$VP1b/uPtWG3ZRhCbMOXodu5q1u3mN7IqddwjsMdCHgTeKr07I0nA6', 'ทดสอบ', 'ระบบ', 'other', '1234567890123', '0812345678', 'กรุงเทพฯ', 'Thailand', 'Bangkok', '10200', NULL, '2e950f1f491a11f08b210242ac120002', 'active', '2025-06-15 06:41:57', NULL),
('6079e83c975e43cab38782f6c59b58f1', 'testuser', 'test@example.com', '$2b$10$1Ve5J4q7SQr1wXDdCkE/ZOFn3YZAQiOVPG5yRuXOOrTey..zpkrIC', 'ทดสอบ', 'โมเดล', 'other', '1234567890123', '0812345678', '123/4 ถ.ทดสอบ', 'Thailand', 'Bangkok', '10200', NULL, '2e950612491a11f08b210242ac120002', 'active', '2025-06-14 17:18:33', NULL),
('72343f5f32c64696be82bbbc79615765', 'pm_test01', 'pm_test01@example.com', '$2b$10$ZWhCl.a/7xPK0qou3a/10O8rK5jMziktpqldV4VaLQmUy8eYT6QUy', 'ทดสอบ', 'พีเอม', 'other', '1234567890123', '0812345678', 'ซ.ทดสอบ 1', 'Thailand', 'Bangkok', '10200', NULL, '<ใส่ department_id จริง>', 'active', '2025-06-15 15:27:24', NULL),
('85e1f279ea604c568fed6fa5c6ae1148', 'testuser01', 'testuser01@example.com', '$2b$10$.tjcQqrAR62L3UUZCMO3BeXnx53o6XiS3bfRkN8xRQ1Ck7uGnB3km', 'ทดสอบ', 'ระบบ', 'other', '1234567890123', '0812345678', '123/4 ถนนทดสอบ', 'Thailand', 'Bangkok', '10200', NULL, '2e95128f491a11f08b210242ac120002', 'active', '2025-06-15 14:58:47', NULL),
('897f69a36f02442da86b46bdf13ef8ea', 'testuser2', 'test2@example.com', '$2b$10$TvL4rwKH.amesRcislOU3OtPwVtxANeVYokHiK5t/G.C59r4VArAa', 'ทดสอบ', 'ระบบ', 'other', '1234567890123', '0812345678', 'กรุงเทพฯ', 'Thailand', 'Bangkok', '10200', NULL, '2e950f1f491a11f08b210242ac120002', 'active', '2025-06-15 05:31:44', NULL),
('ab6da1cff94548bd9f45fa3c7962bbc9', 'pm_test02', 'pm_test02@example.com', '$2b$10$g6uOq4EXL2N7r4NFKix1q.g6WGWumsc/blCHLG/C496D/bI/K0SlO', 'ทดสอบ', 'พีเอม', 'other', '1234567890123', '0812345678', 'ซ.ทดสอบ 1', 'Thailand', 'Bangkok', '10200', NULL, '<ใส่ department_id จริง>', 'active', '2025-06-15 15:38:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_role_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสเชื่อมโยงผู้ใช้-บทบาท UUID v4 ไม่มีขีด (32 หลัก)',
  `user_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสผู้ใช้ (FK → users.user_id)',
  `role_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสบทบาท (FK → roles.role_id)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่กำหนดบทบาทให้ผู้ใช้'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมผู้ใช้กับบทบาท';

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสยานพาหนะแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `license_plate` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ทะเบียนรถ เช่น กข 1234',
  `type_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสประเภทยานพาหนะ (FK → vehicle_types.type_id)',
  `brand_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสยี่ห้อรถ (FK → vehicle_brands.brand_id)',
  `capacity` int NOT NULL COMMENT 'จำนวนที่นั่ง',
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'สีของยานพาหนะ',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'รายละเอียดเพิ่มเติมของยานพาหนะ',
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'พาธหรือ URL รูปภาพของรถ',
  `is_public` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'สถานะเผยแพร่ (1=เผยแพร่, 0=ไม่เผยแพร่)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่เพิ่มข้อมูลรถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลยานพาหนะ';

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `license_plate`, `type_id`, `brand_id`, `capacity`, `color`, `description`, `image_path`, `is_public`, `created_at`) VALUES
('26a11c410f824305bb2d73e22801161f', 'ขข-2345', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 2, 'แดง', 'รถกระบะ CAB 2 ประตู สีแดง', NULL, 1, '2025-06-19 17:18:04'),
('2b70bc4b11fb4599a227697afe9dc659', 'กข-1234', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถกระบะ CAB 2 ประตู สีดำ', NULL, 1, '2025-06-19 17:17:36'),
('33b321c390d54392a22e98542adc5316', 'งง-9900', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'น้ำเงิน', 'รถกระบะ CAB 2 ประตู สีน้ำเงิน', NULL, 1, '2025-06-19 17:18:49'),
('43ba655e42e24ad5b3747d13e2c7b6ea', 'กข-5678', '5fb520974a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 5, 'ขาว', 'รถเก๋ง 4 ประตู สีขาว', NULL, 1, '2025-06-19 17:17:50'),
('526caa5ad38046b9a44e29d69ef2315f', 'ขข-1122', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 6, 'ดำ', 'รถ SUV สีดำ', NULL, 1, '2025-06-19 17:18:20'),
('8a2ff95894ab4e2686f65636b488d106', 'คค-7788', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 7, 'แดง', 'รถ SUV สีแดง', NULL, 1, '2025-06-19 17:18:43'),
('8e307151a99d4f0b9d9e744cdc44f707', 'คค-3344', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 5, 'เทา', 'รถกระบะ CAB 2 ประตู สีเทา', NULL, 1, '2025-06-19 17:18:30'),
('9f86856ced2e4e6d99683e818fe74c77', 'กข-9999', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'Black', 'ทดสอบสร้างรถใหม่', NULL, 1, '2025-06-15 15:50:54'),
('a9391ac3fd40495dbf843d414c91ca35', 'กข-9101', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 7, 'เงิน', 'รถ SUV สีเงิน', NULL, 1, '2025-06-19 17:17:57'),
('b9d889a556d544c99ef533b11f2462fc', 'ขข-6789', '5fb520974a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 4, 'น้ำเงิน', 'รถเก๋ง 4 ประตู สีน้ำเงิน', NULL, 1, '2025-06-19 17:18:13'),
('e5a33d311331430b8d3f80109462562e', 'กข-12345', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถทดสอบ', NULL, 1, '2025-06-20 17:15:38'),
('f26639b8281648e3bcddca34b80d5aac', 'คค-5566', '5fb520974a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 4, 'ขาว', 'รถเก๋ง 4 ประตู สีขาว', NULL, 1, '2025-06-19 17:18:36'),
('fa10e9afbe5a4cfe82cfb755d557d786', 'กข-123v4', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถทดสอบ', NULL, 1, '2025-06-20 17:18:33');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_brands`
--

CREATE TABLE `vehicle_brands` (
  `brand_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสยี่ห้อแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อยี่ห้อ เช่น Mitsubishi, Toyota',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างยี่ห้อ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บยี่ห้อของยานพาหนะ';

--
-- Dumping data for table `vehicle_brands`
--

INSERT INTO `vehicle_brands` (`brand_id`, `name`, `created_at`) VALUES
('5fb72f954a0011f08325fe6471b6f9ca', 'Toyota', '2025-06-15 15:49:51'),
('5fb73d434a0011f08325fe6471b6f9ca', 'Mitsubishi', '2025-06-15 15:49:51'),
('5fb73f2b4a0011f08325fe6471b6f9ca', 'Honda', '2025-06-15 15:49:51');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_equipments`
--

CREATE TABLE `vehicle_equipments` (
  `vehicle_equipment_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสเชื่อมโยงรถ-อุปกรณ์ UUID v4 ไม่มีขีด (32 หลัก)',
  `vehicle_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสรถ (FK → vehicles.vehicle_id)',
  `equipment_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสอุปกรณ์เสริม (FK → equipments.equipment_id)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่เพิ่มอุปกรณ์ให้รถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเชื่อมรถกับอุปกรณ์เสริม';

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `type_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'รหัสประเภทยานพาหนะแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ชื่อประเภท เช่น รถกระบะ, รถตู้',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างประเภทยานพาหนะ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บประเภทของยานพาหนะ';

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`type_id`, `name`, `created_at`) VALUES
('5fb512404a0011f08325fe6471b6f9ca', 'รถกระบะ CAB 2 ประตู', '2025-06-15 15:49:51'),
('5fb520974a0011f08325fe6471b6f9ca', 'รถเก๋ง 4 ประตู', '2025-06-15 15:49:51'),
('5fb5224c4a0011f08325fe6471b6f9ca', 'รถ SUV', '2025-06-15 15:49:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approvals`
--
ALTER TABLE `approvals`
  ADD PRIMARY KEY (`approval_id`),
  ADD KEY `fk_apv_booking` (`booking_id`),
  ADD KEY `fk_apv_user` (`approver_id`);

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
  ADD KEY `fk_b_driver` (`driver_id`);

--
-- Indexes for table `booking_equipments`
--
ALTER TABLE `booking_equipments`
  ADD PRIMARY KEY (`booking_equipment_id`),
  ADD KEY `fk_be_booking` (`booking_id`),
  ADD KEY `fk_be_equipment` (`equipment_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

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
  ADD UNIQUE KEY `email` (`email`);

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
  ADD CONSTRAINT `fk_apv_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_apv_user` FOREIGN KEY (`approver_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_b_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`),
  ADD CONSTRAINT `fk_b_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_b_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`);

--
-- Constraints for table `booking_equipments`
--
ALTER TABLE `booking_equipments`
  ADD CONSTRAINT `fk_be_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_be_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`);

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
