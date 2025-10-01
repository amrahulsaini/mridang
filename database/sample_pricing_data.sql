-- Sample Pricing Data for Testing
-- Run this to add pricing data to your products

-- Insert sample pricing for products (adjust product IDs as needed)
-- Replace the product_id values with actual product IDs from your Products table

INSERT INTO product_prices (product_id, original_price, cut_price, is_active) VALUES
-- Example pricing data (replace with your actual product IDs)
(1, 3999.00, 2999.00, 1),   -- Product ID 1: ₹3,999 -> ₹2,999 (25% off)
(2, 5999.00, 4499.00, 1),   -- Product ID 2: ₹5,999 -> ₹4,499 (25% off)
(3, 7999.00, 5999.00, 1),   -- Product ID 3: ₹7,999 -> ₹5,999 (25% off)
(4, 2999.00, NULL, 1),      -- Product ID 4: ₹2,999 (no discount)
(5, 4999.00, 3999.00, 1)    -- Product ID 5: ₹4,999 -> ₹3,999 (20% off)
ON DUPLICATE KEY UPDATE
    original_price = VALUES(original_price),
    cut_price = VALUES(cut_price),
    is_active = VALUES(is_active),
    updated_at = CURRENT_TIMESTAMP;

-- To check what product IDs you have, run this query first:
-- SELECT id, pro_id, model_name FROM Products LIMIT 10;

-- Then update the INSERT statement above with your actual product IDs