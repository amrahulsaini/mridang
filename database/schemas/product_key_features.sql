-- Product Key Features Junction Table Schema
CREATE TABLE `Product_KeyFeatures` (
  `product_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`feature_id`),
  KEY `feature_id` (`feature_id`),
  CONSTRAINT `Product_KeyFeatures_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_KeyFeatures_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `KeyFeatures` (`feature_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;