-- Product Colors Junction Table Schema
CREATE TABLE `Product_Colors` (
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`color_id`),
  KEY `color_id` (`color_id`),
  CONSTRAINT `Product_Colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_Colors_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `Colors` (`color_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;