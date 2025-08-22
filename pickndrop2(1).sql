-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2025 at 09:27 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pickndrop2`
--

-- --------------------------------------------------------

--
-- Table structure for table `appusers`
--

CREATE TABLE `appusers` (
  `id` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Gender` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appusers`
--

INSERT INTO `appusers` (`id`, `FullName`, `UserName`, `Email`, `Password`, `Gender`) VALUES
(1, 'Ethan', 'test', 'ethan@gmail.com', '$2b$10$qvXHPnVJeNZTjensKobTSOAK0VTK1QoJ01f34b2/9HUjZSTpcgOz6', 'male'),
(4, 'Ethan', 'testa', 'ethana@gmail.com', '$2b$10$JZfcSDwvNOM8WX.jWGWeT.lwzOBHVQeMIlLLnDdH4hvAMI6ud9JOG', 'male'),
(5, 'me', 'meagain', 'samiradaheri99@gmail.com', '$2b$10$IzMdtRIWyg1c146PZaxBPuMZ0R6VBT1Yk3iCeiHQ/dkMASIo9WMOe', 'female'),
(6, 'Eliza', 'Pretty', 'eliza@gmail.com', '$2b$10$iyTWKyaCeFSBIpdF9zh.xetvphwk4BjkkF6dO8oQI9DdzuMPH8EUy', 'female'),
(7, 'Carla', 'Liane', 'liane@gmail.com', '$2b$10$YC4fVTR73J/ZO17HRhmEQ.E1qqZBJ6r7dB1Mhr0Np20tSbvW/LKvy', 'female'),
(8, 'vous', 'fatiguer', 'vous@gmail.com', '$2b$10$EZwXxcbRqQVxJpen0jV32uIIRMrjjZ/IE7btot0yhtvAMzn93yHt.', 'male'),
(9, 'testing', 'testing', 'testing@gmail.com', '$2b$10$vcGFBOG3whDNy5WlDq9dn.tHHHwhCisJ60I38DfmusOqsuHVa5Icy', 'male'),
(10, 'samira', 'samgirl', 'sam@gmail.com', '$2b$10$bS5QSO3BwAQziDk51wTH5.WAMawXJppjh2sClGbv7vVSWybuZFXCO', 'male'),
(11, 'Ephriam', 'Boy', 'ephriam@gmail.com', '$2b$10$mAe15R4vcusRTQaRpEBv0uUsvfyq5.8cg3zSxxPzztwghCBIYe3zK', 'male'),
(12, 'ccccc', 'hello', 'hello@gmail.com', '$2b$10$CTj2olZ9k0fZcxfSBaR2u.19D2fObG5vyDrbxryAwGcfS2hq7voiy', 'female');

-- --------------------------------------------------------

--
-- Table structure for table `kyc`
--

CREATE TABLE `kyc` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `idSnapshot` varchar(255) DEFAULT NULL,
  `selfie` varchar(255) DEFAULT NULL,
  `passport` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `code` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kyc`
--

INSERT INTO `kyc` (`id`, `user_id`, `idSnapshot`, `selfie`, `passport`, `status`, `code`) VALUES
(1, 4, '1755028355661-420332005-CLI PASSWORD.png', '1755028355664-947150243-dashboard.png', '1755028355682-446878424-database.html.png', '', ''),
(2, 5, '1755029202214-166957316-CLI PASSWORD.png', '1755029202218-572773871-dashboard.png', '1755029202242-753901657-database.html.png', '', ''),
(3, 6, '1755031421813-297391852-27ae218c4e497b071b69b51cc7d6f136.jpg', '1755031421815-169033157-2388b642c294a7e2e8b56aed50cdd7e5.jpg', '1755031421817-729750379-8055544ab3d325b3615b937c7eb2a5e0.jpg', '', ''),
(4, 8, '1755735711414-392468631-30351faafe1b65f055bc23d8dd0cdaa0.jpg', '1755735711416-745656409-8055544ab3d325b3615b937c7eb2a5e0.jpg', '1755735711420-79872108-a6c971b3c12377267441c912c201d200.jpg', '', ''),
(5, 9, '1755802386781-369655252-83d0463e7ee1dbd6eb079b2cbf734095.jpg', '1755802386781-344351829-2388b642c294a7e2e8b56aed50cdd7e5.jpg', '1755802386783-826193909-30351faafe1b65f055bc23d8dd0cdaa0.jpg', 'approved', ''),
(6, 10, '1755803855716-979817858-83d0463e7ee1dbd6eb079b2cbf734095.jpg', '1755803855718-267634789-2388b642c294a7e2e8b56aed50cdd7e5.jpg', '1755803855721-914604346-30351faafe1b65f055bc23d8dd0cdaa0.jpg', 'approved', ''),
(7, 11, '1755807765160-112365292-dd0e936b46b15860b82395d4c4f5828d.jpg', '1755807765163-996917618-eecdff29bf32d709a17314df10811ab9.jpg', '1755807765168-466764400-f4bebf1ea6b8567517195b35cb429143.jpg', 'approved', ''),
(8, 12, '1755828989654-968528197-1b15404f47ab1002d5b157abdfdf5114.jpg', '1755828989654-51054624-5b698ab09f6fa5bf7657843200a0634d.jpg', '1755828989655-679827849-6d5ad4849876862908f4cbdfe0c1dbfe.jpg', 'approved', '');

-- --------------------------------------------------------

--
-- Table structure for table `post_trip`
--

CREATE TABLE `post_trip` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `Date` varchar(50) NOT NULL,
  `Location` varchar(255) NOT NULL,
  `Destination` varchar(255) NOT NULL,
  `Items` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_trip`
--

INSERT INTO `post_trip` (`id`, `user_id`, `Date`, `Location`, `Destination`, `Items`) VALUES
(1, 4, '2025-08-12', 'Yaounde', 'Miami', 'nothing'),
(2, 5, '2025-08-29', 'Bamenda', 'Clorida', 'nothin again '),
(3, 6, '2025-08-12', 'Yaounde', 'Marseilles', 'Pets'),
(4, 9, '2025-08-19', 'home', 'home again', 'nothing '),
(5, 11, '2025-08-20', 'home', 'home again ', 'something\r\n'),
(6, 10, '2025-08-21', 'Buea', 'America', 'food'),
(7, 10, '2025-08-21', 'Buea', 'America', 'food');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appusers`
--
ALTER TABLE `appusers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UserName` (`UserName`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `kyc`
--
ALTER TABLE `kyc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `post_trip`
--
ALTER TABLE `post_trip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_post_trip_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appusers`
--
ALTER TABLE `appusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kyc`
--
ALTER TABLE `kyc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `post_trip`
--
ALTER TABLE `post_trip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kyc`
--
ALTER TABLE `kyc`
  ADD CONSTRAINT `fk_kyc_user` FOREIGN KEY (`user_id`) REFERENCES `appusers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_trip`
--
ALTER TABLE `post_trip`
  ADD CONSTRAINT `fk_post_trip_user` FOREIGN KEY (`user_id`) REFERENCES `appusers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
