-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2025 at 03:23 PM
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
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `approval_flows`
--

INSERT INTO `approval_flows` (`flow_id`, `flow_name`, `is_active`) VALUES
('1352b0abe85a4ceb8bb3e2ed6de02151', 'Flow อนุมัติ 3 ขั้น', 1),
('4d7275d874ee4341b9770e56fb75c8f2', 'Flow อนุมัติ 3 ขั้น', 1),
('62f8066c3207480e92f32098103120ae', 'Flow อนุมัติ 3 ขั้น', 1),
('9b48ed748e174838be7646df52eed3a7', 'Flow อนุมัติ 3 ขั้น', 1),
('flow1234567890abcd1234567890abcd', 'Flow อนุมัติ 3 ขั้น', 1);

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

--
-- Dumping data for table `approval_steps`
--

INSERT INTO `approval_steps` (`step_id`, `flow_id`, `step_order`, `role_id`, `step_name`) VALUES
('e3c6311696504690bd173d12aea915b6', '1352b0abe85a4ceb8bb3e2ed6de02151', 1, '2e977588491a11f08b210242ac120002', 'หัวหน้าแผนก');

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

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `vehicle_id`, `driver_id`, `num_passengers`, `reason`, `phone`, `start_date`, `start_time`, `end_date`, `end_time`, `created_at`, `origin_location`, `destination_location`, `start_odometer`, `end_odometer`, `total_distance`, `status`, `flow_id`, `approval_status`) VALUES
('11111111111111111111111111111111', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'd1a2b3c4d5e647f8a9b0c1d2e3f45061', NULL, 3, 'ประชุมภายในบริษัท', '0812345678', '2025-07-01', '08:00:00', '2025-07-01', '12:00:00', '2025-06-21 13:43:47', 'สำนักงานใหญ่', 'ศูนย์ประชุม', 1000, 1050, 50.00, 'pending', NULL, 'pending'),
('11111111111111111111111111155555', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 3, 'ประชุมภายในบริษัท', '0812345678', '2025-07-01', '08:00:00', '2025-07-01', '17:00:00', '2025-06-21 13:53:43', 'สำนักงานใหญ่', 'ศูนย์ประชุม', 100, 150, 50.00, 'approved', NULL, 'pending'),
('22222222222222222222222222222222', '6079e83c975e43cab38782f6c59b58f1', '2b70bc4b11fb4599a227697afe9dc659', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 2, 'ส่งเอกสารด่วน', '0877777777', '2025-07-02', '09:00:00', '2025-07-02', '11:00:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'ศูนย์บริการไปรษณีย์', 200, 250, 50.00, 'pending', NULL, 'pending'),
('33333333333333333333333333333333', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'cccccccccccccccccccccccccccccccc', 4, 'เที่ยวภาคสนาม', '0899999999', '2025-07-03', '07:30:00', '2025-07-03', '18:00:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'ต่างจังหวัด', 300, 600, 300.00, 'approved', NULL, 'pending'),
('40fc8a693ce6427bba754c08480588de', '1b695713b98d47acb3bc8767b2cc0e37', 'd1a2b3c4d5e647f8a9b0c1d2e3f45061', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5, 'ปรับจำนวนผู้โดยสาร + เปลี่ยนปลายทาง', '0811222333', '2025-07-22', '09:00:00', '2025-07-22', '12:00:00', '2025-06-21 14:05:22', 'สำนักงานใหญ่', 'โรงแรม ABC', 150, 260, 60.00, 'approved', NULL, 'pending'),
('44444444444444444444444444444444', '6079e83c975e43cab38782f6c59b58f1', '2b70bc4b11fb4599a227697afe9dc659', NULL, 1, 'ทดสอบเวลา', '0888888888', '2025-07-04', '14:00:00', '2025-07-04', '15:30:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'ศูนย์บริการไปรษณีย์', 400, 450, 50.00, 'rejected', NULL, 'pending'),
('50a3b9f7d2df4eb88f99c5cad2749ba1', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 4, 'ประชุมสรุปโครงการ', '0811222333', '2025-07-22', '09:00:00', '2025-07-22', '12:00:00', '2025-06-25 12:01:39', 'สำนักงานใหญ่', 'โรงแรม XYZ', 150, 210, 60.00, 'pending', NULL, 'pending'),
('55555555555555555555555555555555', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 2, 'เยี่ยมลูกค้าต่างจังหวัด', '0899990000', '2025-07-05', '06:00:00', '2025-07-05', '18:00:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'ต่างจังหวัด', 100, 600, 500.00, 'approved', NULL, 'pending'),
('66666666666666666666666666666666', '6079e83c975e43cab38782f6c59b58f1', '2b70bc4b11fb4599a227697afe9dc659', NULL, 6, 'เดินทางไปราชการ', '0810000001', '2025-07-06', '08:15:00', '2025-07-06', '17:45:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'ศูนย์ประชุม', 200, 350, 150.00, 'pending', NULL, 'pending'),
('724f77cc7c5249b3b6c00c7497a20ec9', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 4, 'ประชุมสรุปโครงการ', '0811222333', '2025-07-22', '09:00:00', '2025-07-22', '12:00:00', '2025-06-25 11:27:22', 'สำนักงานใหญ่', 'โรงแรม XYZ', 150, 210, 60.00, 'pending', NULL, 'pending'),
('77777777777777777777777777777777', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 3, 'นัดพบผู้บริหาร', '0810000002', '2025-07-07', '09:00:00', '2025-07-07', '13:00:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'สาขา 1', 150, 300, 150.00, 'approved', NULL, 'pending'),
('88888888888888888888888888888888', '6079e83c975e43cab38782f6c59b58f1', '2b70bc4b11fb4599a227697afe9dc659', 'cccccccccccccccccccccccccccccccc', 5, 'ติดตั้งอุปกรณ์', '0810000003', '2025-07-08', '10:00:00', '2025-07-08', '12:30:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'สาขา 2', 500, 550, 50.00, 'rejected', NULL, 'pending'),
('99999999999999999999999999999999', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', NULL, 4, 'ประชุมภายนอก', '0810000004', '2025-07-09', '13:00:00', '2025-07-09', '15:00:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'สาขา 3', 800, 850, 50.00, 'approved', NULL, 'pending'),
('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '6079e83c975e43cab38782f6c59b58f1', '2b70bc4b11fb4599a227697afe9dc659', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 2, 'สำรวจพื้นที่', '0810000005', '2025-07-10', '07:00:00', '2025-07-10', '09:00:00', '2025-06-21 13:53:43', 'สํานักงานใหญ่', 'สาขา 4', 1000, 1050, 50.00, 'pending', NULL, 'pending'),
('df42321e3ad142aebf41fd5793f2b0f6', '1b695713b98d47acb3bc8767b2cc0e37', '26a11c410f824305bb2d73e22801161f', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 4, 'ประชุมสรุปโครงการ', '0811222333', '2025-07-22', '09:00:00', '2025-07-22', '12:00:00', '2025-06-25 12:14:08', 'สำนักงานใหญ่', 'โรงแรม XYZ', 150, 210, 60.00, 'pending', NULL, 'pending');

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
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` char(32) NOT NULL COMMENT 'รหัสแผนกแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อแผนก',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างแผนก'
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
  `driver_id` char(32) NOT NULL COMMENT 'รหัสพนักงานขับรถแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อ-นามสกุลพนักงานขับรถ',
  `phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์พนักงานขับรถ',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่เพิ่มพนักงานขับรถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลพนักงานขับรถ';

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`driver_id`, `name`, `phone`, `created_at`) VALUES
('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'คนขับ 1', '0811111111', '2025-06-21 13:52:15'),
('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'คนขับ 2', '0822222222', '2025-06-21 13:52:15'),
('cccccccccccccccccccccccccccccccc', 'คนขับ 3', '0833333333', '2025-06-21 13:52:15');

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

--
-- Dumping data for table `equipments`
--

INSERT INTO `equipments` (`equipment_id`, `equipment_name`, `description`, `created_at`) VALUES
('a1e1f3c1c2d14f6aa7b5407f0410d1a1', 'วิทยุสื่อสาร', 'ใช้สื่อสารระหว่างรถ', '2025-06-22 06:56:24'),
('b2f2e4d2d3e24f7bb8c6518f1521e2b2', 'GPS Navigator', 'นำทางด้วยระบบดาวเทียม', '2025-06-22 06:56:24'),
('c3g3g5e3e4f34g8cc9d7629g2632f3c3', 'กล้องติดรถยนต์', 'บันทึกภาพขณะขับขี่', '2025-06-22 06:56:24'),
('d4h4h6f4f5g45h9dd0e8730h3743g4d4', 'ไฟฉาย', 'อุปกรณ์ให้แสงสว่าง', '2025-06-22 06:56:24'),
('e5i5i7g5g6h56i0ee1f9841i4854h5e5', 'ชุดปฐมพยาบาล', 'อุปกรณ์สำหรับดูแลผู้บาดเจ็บเบื้องต้น', '2025-06-22 06:56:24'),
('f6j6j8h6h7i67j1ff2g0952j5965i6f6', 'สายลากรถ', 'ใช้สำหรับลากรถฉุกเฉิน', '2025-06-22 06:56:24'),
('g7k7k9i7i8j78k2gg3h1063k6a76j7g7', 'น้ำมันสำรอง', 'น้ำมันฉุกเฉิน 5 ลิตร', '2025-06-22 06:56:24'),
('h8l8l0j8j9k89l3hh4i2174l7b87k8h8', 'กล่องเครื่องมือช่าง', 'ไขควง ประแจ อุปกรณ์เบื้องต้น', '2025-06-22 06:56:24'),
('i9m9m1k9k0l90m4ii5j3285m8c98l9i9', 'ที่สูบลมยาง', 'ที่สูบลมมือหรือไฟฟ้า', '2025-06-22 06:56:24'),
('j0n0n2l0l1m01n5jj6k4396n9d09m0j0', 'เสื้อสะท้อนแสง', 'ใช้เวลาจอดรถฉุกเฉินบนถนน', '2025-06-22 06:56:24');

-- --------------------------------------------------------

--
-- Table structure for table `jwt_blacklist`
--

CREATE TABLE `jwt_blacklist` (
  `jti` char(36) NOT NULL COMMENT 'UUID v4 ของ token',
  `user_id` char(32) NOT NULL,
  `expired_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
  `permission_id` char(32) NOT NULL COMMENT 'รหัสสิทธิ์แบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(100) NOT NULL COMMENT 'ชื่อสิทธิ์ เช่น create_booking, approve_booking',
  `description` text DEFAULT NULL COMMENT 'รายละเอียดเพิ่มเติมของสิทธิ์',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างสิทธิ์'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บสิทธิ์ต่างๆ ในระบบ';

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `description`, `created_at`) VALUES
('79a4f1be0a364d63a391c2a481c32885', 'create_booking2', 'dsfsdfsdfsdfsdfsdf', '2025-06-25 13:14:25'),
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
('076a4c3c-2e90-4405-a061-f79d0adee1ef', '1b695713b98d47acb3bc8767b2cc0e37', 'f20de2beef59217a91d535865a2a5d2defd6cadcdb622868347753ad38bc02e8', '2025-06-22 13:41:57', NULL, '2025-06-15 06:41:57'),
('0d4f0e55-2b67-422d-89e1-d3e0011d3c21', '72343f5f32c64696be82bbbc79615765', '46491f57b4f3b118b4b08404817563c1ad3a1a959b30e3faea905cd63e532d3e', '2025-06-28 18:54:47', NULL, '2025-06-21 11:54:46'),
('0fe94b97-908d-4221-b3cd-45aa8ddb4265', '72343f5f32c64696be82bbbc79615765', '0058ccfd874d17a55c224b56f663abd6c5900f86a66e5f0e5db25d8ff4ab9cb0', '2025-06-22 23:10:06', NULL, '2025-06-15 16:10:05'),
('13a9e50d-503d-4a17-b7b8-5748b8fcc6d2', '72343f5f32c64696be82bbbc79615765', 'ecb80a8db40d78fe28c547037c31ac018d8a68dfc22e790d53cf42625f722769', '2025-06-28 20:26:54', NULL, '2025-06-21 13:26:53'),
('1781ae75-5360-4a48-a837-3cdedb09662a', '72343f5f32c64696be82bbbc79615765', '4ff9be63d49f152e22fcc51fecd88ee67c09d15daba81b0acd0c3c849bff1618', '2025-06-22 23:08:30', NULL, '2025-06-15 16:08:29'),
('178ccd21-2e11-46ac-ab3a-9262025b5972', '72343f5f32c64696be82bbbc79615765', '046756737297632954be4c8924fdbe157b4b24edda558f212c5fdf60457064e4', '2025-07-02 12:51:19', NULL, '2025-06-25 12:51:19'),
('191ee03a-0106-45bb-9861-d181e36e3c03', '72343f5f32c64696be82bbbc79615765', '3d4d3e63dca827fcd80596d1a116c9744239a139fe9f2bdfc8a3677d4ad6e610', '2025-06-22 23:21:06', NULL, '2025-06-15 16:21:05'),
('1ab206cb-893a-4d73-9103-d85b76ac75fb', '72343f5f32c64696be82bbbc79615765', '0737ab7e8dc7c01cedcb43e6bc7b4807d1fbfada551aa8381b100dea3f05db33', '2025-06-22 23:18:00', NULL, '2025-06-15 16:17:59'),
('1d182d2a-a4ab-4c5e-9033-0a36755a2262', '72343f5f32c64696be82bbbc79615765', '44fadd9d7102350fcbfc22db8d6e4f6f008bc582764a091f913b0f3c536b9a97', '2025-06-29 19:44:43', NULL, '2025-06-22 12:44:43'),
('2cab222b-9253-4a26-a672-280d89293678', '72343f5f32c64696be82bbbc79615765', 'a9a176852c65d2c4b7a09bc225e2268ddb8f20570d386e0d6883312582ffe5e4', '2025-06-28 00:15:09', NULL, '2025-06-20 17:15:08'),
('2d7be649-f9e6-49ce-9d95-8675e7982839', '72343f5f32c64696be82bbbc79615765', '27a84a12e96d39b534d475aa15b69b27776fb454cb6e30a8a1904aa5ed16a049', '2025-06-29 10:59:30', NULL, '2025-06-22 03:59:29'),
('306cdb7b-5414-4f92-ac64-2fd384b88917', '1b695713b98d47acb3bc8767b2cc0e37', 'e421e557061d42ad28b3cbfbc981e51bb6529dd408193bb79c0c2783c54f71e2', '2025-06-22 13:56:19', NULL, '2025-06-15 06:56:19'),
('339e30fb-a758-4e8a-a34e-4ed1ff0f80f3', '72343f5f32c64696be82bbbc79615765', '7c1c4f51e7857c712feaad18cbae4909216753dd0f489769ba9bad71506679e2', '2025-06-22 23:17:44', '2025-06-15 16:17:48', '2025-06-15 16:17:43'),
('3b0eb9e7-b13c-4081-9616-b7db672a8ee6', '72343f5f32c64696be82bbbc79615765', '431029733ca8c38a82ff9807e7cb55d272f28499135bba70e767f027cb92e65c', '2025-06-28 21:21:59', NULL, '2025-06-21 14:21:58'),
('3f442325-66e9-48d4-b161-c319f6eaacc3', '72343f5f32c64696be82bbbc79615765', '951d1019b382d1dfd61a641ea6d586f36033f96a1583a771db5fecc2f4458a00', '2025-06-28 18:21:39', NULL, '2025-06-21 11:21:39'),
('48d3267a-5446-4852-b79f-15efd52a812c', '72343f5f32c64696be82bbbc79615765', '4c0cfc69ba4a5f4896ecd70ec40ed47ba74defc9bd3b6d9a69337f61b5457c40', '2025-06-22 22:43:26', NULL, '2025-06-15 15:43:26'),
('50519317-be4c-45ff-b267-a92c33a5788f', '72343f5f32c64696be82bbbc79615765', '367bf5a85bed73b9d3149b53486884a03a164debb3e1ff013f6e71a463980696', '2025-06-29 20:45:05', NULL, '2025-06-22 13:45:04'),
('53d3e657-0535-479a-88b5-977de7c13ede', '85e1f279ea604c568fed6fa5c6ae1148', 'f8363a5fffbd0216e8fb184141b3c15e5614555ad8b06ff355c7379ab5ce7ce2', '2025-07-02 11:19:49', NULL, '2025-06-25 11:19:49'),
('5ca9f4d9-2427-4a5f-98f6-092f4654932c', '72343f5f32c64696be82bbbc79615765', '81409787b5ec30b88165489e3fdb8fd7a20de2d4085ea78c1c0655629779897e', '2025-06-28 18:39:18', NULL, '2025-06-21 11:39:18'),
('694e3c87-afac-45c1-b0bd-dabfc3d5c8f9', '1b695713b98d47acb3bc8767b2cc0e37', 'b0ee84f2f5216ea2beed8d70376a10eefce6db5e407fa3a2645232bfa2357e29', '2025-06-22 13:42:58', NULL, '2025-06-15 06:42:58'),
('6d225cd1-31f0-4bba-a5e0-9914db60c3e7', '85e1f279ea604c568fed6fa5c6ae1148', '8f2507dfc286c6878258e9665e5081828c7e1812b0e733a1cf3c0170546c2beb', '2025-07-02 11:19:24', NULL, '2025-06-25 11:19:24'),
('6f2c600a-0df9-47d9-b1e0-09b509cf77f3', '72343f5f32c64696be82bbbc79615765', 'ea3a65e4f43e2bb0c84af69f1fd54d24de3e848e618c14176876253f11bb2b66', '2025-06-27 23:52:20', NULL, '2025-06-20 16:52:20'),
('76faf794-0ed0-4ac1-9517-6437537f0832', '72343f5f32c64696be82bbbc79615765', 'ab4241c83ac9bad890494aec866e4bfcee61ccf4c04bdb3b6756bfbe1e501400', '2025-07-02 12:33:08', NULL, '2025-06-25 12:33:08'),
('783f2524-2fb3-4bcc-aa5f-517fe94a509a', '72343f5f32c64696be82bbbc79615765', '214ec8fc0cf4088845650f3d081d812e6ec6a317031f7e379bdaab8e6ef1fd86', '2025-06-28 17:38:22', NULL, '2025-06-21 10:38:21'),
('7de99a8c-34a3-466a-9a44-af119b475a21', '85e1f279ea604c568fed6fa5c6ae1148', '043192408cf09e69bc64bec2020c9f928085ed91c4d644431f780ab5e13f5401', '2025-07-02 12:13:11', NULL, '2025-06-25 12:13:11'),
('7ef1cca2-f88e-42fa-b29c-468bf99ec9ee', '72343f5f32c64696be82bbbc79615765', '539bd9cd6b0ad7b0b0d2ef65412b8afa886c17e61dbfc03d097efb34811ecc7c', '2025-06-28 18:06:26', NULL, '2025-06-21 11:06:26'),
('868bd1b6-fae0-42d4-a22b-246299bb4637', '72343f5f32c64696be82bbbc79615765', '0ee2c26be5a32105cabe265166592dfa00ed575ecc1f2b09d91e76c7c039c58c', '2025-06-22 23:03:38', NULL, '2025-06-15 16:03:37'),
('8c6084eb-7e53-4510-9418-59b0ed97f755', '8da5681bb46646babcd6cbbef9a290c6', '54be076349ec260faa80bd83ebf5f60465b5a9d43659eba933aaef7e663c17e7', '2025-07-02 09:54:38', NULL, '2025-06-25 09:54:38'),
('8feea8bf-2ca3-439b-bf17-ab5057391dfe', '72343f5f32c64696be82bbbc79615765', 'dfa2841d0cca5c365d58fd701dcc63b5c4873fca4a99f55f5e3606d541a9b119', '2025-06-22 23:12:25', NULL, '2025-06-15 16:12:24'),
('914b8050-f6f5-4b63-ae2c-d64e66da78a0', '72343f5f32c64696be82bbbc79615765', 'f2fe940b0ae0426dc701fb6f06ddb08bc8cc806fa86f701e4dd76fe682e999de', '2025-06-22 22:47:15', NULL, '2025-06-15 15:47:15'),
('93b00e63-dc1c-4f57-9bd9-8394fdde5d2e', '72343f5f32c64696be82bbbc79615765', '244e1215d002819961b6721da11feb025e1162e36b68790d8020b95863eca94b', '2025-06-22 22:40:55', NULL, '2025-06-15 15:40:55'),
('98b3d023-d291-4d6b-8405-a378c23cb369', '72343f5f32c64696be82bbbc79615765', '1949d756e43080f6326b7fe84cdce19fd5dbbbff5358477405e2468715f56bd9', '2025-06-27 23:59:07', NULL, '2025-06-20 16:59:07'),
('a2dd30be-5a24-4e74-86f3-97e73bee143d', '72343f5f32c64696be82bbbc79615765', 'cf2b1eb9c9c9ee9e44595d64c43105d7ad1d84913905b0ae469a4124661b78de', '2025-06-29 19:22:23', NULL, '2025-06-22 12:22:22'),
('a9dd768f-493e-41c6-a35c-c079cd527a4a', '72343f5f32c64696be82bbbc79615765', '028af39308e13da8bd3090e95f13b6ad52e7cb32a9979bf81a3ba6f66c52b3d2', '2025-06-28 20:48:29', NULL, '2025-06-21 13:48:28'),
('abecde80-a4e2-423a-ae22-aaeb59169a13', '72343f5f32c64696be82bbbc79615765', 'd6faa3dd31f48c72f78b5fb59be7dca05ea846af6653e2876c85254a6c2132c9', '2025-06-28 19:04:31', NULL, '2025-06-21 12:04:31'),
('ade4090a-89ad-445b-8c04-8f7e6ac34b66', '72343f5f32c64696be82bbbc79615765', '29e5035a2b6fe849c9dde6f18f32903080f95ba6eb4b255fb41f35de92def97d', '2025-06-22 23:20:50', NULL, '2025-06-15 16:20:49'),
('af71f5e4-d0a5-4147-9f3c-35420e094548', '72343f5f32c64696be82bbbc79615765', 'f023b10bd2ad662a11fe9b96c289741ad7ced09d06264fe5ca28c126cf72b40d', '2025-06-28 20:01:14', NULL, '2025-06-21 13:01:13'),
('b3dc0dca-844d-416b-8ddf-254c8c9dc4ec', '72343f5f32c64696be82bbbc79615765', 'ef5345dbe2a4a2448684944e3ce817136c4d446285854e7ad95bed661a7c5c40', '2025-06-22 23:13:34', NULL, '2025-06-15 16:13:34'),
('b9510093-9bbd-4c70-a5b2-10912411bc51', '72343f5f32c64696be82bbbc79615765', 'c9d5f3e644b4be4f614f29fde60b8e66679ddb13014b3f5a3d87dabb9456acdc', '2025-06-27 00:15:08', NULL, '2025-06-19 17:15:07'),
('baf4a027-da82-43f7-834c-f5a5f5a9010c', '72343f5f32c64696be82bbbc79615765', 'e6f038de3dac9a0c4673e407f1aa6d5ab46df02269def4cda42d7ea6dd2c61ae', '2025-06-22 23:06:42', NULL, '2025-06-15 16:06:41'),
('bd016a7a-5929-4fa5-9fbd-4ed277d3f6bc', '72343f5f32c64696be82bbbc79615765', '7fce7febfb8ffb84c7f62d6f71d46e7b6259421e3cc333b018583ad804254533', '2025-06-22 23:07:22', NULL, '2025-06-15 16:07:22'),
('c0602866-ef3b-4e84-be44-30bbc0e7344e', '72343f5f32c64696be82bbbc79615765', '3de9613d12bb21b0994f3c5f8df46e89a69dff9eb335a0c54a2e8aadd8612994', '2025-07-02 12:34:27', NULL, '2025-06-25 12:34:27'),
('c0ee88f8-e7ed-404c-9c67-37cacdaab006', '72343f5f32c64696be82bbbc79615765', 'a9fad6deaa34366afa9b6bc7751f985ad69cb7a6c35e47c6d9001f228252a557', '2025-06-28 21:05:20', NULL, '2025-06-21 14:05:20'),
('c863e417-59bd-4650-b220-bcc58e3edb92', '72343f5f32c64696be82bbbc79615765', '64434cb69459aa9212c275eeb9f7fdd314ad51ef03b3359e58e313d47a3e244c', '2025-06-28 18:34:23', NULL, '2025-06-21 11:34:22'),
('c8ee3be9-1b5c-4784-86c0-8550afd9e05e', '72343f5f32c64696be82bbbc79615765', 'e8fee49e9ada0eba2c527726b1f8a250d79a84631301e9abc5e5e32c77b2a156', '2025-06-27 23:49:12', NULL, '2025-06-20 16:49:11'),
('cd5f5792-8d02-4fa9-81b1-b4c7d0e9bc05', '72343f5f32c64696be82bbbc79615765', '361395263e107b508046037b81fcc71cb5df867fd2d66cebb224e3b490908d04', '2025-06-22 23:06:13', NULL, '2025-06-15 16:06:12'),
('cdf32f50-950b-4c89-8b30-f28e14dc3867', '85e1f279ea604c568fed6fa5c6ae1148', 'cabb9b3b1537e20a10ea900b0e1e9d0662af15ec5c91d9068b87997b47e4b580', '2025-07-02 11:59:49', NULL, '2025-06-25 11:59:49'),
('d662706e-e1fa-4481-91a5-592821d4037d', 'ab6da1cff94548bd9f45fa3c7962bbc9', '7f109a71041f87923d8f33c0a6e2bed266435bdb89dcf485602507feea00f9b9', '2025-06-22 22:38:29', NULL, '2025-06-15 15:38:28'),
('d7ab3db8-c8ba-429e-b143-dc1f0b627104', '85e1f279ea604c568fed6fa5c6ae1148', '5441c7ec5c2dae6607eb4d52d6d2d42ce846fd4257be9ec40563309d8af1f6e7', '2025-07-02 11:24:35', NULL, '2025-06-25 11:24:35'),
('d8e508af-84cd-4c83-9045-2e9dd306e935', '85e1f279ea604c568fed6fa5c6ae1148', 'cd5012028384a7ca9964ecafe92a4ad76e46bffa43b7742d9b4bf4a686fc92f3', '2025-06-22 22:00:29', '2025-06-15 15:02:53', '2025-06-15 15:00:28'),
('daf7c28b-93f9-4de5-8fb7-e5f2d12e9871', '72343f5f32c64696be82bbbc79615765', 'ba5bb39e5d29ebc742220cc091c348b190aa5076281860344a0c14340e5f2541', '2025-06-28 00:02:44', NULL, '2025-06-20 17:02:44'),
('df7e2c67-9eab-4fc2-a73c-cac9b7a070e0', '85e1f279ea604c568fed6fa5c6ae1148', '08ba1a41e82a6a80dd95b2e9f4c2999aede540e069e63e7367a37be289a7a125', '2025-06-22 21:58:48', NULL, '2025-06-15 14:58:47'),
('e0cbb360-594f-48a8-a004-114ca1f03f37', '72343f5f32c64696be82bbbc79615765', '78c1e60543b1c653c121bb8dab27f2e8c0e6c518431485e6ecf7e64eaec63ad8', '2025-06-22 23:05:31', NULL, '2025-06-15 16:05:30'),
('e4d38f62-5ab5-484c-a2ea-58981b66f51b', '85e1f279ea604c568fed6fa5c6ae1148', 'd9f0509380a451379ac5c10bfcc87e4dcd4067b1fa4613ae6e8ce2c542787648', '2025-07-02 09:55:02', NULL, '2025-06-25 09:55:02'),
('eb235231-8cf4-47d4-84d3-65f981b77dd5', '72343f5f32c64696be82bbbc79615765', '5fbc44e8d2a610729e8cfde618ae9675a6a5bc021b5e03e45cd3e592ab15e66b', '2025-06-22 22:40:13', NULL, '2025-06-15 15:40:12'),
('ee9f5d84-a32d-4ec4-8767-e320eaa04090', '72343f5f32c64696be82bbbc79615765', '737a70ba413cd90165780b51e179091a49ff388091dd03331baf0b9c6d8b5542', '2025-06-22 22:41:13', NULL, '2025-06-15 15:41:12'),
('eef191ef-bc66-431d-af6c-659a32a052f7', '72343f5f32c64696be82bbbc79615765', '5777a1275404656cc533044d5f75e1133b97ec64647eef06e467142181f92082', '2025-06-22 22:27:24', NULL, '2025-06-15 15:27:24'),
('f0bf0ff9-184d-4dc6-b5a9-4488b7a9cdd2', '72343f5f32c64696be82bbbc79615765', '4c91c5e7b9a7e2d1ed226423047dba44d1dbaec045721575273e7a12dee3d7e8', '2025-06-29 20:22:11', NULL, '2025-06-22 13:22:10'),
('f5a960cc-6658-47ec-86a5-f5a2fc11aec7', '72343f5f32c64696be82bbbc79615765', '651d14c288111d6e0fa2bd82e96fb0d0feb7cb788ab160276a93f4027a21cc4e', '2025-06-22 23:19:21', '2025-06-15 16:19:37', '2025-06-15 16:19:20'),
('fb99f0f8-36a7-49e5-a723-908f8ff66baf', '72343f5f32c64696be82bbbc79615765', 'e7a59c4bd9bd3515a53b526a9017b4559915f9497a1fec4955a5265c0ec77d66', '2025-06-29 13:44:01', NULL, '2025-06-22 06:44:01');

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
('186624777038435292d6a7b7cd97a91c', 'apporve', '2025-06-25 12:52:59'),
('2e977588491a11f08b210242ac120002', 'admin', '2025-06-14 12:22:04'),
('2e977bff491a11f08b210242ac120002', 'manager', '2025-06-14 12:22:04'),
('2e977e66491a11f08b210242ac120002', 'staff', '2025-06-14 12:22:04'),
('7b6c8f7041ba44a2a9dea449ae32078e', 'apporve2', '2025-06-25 12:56:30');

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
('', '186624777038435292d6a7b7cd97a91c', '84c28c43491a11f08b210242ac120002', '2025-06-25 13:15:40'),
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
  `department_id` char(32) DEFAULT NULL COMMENT 'รหัสแผนก (FK → departments.department_id)',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'สถานะสมาชิก (active=ใช้งานได้, inactive=ระงับ)',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างบัญชี',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'วันที่แก้ไขข้อมูลล่าสุด'
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
('8da5681bb46646babcd6cbbef9a290c6', 'pm_test07', 'pm_test07@example.com', '$2b$10$hJ238SiIiwUsV/fRzuskJOq9wPT8M/8zL/cwDK3.9AraMsLL.hrB6', 'ทดสอบ', 'พีเอม', 'other', '1234567890123', '0812345678', 'ซ.ทดสอบ 1', 'Thailand', 'Bangkok', '10200', NULL, '<ใส่ department_id จริง>', 'active', '2025-06-25 09:54:38', NULL),
('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'mockuser1', 'mock1@example.com', '$2b$10$VP1b/uPtWG3ZRhCbMOXodu5q1u3mN7IqddwjsMdCHgTeKr07I0nA6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-06-21 13:42:18', NULL),
('ab6da1cff94548bd9f45fa3c7962bbc9', 'pm_test02', 'pm_test02@example.com', '$2b$10$g6uOq4EXL2N7r4NFKix1q.g6WGWumsc/blCHLG/C496D/bI/K0SlO', 'ทดสอบ', 'พีเอม', 'other', '1234567890123', '0812345678', 'ซ.ทดสอบ 1', 'Thailand', 'Bangkok', '10200', NULL, '<ใส่ department_id จริง>', 'active', '2025-06-15 15:38:28', NULL),
('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'mockuser2', 'mock2@example.com', '$2b$10$VP1b/uPtWG3ZRhCbMOXodu5q1u3mN7IqddwjsMdCHgTeKr07I0nA6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-06-21 13:42:18', NULL),
('cccccccccccccccccccccccccccccccc', 'mockuser3', 'mock3@example.com', '$2b$10$VP1b/uPtWG3ZRhCbMOXodu5q1u3mN7IqddwjsMdCHgTeKr07I0nA6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-06-21 13:42:18', NULL),
('dddddddddddddddddddddddddddddddd', 'mockuser4', 'mock4@example.com', '$2b$10$VP1b/uPtWG3ZRhCbMOXodu5q1u3mN7IqddwjsMdCHgTeKr07I0nA6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-06-21 13:42:18', NULL);

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

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `license_plate`, `type_id`, `brand_id`, `capacity`, `color`, `description`, `image_path`, `is_public`, `created_at`) VALUES
('26a11c410f824305bb2d73e22801161f', 'ขข-2345', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 2, 'แดง', 'รถกระบะ CAB 2 ประตู สีแดง', NULL, 1, '2025-06-19 17:18:04'),
('2b70bc4b11fb4599a227697afe9dc659', 'กข-1234', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถกระบะ CAB 2 ประตู สีดำ', NULL, 1, '2025-06-19 17:17:36'),
('33b321c390d54392a22e98542adc5316', 'งง-9900', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'น้ำเงิน', 'รถกระบะ CAB 2 ประตู สีน้ำเงิน', NULL, 1, '2025-06-19 17:18:49'),
('43ba655e42e24ad5b3747d13e2c7b6ea', 'กข-5678', '5fb520974a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 5, 'ขาว', 'รถเก๋ง 4 ประตู สีขาว', NULL, 1, '2025-06-19 17:17:50'),
('4a5464e9291247e9bc30aa10338b6712', 'ขข-2011', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถกระบะ CAB 2 ประตู ทดสอบ POST', NULL, 1, '2025-06-21 11:57:08'),
('526caa5ad38046b9a44e29d69ef2315f', 'ขข-1122', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 6, 'ดำ', 'รถ SUV สีดำ', NULL, 1, '2025-06-19 17:18:20'),
('63fc17f524834f099342b89700c9f494', 'ขข-2001', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถกระบะ CAB 2 ประตู ทดสอบ POST', NULL, 1, '2025-06-21 11:56:09'),
('8a2ff95894ab4e2686f65636b488d106', 'คค-7788', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 7, 'แดง', 'รถ SUV สีแดง', NULL, 1, '2025-06-19 17:18:43'),
('8e307151a99d4f0b9d9e744cdc44f707', 'คค-3344', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 5, 'เทา', 'รถกระบะ CAB 2 ประตู สีเทา', NULL, 1, '2025-06-19 17:18:30'),
('9f86856ced2e4e6d99683e818fe74c77', 'กข-9999', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'Black', 'ทดสอบสร้างรถใหม่', NULL, 1, '2025-06-15 15:50:54'),
('a0d1e2f3a4b5c6d7e8f9061a2b3c4d5', 'ขข-1010', '5fb520974a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 5, 'ชมพู', 'รถเก๋ง 4 ประตู สีชมพู', NULL, 1, '2025-06-21 11:33:29'),
('a4d5e6f7a8b96c1d2e3f45061a2b3c4', 'ขข-1004', '5fb520974a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 5, 'น้ำเงิน', 'รถเก๋ง 4 ประตู สีน้ำเงิน', NULL, 1, '2025-06-21 11:33:29'),
('a9391ac3fd40495dbf843d414c91ca35', 'กข-9101', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 7, 'เงิน', 'รถ SUV สีเงิน', NULL, 1, '2025-06-19 17:17:57'),
('b5e6f7a8b9c0d1e2f3a45061a2b3c4d5', 'ขข-1005', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 7, 'เทา', 'รถ SUV สีเทา', NULL, 1, '2025-06-21 11:33:29'),
('c6f7a8b9c0d1e2f3a4b5061a2b3c4d5e', 'ขข-1006', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 7, 'แดง', 'รถ SUV สีแดง', NULL, 1, '2025-06-21 11:33:29'),
('d1a2b3c4d5e647f8a9b0c1d2e3f45061', 'ขข-1001', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'แดง', 'รถกระบะ CAB 2 ประตู สีแดง', NULL, 1, '2025-06-21 11:33:29'),
('d7a8b9c0d1e2f3a4b5c6061a2b3c4d5', 'ขข-1007', '5fb512404a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถกระบะ CAB 2 ประตู สีดำอีกคัน', NULL, 1, '2025-06-21 11:33:29'),
('e2b3c4d5e6f748a9b0c1d2e3f45061a2', 'ขข-1002', '5fb512404a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 2, 'ดำ', 'รถกระบะ CAB 2 ประตู สีดำ', NULL, 1, '2025-06-21 11:33:29'),
('e5a33d311331430b8d3f80109462562e', 'กข-12345', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถทดสอบ', NULL, 1, '2025-06-20 17:15:38'),
('e8b9c0d1e2f3a4b5c6d7061a2b3c4d5', 'ขข-1008', '5fb520974a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'เหลือง', 'รถเก๋ง 4 ประตู สีเหลือง', NULL, 1, '2025-06-21 11:33:29'),
('f26639b8281648e3bcddca34b80d5aac', 'คค-5566', '5fb520974a0011f08325fe6471b6f9ca', '5fb73d434a0011f08325fe6471b6f9ca', 4, 'ขาว', 'รถเก๋ง 4 ประตู สีขาว', NULL, 1, '2025-06-19 17:18:36'),
('f3c4d5e6f7a859b0c1d2e3f45061a2b3', 'ขข-1003', '5fb520974a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 5, 'ขาว', 'รถเก๋ง 4 ประตู สีขาว', NULL, 1, '2025-06-21 11:33:29'),
('f9c0d1e2f3a4b5c6d7e8061a2b3c4d5', 'ขข-1009', '5fb5224c4a0011f08325fe6471b6f9ca', '5fb73f2b4a0011f08325fe6471b6f9ca', 7, 'เขียว', 'รถ SUV สีเขียว', NULL, 1, '2025-06-21 11:33:29'),
('fa10e9afbe5a4cfe82cfb755d557d786', 'กข-123v4', '5fb512404a0011f08325fe6471b6f9ca', '5fb72f954a0011f08325fe6471b6f9ca', 4, 'ดำ', 'รถทดสอบ', NULL, 1, '2025-06-20 17:18:33');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_brands`
--

CREATE TABLE `vehicle_brands` (
  `brand_id` char(32) NOT NULL COMMENT 'รหัสยี่ห้อแบบ UUID v4 ไม่มีขีด (32 หลัก)',
  `name` varchar(50) NOT NULL COMMENT 'ชื่อยี่ห้อ เช่น Mitsubishi, Toyota',
  `created_at` timestamp NULL DEFAULT current_timestamp() COMMENT 'วันที่สร้างยี่ห้อ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บยี่ห้อของยานพาหนะ';

--
-- Dumping data for table `vehicle_brands`
--

INSERT INTO `vehicle_brands` (`brand_id`, `name`, `created_at`) VALUES
('0bb64466a8024229a7b6450c70acc97e', 'Isuzu (แก้ไข)', '2025-06-21 11:23:32'),
('5fb72f954a0011f08325fe6471b6f9ca', 'Toyota', '2025-06-15 15:49:51'),
('5fb73d434a0011f08325fe6471b6f9ca', 'Mitsubishi', '2025-06-15 15:49:51'),
('5fb73f2b4a0011f08325fe6471b6f9ca', 'Honda', '2025-06-15 15:49:51');

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
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`type_id`, `name`, `created_at`) VALUES
('5fb512404a0011f08325fe6471b6f9ca', 'รถกระบะ CAB 2 ประตู', '2025-06-15 15:49:51'),
('5fb520974a0011f08325fe6471b6f9ca', 'รถเก๋ง 4 ประตู', '2025-06-15 15:49:51'),
('5fb5224c4a0011f08325fe6471b6f9ca', 'รถ SUV', '2025-06-15 15:49:51'),
('88df566869594f2d9fc2fb57cb29c2fa', 'รถใหม่ B', '2025-06-21 10:44:57'),
('a2f67fe01c0a4db6ab813f3e0a22c71d', 'รถตู้', '2025-06-21 11:14:25'),
('c04c7284e0ae4b5eb18e4beb0f11ddf6', 'รถตู้ (แก้ไข)', '2025-06-21 11:21:24'),
('d86c18fa1cf64c62a889603a2bc3b8a9', 'รถกระบะแก้ไข', '2025-06-21 11:15:22'),
('f360fbdbc9654f98999ccc29ba8f9544', 'รถใหม่', '2025-06-21 10:40:20');

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
