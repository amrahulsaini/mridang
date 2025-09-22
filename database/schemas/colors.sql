-- Colors Table Schema
CREATE TABLE `Colors` (
  `color_id` int(11) NOT NULL AUTO_INCREMENT,
  `color_name` varchar(255) NOT NULL,
  PRIMARY KEY (`color_id`),
  UNIQUE KEY `color_name` (`color_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;