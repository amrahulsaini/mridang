-- Add cashfree_order_id column to checkout_orders table
-- This allows us to track the Cashfree payment gateway order ID for pending orders

ALTER TABLE checkout_orders
ADD COLUMN cashfree_order_id VARCHAR(100) NULL COMMENT 'Cashfree payment gateway order ID' AFTER notes;

-- Add index for faster lookups
CREATE INDEX idx_cashfree_order_id ON checkout_orders(cashfree_order_id);

-- Update the status enum to include 'failed' status
ALTER TABLE checkout_orders
MODIFY COLUMN status ENUM('pending', 'verified', 'processing', 'completed', 'cancelled', 'failed') DEFAULT 'pending';
