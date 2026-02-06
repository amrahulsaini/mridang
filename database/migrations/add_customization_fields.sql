-- Migration: Add Customization Fields to checkout_orders table
-- Date: 2026-02-06
-- Description: Adds bride_name, groom_name, and engagement_date fields for order customization

-- Add customization fields to checkout_orders table
ALTER TABLE checkout_orders
ADD COLUMN bride_name VARCHAR(100) NULL COMMENT 'Bride name for customization (optional)',
ADD COLUMN groom_name VARCHAR(100) NULL COMMENT 'Groom name for customization (optional)',
ADD COLUMN engagement_date DATE NULL COMMENT 'Date of engagement for customization (optional)';

-- Add indexes for potential search/filter operations
CREATE INDEX idx_bride_name ON checkout_orders(bride_name);
CREATE INDEX idx_groom_name ON checkout_orders(groom_name);
CREATE INDEX idx_engagement_date ON checkout_orders(engagement_date);

-- Verify the changes
DESCRIBE checkout_orders;
