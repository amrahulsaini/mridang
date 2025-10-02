-- Migration: Add arrange_order column to Categories table
-- Date: 2025-10-02

-- Add the arrange_order column
ALTER TABLE `Categories` 
ADD COLUMN `arrange_order` int(11) DEFAULT 0 AFTER `category_name`;

-- Update existing categories with default arrange_order values
-- You can manually update these values based on your preferred order
UPDATE `Categories` SET `arrange_order` = 1 WHERE `category_name` = 'Mridangam';
UPDATE `Categories` SET `arrange_order` = 2 WHERE `category_name` = 'Tabla';
UPDATE `Categories` SET `arrange_order` = 3 WHERE `category_name` = 'Ghatam';
UPDATE `Categories` SET `arrange_order` = 4 WHERE `category_name` = 'Dholak';
UPDATE `Categories` SET `arrange_order` = 5 WHERE `category_name` = 'Harmonium';

-- Note: Update the arrange_order values above based on your actual categories
-- and the order you want them to appear in
