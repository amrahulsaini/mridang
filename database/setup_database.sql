-- Complete Database Setup Script
-- This file creates the entire Mridang database schema

-- Set SQL mode and timezone
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Set character set
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Create database
CREATE DATABASE IF NOT EXISTS `char_mridang` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `char_mridang`;

-- 1. Create Categories Table
CREATE TABLE `Categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 2. Create Colors Table
CREATE TABLE `Colors` (
  `color_id` int(11) NOT NULL AUTO_INCREMENT,
  `color_name` varchar(255) NOT NULL,
  PRIMARY KEY (`color_id`),
  UNIQUE KEY `color_name` (`color_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 3. Create Materials Table
CREATE TABLE `Materials` (
  `material_id` int(11) NOT NULL AUTO_INCREMENT,
  `material_name` varchar(255) NOT NULL,
  PRIMARY KEY (`material_id`),
  UNIQUE KEY `material_name` (`material_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 4. Create Art Form Types Table
CREATE TABLE `ArtFormTypes` (
  `art_form_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `art_form_type_name` varchar(255) NOT NULL,
  PRIMARY KEY (`art_form_type_id`),
  UNIQUE KEY `art_form_type_name` (`art_form_type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 5. Create Regional Specialities Table
CREATE TABLE `RegionalSpecialities` (
  `regional_speciality_id` int(11) NOT NULL AUTO_INCREMENT,
  `regional_speciality_name` varchar(255) NOT NULL,
  PRIMARY KEY (`regional_speciality_id`),
  UNIQUE KEY `regional_speciality_name` (`regional_speciality_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 6. Create Key Features Table
CREATE TABLE `KeyFeatures` (
  `feature_id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_text` text NOT NULL,
  PRIMARY KEY (`feature_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 7. Create Search Keywords Table
CREATE TABLE `SearchKeywords` (
  `keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_text` varchar(255) NOT NULL,
  PRIMARY KEY (`keyword_id`),
  UNIQUE KEY `keyword_text` (`keyword_text`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 8. Create Products Table (Main table with foreign keys)
CREATE TABLE `Products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pro_id` varchar(255) DEFAULT NULL,
  `flipkart_serial_number` varchar(255) DEFAULT NULL,
  `catalog_qc_status` varchar(255) DEFAULT NULL,
  `qc_failed_reason` text DEFAULT NULL,
  `flipkart_product_link` text DEFAULT NULL,
  `product_data_status` varchar(255) DEFAULT NULL,
  `disapproval_reason` text DEFAULT NULL,
  `seller_sku_id` varchar(64) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model_number` varchar(255) DEFAULT NULL,
  `pack_of` int(11) DEFAULT NULL,
  `width_inch` decimal(10,2) DEFAULT NULL,
  `depth_inch` decimal(10,2) DEFAULT NULL,
  `main_image_url` text DEFAULT NULL,
  `other_image_url_1` text DEFAULT NULL,
  `other_image_url_2` text DEFAULT NULL,
  `other_image_url_3` text DEFAULT NULL,
  `other_image_url_4` text DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `brand_color` varchar(255) DEFAULT NULL,
  `theme` text DEFAULT NULL,
  `design` text DEFAULT NULL,
  `finish` text DEFAULT NULL,
  `stand_included` tinyint(1) DEFAULT NULL,
  `embossment` text DEFAULT NULL,
  `regional_speciality_id` int(11) DEFAULT NULL,
  `height_inch` decimal(10,2) DEFAULT NULL,
  `art_form_type_id` int(11) DEFAULT NULL,
  `diameter_inch` decimal(10,2) DEFAULT NULL,
  `weight_g` int(11) DEFAULT NULL,
  `other_dimensions` text DEFAULT NULL,
  `dishwasher_safe` tinyint(1) DEFAULT NULL,
  `microwave_safe` tinyint(1) DEFAULT NULL,
  `cold_proof` tinyint(1) DEFAULT NULL,
  `other_features` text DEFAULT NULL,
  `domestic_warranty` int(11) DEFAULT NULL,
  `domestic_warranty_unit` varchar(50) DEFAULT NULL,
  `international_warranty` int(11) DEFAULT NULL,
  `international_warranty_unit` varchar(50) DEFAULT NULL,
  `warranty_summary` text DEFAULT NULL,
  `warranty_service_type` text DEFAULT NULL,
  `covered_in_warranty` text DEFAULT NULL,
  `not_covered_in_warranty` text DEFAULT NULL,
  `ean_upc` varchar(255) DEFAULT NULL,
  `gift_pack` tinyint(1) DEFAULT NULL,
  `supplier_image` text DEFAULT NULL,
  `is_fragile` tinyint(1) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pro_id` (`pro_id`),
  KEY `regional_speciality_id` (`regional_speciality_id`),
  KEY `art_form_type_id` (`art_form_type_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`regional_speciality_id`) REFERENCES `RegionalSpecialities` (`regional_speciality_id`),
  CONSTRAINT `Products_ibfk_2` FOREIGN KEY (`art_form_type_id`) REFERENCES `ArtFormTypes` (`art_form_type_id`),
  CONSTRAINT `Products_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 9. Create Junction Tables

-- Product Colors Junction Table
CREATE TABLE `Product_Colors` (
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`color_id`),
  KEY `color_id` (`color_id`),
  CONSTRAINT `Product_Colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_Colors_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `Colors` (`color_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Product Materials Junction Table
CREATE TABLE `Product_Materials` (
  `product_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `Product_Materials_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_Materials_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `Materials` (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Product Key Features Junction Table
CREATE TABLE `Product_KeyFeatures` (
  `product_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`feature_id`),
  KEY `feature_id` (`feature_id`),
  CONSTRAINT `Product_KeyFeatures_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_KeyFeatures_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `KeyFeatures` (`feature_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Product Search Keywords Junction Table
CREATE TABLE `Product_SearchKeywords` (
  `product_id` int(11) NOT NULL,
  `keyword_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`keyword_id`),
  KEY `keyword_id` (`keyword_id`),
  CONSTRAINT `Product_SearchKeywords_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_SearchKeywords_ibfk_2` FOREIGN KEY (`keyword_id`) REFERENCES `SearchKeywords` (`keyword_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- 9. Create Product Prices Table
CREATE TABLE `product_prices` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `product_id` int(11) NOT NULL,
    `original_price` decimal(10,2) NOT NULL COMMENT 'Original/MRP price of the product',
    `cut_price` decimal(10,2) DEFAULT NULL COMMENT 'Discounted/Sale price of the product',
    `is_active` tinyint(1) DEFAULT 1 COMMENT 'Whether this price is currently active',
    `effective_from` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'When this price becomes effective',
    `effective_until` datetime DEFAULT NULL COMMENT 'When this price expires (NULL = no expiry)',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_product_prices_product_id` (`product_id`),
    KEY `idx_product_prices_active` (`is_active`),
    KEY `idx_product_prices_effective` (`effective_from`,`effective_until`),
    CONSTRAINT `fk_product_prices_product_id` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores pricing information for products with original and discounted prices';

-- 10. Create Triggers

-- Auto-generate pro_id trigger for Products table
DELIMITER $$
CREATE TRIGGER `before_product_insert` BEFORE INSERT ON `Products` FOR EACH ROW BEGIN
    DECLARE next_id INT;
    SELECT AUTO_INCREMENT INTO next_id
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Products';
    SET NEW.pro_id = CONCAT('pro', next_id);
END
$$
DELIMITER ;

-- Restore character set settings
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

COMMIT;