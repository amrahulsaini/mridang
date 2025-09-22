-- Materials Table Schema
CREATE TABLE `Materials` (
  `material_id` int(11) NOT NULL AUTO_INCREMENT,
  `material_name` varchar(255) NOT NULL,
  PRIMARY KEY (`material_id`),
  UNIQUE KEY `material_name` (`material_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;