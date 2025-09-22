-- Product Search Keywords Junction Table Schema
CREATE TABLE `Product_SearchKeywords` (
  `product_id` int(11) NOT NULL,
  `keyword_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`keyword_id`),
  KEY `keyword_id` (`keyword_id`),
  CONSTRAINT `Product_SearchKeywords_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`),
  CONSTRAINT `Product_SearchKeywords_ibfk_2` FOREIGN KEY (`keyword_id`) REFERENCES `SearchKeywords` (`keyword_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;