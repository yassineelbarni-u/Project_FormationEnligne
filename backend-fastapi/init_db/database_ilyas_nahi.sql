-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 18 août 2025 à 01:45
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `database_ilyas_nahi`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_super_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `email`, `name`, `hashed_password`, `is_active`, `created_at`, `is_super_admin`) VALUES
(2, 'admin@ilyasnahi.com', 'Ilyas Nahi', '$2b$12$Q9RC95R1qJI17dA6XNaUOOVfqnLtYWBdA3l41B2cJNcmEJgsU7rPG', 1, '2025-07-20 15:35:23', 1),
(5, 'yassineelbarni@gmail.com', 'yassineelbarni', '$2b$12$TYB1N9mMSGcXLhOAF6dtTefexU/xJjQ.Am35P4Y4u2YPGDTHvoE6q', 1, '2025-08-03 16:06:48', 0);

-- --------------------------------------------------------

--
-- Structure de la table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_filename` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `admin_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `announcements`
--

INSERT INTO `announcements` (`id`, `image_url`, `image_filename`, `is_active`, `display_order`, `admin_id`, `created_at`, `updated_at`) VALUES
(5, '/images/announcements/ff205e89-3076-4338-9dbd-df2459f32819.png', 'ff205e89-3076-4338-9dbd-df2459f32819.png', 1, 0, 2, '2025-08-15 14:42:47', '2025-08-15 14:42:47'),
(10, '/images/announcements/971307ec-e64b-474d-84b2-f1dc0b549d47.jpg', '971307ec-e64b-474d-84b2-f1dc0b549d47.jpg', 1, 0, 2, '2025-08-16 15:39:17', '2025-08-16 15:39:17');

-- --------------------------------------------------------

--
-- Structure de la table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `drive_folder_id` varchar(255) DEFAULT NULL,
  `access_code` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `subject`, `level`, `drive_folder_id`, `access_code`, `is_active`, `admin_id`, `created_at`) VALUES
(7, 'sdvcsdv', 'sdsd', 'Physique', 'Débutant', '', 'RTGM0XUI', 1, NULL, '2025-07-31 20:47:40'),
(16, 'test 2', '', 'Mathématiques', 'Débutant', '', 'GJ1XQU6E', 1, 2, '2025-08-02 14:40:43');

-- --------------------------------------------------------

--
-- Structure de la table `course_accesses`
--

CREATE TABLE `course_accesses` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `access_type` varchar(50) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course_accesses`
--

INSERT INTO `course_accesses` (`id`, `student_id`, `course_id`, `access_type`, `access_token`, `expires_at`, `is_active`, `created_at`) VALUES
(1, NULL, NULL, 'link', 'HmcveXM6SlTSAqHX9xfJQMz_7i3ZSQnHXQcAb7nqXCo', '2025-08-20 13:33:18', 1, '2025-07-21 14:33:18'),
(2, NULL, NULL, 'link', 'WV7_h-OeUZ4vBG7vMiU05unfmHCnEkBfxu226Tmoyo8', '2025-08-20 13:36:41', 1, '2025-07-21 14:36:41'),
(3, NULL, NULL, 'link', '9T025vFOnv3BBlOP6gSjI1XX-0LNu0n8P2kgGEVdA3k', '2025-08-20 13:50:23', 1, '2025-07-21 14:50:23'),
(4, NULL, NULL, 'link', 'vV_pNvtbV8xjIlGraVCHPMQT5baQxLbLntLNNyvuVcI', '2025-08-20 13:52:59', 1, '2025-07-21 14:52:59'),
(5, NULL, NULL, 'link', '6VJ35lXPzqGyPQCJCv76it_xIvs1ttOv46G-vI7jjo8', '2025-08-20 13:53:08', 1, '2025-07-21 14:53:08'),
(18, 2, NULL, 'standard', 'BLSs1te0i332uClhSEkD8Mz2Za7uTBLJAS3MtYegZAs', '2025-08-31 16:41:35', 1, '2025-08-01 17:41:35'),
(19, NULL, NULL, 'link', 'g3o1EC9Y16n0wLf0XwWdQo4EIXfYYGlQJD9rJfnlg6E', '2025-08-31 16:54:46', 1, '2025-08-01 17:54:46'),
(21, 2, NULL, 'standard', 'HZTIOd5tkeWmXjB3CORPp26yAZZ61RZY2XMBv5MsF-8', '2025-08-31 18:34:01', 1, '2025-08-01 19:34:01'),
(30, 2, NULL, 'standard', 'nTGWsgQ-hucY5oV_NOT4-4qhnoQIog5KdHlu6uI3eEc', '2025-09-02 13:06:50', 1, '2025-08-03 14:06:50'),
(34, 7, NULL, 'standard', 'i7QcfIN6X1DXOvDByTity2lbbSX546VMRH8LHtYZRas', '2025-11-12 14:35:17', 1, '2025-08-04 15:35:17'),
(35, 2, 16, 'full', 'qFAf1TibGSPwusSA-5sSYaAxv2fKAKWF3o3D_cVEcLY', '2025-09-10 13:54:49', 1, '2025-08-11 14:38:30');

-- --------------------------------------------------------

--
-- Structure de la table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` int(11) NOT NULL,
  `job_offer_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `cover_letter` text DEFAULT NULL,
  `cv_filename` varchar(255) DEFAULT NULL,
  `cv_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `job_applications`
--

INSERT INTO `job_applications` (`id`, `job_offer_id`, `first_name`, `last_name`, `email`, `phone`, `cover_letter`, `cv_filename`, `cv_url`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'YASSINE', 'ELBARNI', 'yassineyassineee@gmail.com', '09672435243', 'JE UIS YASSINE', '93131448-21d6-4667-b403-fa9008da8b76.pdf', '/cv/93131448-21d6-4667-b403-fa9008da8b76.pdf', 'accepted', '', '2025-08-16 20:13:00', '2025-08-16 21:20:15'),
(2, 1, 'yass', 'sss', 'sss@gmail.com', '12222222222', NULL, 'b03ce631-7468-40f9-97a7-d3038a2a3011.pdf', '/cv/b03ce631-7468-40f9-97a7-d3038a2a3011.pdf', 'accepted', '', '2025-08-16 20:38:17', '2025-08-16 21:37:55');

-- --------------------------------------------------------

--
-- Structure de la table `job_offers`
--

CREATE TABLE `job_offers` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `application_deadline` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Table des offres d emploi publiées par les administrateurs - champs job_type et experience_level supprimés';

--
-- Déchargement des données de la table `job_offers`
--

INSERT INTO `job_offers` (`id`, `title`, `company`, `location`, `description`, `requirements`, `benefits`, `salary_range`, `application_deadline`, `is_active`, `admin_id`, `created_at`, `updated_at`) VALUES
(1, 'recherche une prof math', 'Learning by Ilyas', 'maroc', 'ZRFZRF', '', '', '', '2025-08-30 00:00:00', 1, 2, '2025-08-16 20:10:05', '2025-08-16 20:10:05');

-- --------------------------------------------------------

--
-- Structure de la table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `students`
--

INSERT INTO `students` (`id`, `name`, `email`, `phone`, `level`, `is_active`, `created_at`) VALUES
(2, 'kamal el barni', 'kamal@gmail.com', '912324354', 'Intermédiaire', 1, '2025-08-01 17:32:11'),
(7, 'ilyas nahi', 'nahi@gmail.com', '095656565645', 'Intermédiaire', 1, '2025-08-04 15:34:52');

-- --------------------------------------------------------

--
-- Structure de la table `student_courses`
--

CREATE TABLE `student_courses` (
  `student_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `student_courses`
--

INSERT INTO `student_courses` (`student_id`, `course_id`) VALUES
(2, 16);

-- --------------------------------------------------------

--
-- Structure de la table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `drive_file_id` varchar(255) DEFAULT NULL,
  `drive_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `order_in_course` int(11) DEFAULT NULL,
  `is_free` tinyint(1) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `module_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `drive_file_id`, `drive_url`, `thumbnail_url`, `duration`, `order_in_course`, `is_free`, `course_id`, `admin_id`, `created_at`, `module_name`) VALUES
(5, 'math', 'zdcz', '11aGKmXViEukxNjYjQ4rSJcs9nJ8RFFs8', 'https://drive.google.com/file/d/11aGKmXViEukxNjYjQ4rSJcs9nJ8RFFs8/view?usp=sharing', 'https://drive.google.com/thumbnail?id=11aGKmXViEukxNjYjQ4rSJcs9nJ8RFFs8', '2', 0, 0, NULL, 2, '2025-07-23 01:17:31', NULL),
(6, 'math', 'zedze', '1pF4acveOytJb5rtGf_eL8iC-EDHjrle5', 'https://drive.google.com/file/d/1pF4acveOytJb5rtGf_eL8iC-EDHjrle5/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1pF4acveOytJb5rtGf_eL8iC-EDHjrle5', '1232', 0, 0, NULL, 2, '2025-07-23 01:29:40', NULL),
(7, 'pysique', '', '1pj6FS0Hw2WcopK6ahcOGGUzqU_nluQMq', 'https://drive.google.com/file/d/1pj6FS0Hw2WcopK6ahcOGGUzqU_nluQMq/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1pj6FS0Hw2WcopK6ahcOGGUzqU_nluQMq', '', 0, 0, NULL, 2, '2025-07-23 11:51:58', NULL),
(8, 'rdfv', 'zdeczdc', '19NKXuLszQ2l-XsPZhZEVK1FK0VShpTrh', 'https://drive.google.com/file/d/19NKXuLszQ2l-XsPZhZEVK1FK0VShpTrh/view?usp=sharing', 'https://drive.google.com/thumbnail?id=19NKXuLszQ2l-XsPZhZEVK1FK0VShpTrh', '1:00', 0, 0, NULL, 2, '2025-07-24 15:08:48', NULL),
(9, 'sdvsv', 'sdvsd', '15olS1Y_00NXiZ6qPVQn8Cxva3PuH6Eec', 'https://drive.google.com/file/d/15olS1Y_00NXiZ6qPVQn8Cxva3PuH6Eec/view?usp=sharing', 'https://drive.google.com/thumbnail?id=15olS1Y_00NXiZ6qPVQn8Cxva3PuH6Eec', '15', 0, 0, NULL, 2, '2025-07-24 19:29:15', NULL),
(10, 'dfbvdfbv', '', '1pj6FS0Hw2WcopK6ahcOGGUzqU_nluQMq', 'https://drive.google.com/file/d/1pj6FS0Hw2WcopK6ahcOGGUzqU_nluQMq/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1pj6FS0Hw2WcopK6ahcOGGUzqU_nluQMq', '', 0, 0, NULL, 2, '2025-07-31 14:44:42', NULL),
(11, 'zefz', '', '1yI-ZWTwWUMHL2sa-HnwuygysjQoKhnnS', 'https://drive.google.com/file/d/1yI-ZWTwWUMHL2sa-HnwuygysjQoKhnnS/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1yI-ZWTwWUMHL2sa-HnwuygysjQoKhnnS', '', 0, 0, NULL, 2, '2025-07-31 18:28:28', NULL),
(12, 'sdc', '', '1SoTDxonWQ9CR8XA06kL_VhL2A9n35deT', 'https://drive.google.com/file/d/1SoTDxonWQ9CR8XA06kL_VhL2A9n35deT/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1SoTDxonWQ9CR8XA06kL_VhL2A9n35deT', '', 0, 0, 7, NULL, '2025-07-31 20:50:46', NULL),
(13, 'qsxd', 'qscs', '1sqgzqiMaKbNCuNPRA_GwBgRBKkzeRxKe', 'https://drive.google.com/file/d/1sqgzqiMaKbNCuNPRA_GwBgRBKkzeRxKe/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1sqgzqiMaKbNCuNPRA_GwBgRBKkzeRxKe', '', 0, 0, NULL, 2, '2025-08-01 17:27:57', NULL),
(15, 'algebre 1 - Playlist depuis Google Drive', 'Vidéos importées depuis le dossier Google Drive. ID du dossier: 1ji0J0Jb_ictI9O2HjwjzGcc3aikaVCUD', '1ji0J0Jb_ictI9O2HjwjzGcc3aikaVCUD', 'https://drive.google.com/drive/folders/1ji0J0Jb_ictI9O2HjwjzGcc3aikaVCUD?usp=sharing', 'https://drive.google.com/thumbnail?id=1ji0J0Jb_ictI9O2HjwjzGcc3aikaVCUD', 'Playlist', 1, 0, NULL, 2, '2025-08-01 19:06:13', NULL),
(16, 'algebre 1', '', '1yI-ZWTwWUMHL2sa-HnwuygysjQoKhnnS', 'https://drive.google.com/file/d/1yI-ZWTwWUMHL2sa-HnwuygysjQoKhnnS/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1yI-ZWTwWUMHL2sa-HnwuygysjQoKhnnS', '', 0, 0, NULL, 2, '2025-08-01 19:31:55', NULL),
(22, 'test', 'qsdcq', '1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za', 'https://drive.google.com/file/d/1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za', '', 0, 0, NULL, 2, '2025-08-02 12:52:39', NULL),
(23, 'espace vectorier', '', '1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za', 'https://drive.google.com/file/d/1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za', '', 0, 0, NULL, 2, '2025-08-02 13:05:29', NULL),
(24, 'sience 2', '', '1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za', 'https://drive.google.com/file/d/1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1mnvF1SQ_rC-xuyVtsXRtDxysXxF6z_Za', '', 1, 0, NULL, 2, '2025-08-02 13:06:10', NULL),
(25, 'algebre 1', '', '12PU8UlEMNJ2PDpLqHS_SC-GpczM2DGeM', 'https://drive.google.com/file/d/12PU8UlEMNJ2PDpLqHS_SC-GpczM2DGeM/view?usp=drive_link', 'https://drive.google.com/thumbnail?id=12PU8UlEMNJ2PDpLqHS_SC-GpczM2DGeM', '', 0, 0, 16, 2, '2025-08-02 14:41:18', 'matrice'),
(27, 'algebre 1', '', '12PU8UlEMNJ2PDpLqHS_SC-GpczM2DGeM', 'https://drive.google.com/file/d/12PU8UlEMNJ2PDpLqHS_SC-GpczM2DGeM/view?usp=drive_link', 'https://drive.google.com/thumbnail?id=12PU8UlEMNJ2PDpLqHS_SC-GpczM2DGeM', '', 0, 0, 16, 2, '2025-08-02 14:45:01', 'matrice'),
(28, 'test 1234', '', '11aGKmXViEukxNjYjQ4rSJcs9nJ8RFFs8', 'https://drive.google.com/file/d/11aGKmXViEukxNjYjQ4rSJcs9nJ8RFFs8/view?usp=drive_link', 'https://drive.google.com/thumbnail?id=11aGKmXViEukxNjYjQ4rSJcs9nJ8RFFs8', '', 0, 0, NULL, 2, '2025-08-02 15:00:18', 'matrice'),
(29, 'matrice 2', '', '17JVHy5oBs8HvE-0RzE-joQv-TARKMkrt', 'https://drive.google.com/file/d/17JVHy5oBs8HvE-0RzE-joQv-TARKMkrt/view?usp=sharing', 'https://drive.google.com/thumbnail?id=17JVHy5oBs8HvE-0RzE-joQv-TARKMkrt', NULL, 0, 0, 16, 2, '2025-08-03 17:44:55', 'matrice'),
(30, 'algo', '', '1u1W5lFmaHqXjKokTSDyHA4hSmGgAXrnq', 'https://drive.google.com/file/d/1u1W5lFmaHqXjKokTSDyHA4hSmGgAXrnq/view?usp=sharing', 'https://drive.google.com/thumbnail?id=1u1W5lFmaHqXjKokTSDyHA4hSmGgAXrnq', NULL, 0, 0, 16, 2, '2025-08-11 14:07:30', 'matrice');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_announcements_id` (`id`),
  ADD KEY `fk_announcements_admin_id` (`admin_id`);

--
-- Index pour la table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `access_code` (`access_code`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `ix_courses_title` (`title`),
  ADD KEY `ix_courses_id` (`id`);

--
-- Index pour la table `course_accesses`
--
ALTER TABLE `course_accesses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `ix_course_accesses_id` (`id`);

--
-- Index pour la table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_offer_id` (`job_offer_id`),
  ADD KEY `ix_job_applications_id` (`id`);

--
-- Index pour la table `job_offers`
--
ALTER TABLE `job_offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `ix_job_offers_title` (`title`),
  ADD KEY `ix_job_offers_id` (`id`);

--
-- Index pour la table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_students_email` (`email`),
  ADD KEY `ix_students_id` (`id`);

--
-- Index pour la table `student_courses`
--
ALTER TABLE `student_courses`
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Index pour la table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `ix_videos_id` (`id`),
  ADD KEY `ix_videos_title` (`title`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `course_accesses`
--
ALTER TABLE `course_accesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `job_offers`
--
ALTER TABLE `job_offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `fk_announcements_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Contraintes pour la table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Contraintes pour la table `course_accesses`
--
ALTER TABLE `course_accesses`
  ADD CONSTRAINT `course_accesses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `course_accesses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Contraintes pour la table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_offer_id`) REFERENCES `job_offers` (`id`);

--
-- Contraintes pour la table `job_offers`
--
ALTER TABLE `job_offers`
  ADD CONSTRAINT `job_offers_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);

--
-- Contraintes pour la table `student_courses`
--
ALTER TABLE `student_courses`
  ADD CONSTRAINT `student_courses_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `student_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Contraintes pour la table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
