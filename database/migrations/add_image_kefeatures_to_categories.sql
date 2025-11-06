-- Migration: Add image and kefeatures columns to Categories table
-- Date: 2025-11-06

USE mrid_mridang;

-- Add image column for category images
ALTER TABLE `Categories`
ADD COLUMN `image` TEXT DEFAULT NULL AFTER `category_name`;

-- Add kefeatures column for category key features
ALTER TABLE `Categories`
ADD COLUMN `kefeatures` TEXT DEFAULT NULL AFTER `image`;

-- Verify the changes
DESCRIBE Categories;
