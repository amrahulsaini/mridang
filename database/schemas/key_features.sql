-- Key Features Table Schema
CREATE TABLE `KeyFeatures` (
  `feature_id` int(11) NOT NULL AUTO_INCREMENT,
  `feature_text` text NOT NULL,
  PRIMARY KEY (`feature_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;