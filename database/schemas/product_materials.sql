-- Product Materials Junction Table Schema
CREATE TABLE `Product_Materials` (
  `product_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`material_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `Product_Materials_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_Materials_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `Materials` (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;