-- Regional Specialities Table Schema
CREATE TABLE `RegionalSpecialities` (
  `regional_speciality_id` int(11) NOT NULL AUTO_INCREMENT,
  `regional_speciality_name` varchar(255) NOT NULL,
  PRIMARY KEY (`regional_speciality_id`),
  UNIQUE KEY `regional_speciality_name` (`regional_speciality_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;