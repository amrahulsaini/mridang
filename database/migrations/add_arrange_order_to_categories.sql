-- Migration: Add arrange_order column to Categories table
-- Date: 2025-10-02

-- Add the arrange_order column
ALTER TABLE `Categories` 
ADD COLUMN `arrange_order` int(11) DEFAULT 0 AFTER `category_name`;

-- Assign a unique increasing order to ALL categories (fixes the common "all 0" case)
-- Uses alphabetical order by default; change ORDER BY if you prefer a different base ordering.
SET @row := 0;
UPDATE `Categories`
SET `arrange_order` = (@row := @row + 1)
ORDER BY `category_name` ASC, `category_id` ASC;

-- Enforce uniqueness so two categories can't share the same arrange_order
ALTER TABLE `Categories`
ADD UNIQUE KEY `uq_categories_arrange_order` (`arrange_order`);

-- Note: Update the arrange_order values above based on your actual categories
-- and the order you want them to appear in
