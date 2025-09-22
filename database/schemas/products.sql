-- Products Table Schema
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

-- Auto-generate pro_id trigger
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