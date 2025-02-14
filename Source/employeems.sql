-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2023 at 09:23 PM
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
-- Database: `employeems`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(140) NOT NULL
) ;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`) VALUES
(1, 'Admins', 'admin@gmail.com', '12345'),
(2, 'Hamza', 'hamza@gmail.com', '12345'),
(3, 'Salar', 'salar@gmail.com', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `in_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `attendance_date` date NOT NULL DEFAULT current_timestamp(),
  `status` char(1) NOT NULL DEFAULT '-'
) ;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `in_time`, `attendance_date`, `status`) VALUES
(20, '2023-12-04 15:19:09', '2023-12-04', 'A'),
(20, '2023-12-06 18:05:27', '2023-12-06', 'P'),
(23, '2023-12-04 15:43:12', '2023-12-04', 'P'),
(23, '2023-12-05 05:27:46', '2023-12-05', 'A'),
(23, '2023-12-06 17:55:58', '2023-12-06', 'P'),
(28, '2023-12-04 15:19:09', '2023-12-04', 'P'),
(32, '2023-12-04 15:19:09', '2023-12-04', 'P'),
(33, '2023-12-04 15:19:09', '2023-12-04', 'P'),
(40, '2023-12-04 15:19:09', '2023-12-04', 'P'),
(42, '2023-12-04 18:01:45', '2023-12-04', 'P');

--
-- Triggers `attendance`
--
DELIMITER $$
CREATE TRIGGER `trg_after_insert_attendance` AFTER INSERT ON `attendance` FOR EACH ROW BEGIN
    DECLARE absences INT;
    DECLARE salary DECIMAL(10, 2);

    -- Get the count of absences
    SELECT COUNT(*) INTO absences
    FROM attendance
    WHERE id = NEW.id AND status = 'A';

    -- If absences are more than 3, decrease salary by 1% for each additional absence
    IF absences > 3 THEN
        SELECT salary INTO salary
        FROM employees
        WHERE id = NEW.id;

        UPDATE employees
        SET salary = salary * (1 - 0.01 * (absences - 3))
        WHERE id = NEW.id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_before_insert_attendance` BEFORE INSERT ON `attendance` FOR EACH ROW BEGIN
    IF NEW.id NOT IN (SELECT id FROM employees) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid employee_id';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `manager_id` int(11) NOT NULL
) ;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `manager_id`) VALUES
(1, 'Development', 1),
(2, 'Network', 1),
(3, 'Systems Analysis', 1),
(4, 'Database Management', 1),
(5, 'Cybersecurity', 1),
(6, 'Project Management Office (PMO)', 1),
(7, 'IT Support/Helpdesk', 2),
(8, 'Cloud Services', 2),
(9, 'DevOps', 3),
(10, 'Data Science', 3),
(11, 'UI/UX Design', 3),
(12, 'IT Audit and Compliance', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(140) NOT NULL,
  `password` varchar(100) NOT NULL,
  `salary` int(11) NOT NULL,
  `address` varchar(200) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `password`, `salary`, `address`, `job_id`, `department_id`) VALUES
(20, 'Talha', 'talha@gmail.com', '12345', 60000, 'Fast ', 12, 12),
(23, 'salar', 'salar@gmail.com', '12345', 25000, 'Shah Faisal', 4, 4),
(24, 'Hassan', 'hassan@gmail.com', '12345', 50000, 'Gulshan-e-Hadeed', 9, 9),
(28, 'Asad Jaffer', 'asad@gmail.com', '12345', 40000, 'Gulshan e Hadeed', 4, 4),
(32, 'yasir', 'yasir@gmail.com', '12345', 4000, 'Fast', 2, 2),
(33, 'Junaid', 'joji@gmail.com', '12345', 20000, 'Karimabad', 4, 11),
(40, 'Saif', 'saif@gmail.com', '12345', 35000, 'Hyderabad', 11, 11),
(42, 'Ali', 'ali@gmail.com', '12345', 30000, 'Karachi', 3, 3);

--
-- Triggers `employees`
--
DELIMITER $$
CREATE TRIGGER `trg_before_update_employees` BEFORE UPDATE ON `employees` FOR EACH ROW BEGIN
    IF NEW.department_id NOT IN (SELECT id FROM departments) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid department_id';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `title` varchar(256) NOT NULL
) ;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `title`) VALUES
(8, 'Cloud Solutions Architect'),
(5, 'Cybersecurity Analyst'),
(10, 'Data Scientist'),
(4, 'Database Administrator'),
(9, 'DevOps Engineer'),
(12, 'IT Auditor'),
(6, 'IT Project Manager'),
(7, 'IT Support Specialist'),
(2, 'Network Engineer'),
(1, 'Software Developer'),
(3, 'Systems Analyst'),
(11, 'UI/UX Designer');

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Under Review'
) ;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `employee_id`, `start_date`, `end_date`, `reason`, `status`) VALUES
(1, 23, '2023-12-04', '2023-12-06', 'asas', 'Declined'),
(24, 23, '2023-12-07', '2023-12-14', 'sick', 'Accepted'),
(25, 23, '2023-12-07', '2023-12-14', 'Emergency', 'Accepted');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`,`attendance_date`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_department_name` (`name`),
  ADD KEY `id` (`id`),
  ADD KEY `fk_manager` (`manager_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `fk_department` (`department_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_job_title` (`title`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_manager` FOREIGN KEY (`manager_id`) REFERENCES `admin` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_jobs` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
