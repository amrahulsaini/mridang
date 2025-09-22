-- Art Form Types Table Schema
CREATE TABLE `ArtFormTypes` (
  `art_form_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `art_form_type_name` varchar(255) NOT NULL,
  PRIMARY KEY (`art_form_type_id`),
  UNIQUE KEY `art_form_type_name` (`art_form_type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;