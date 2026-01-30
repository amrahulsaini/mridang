-- ================================================
-- QUICK SETUP: Run this SQL to enable pending orders
-- ================================================
-- This script adds support for tracking pending orders
-- Run this in your MySQL database before testing

USE char_mridang; -- Replace with your database name if different

-- Add cashfree_order_id column
ALTER TABLE checkout_orders
ADD COLUMN IF NOT EXISTS cashfree_order_id VARCHAR(100) NULL 
COMMENT 'Cashfree payment gateway order ID' 
AFTER notes;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cashfree_order_id ON checkout_orders(cashfree_order_id);

-- Update status enum to include 'failed'
ALTER TABLE checkout_orders
MODIFY COLUMN status ENUM('pending', 'verified', 'processing', 'completed', 'cancelled', 'failed') DEFAULT 'pending';

-- Verify the changes
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'checkout_orders'
AND COLUMN_NAME IN ('cashfree_order_id', 'status')
ORDER BY ORDINAL_POSITION;

SELECT '✅ Migration completed successfully!' AS status;
