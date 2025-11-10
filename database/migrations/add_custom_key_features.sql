-- Add custom key features text field to Products table
-- This allows storing free-form key features text directly in the product

ALTER TABLE Products 
ADD COLUMN custom_key_features TEXT DEFAULT NULL COMMENT 'Free-form key features text entered by user';
