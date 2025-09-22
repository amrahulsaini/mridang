-- Search Keywords Table Schema
CREATE TABLE `SearchKeywords` (
  `keyword_id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_text` varchar(255) NOT NULL,
  PRIMARY KEY (`keyword_id`),
  UNIQUE KEY `keyword_text` (`keyword_text`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;