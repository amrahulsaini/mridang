-- Product Prices Table Schema
-- This table stores pricing information for products
-- Created: September 22, 2025

CREATE TABLE IF NOT EXISTS product_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL COMMENT 'Original/MRP price of the product',
    cut_price DECIMAL(10, 2) DEFAULT NULL COMMENT 'Discounted/Sale price of the product',
    is_active TINYINT(1) DEFAULT 1 COMMENT 'Whether this price is currently active',
    effective_from DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'When this price becomes effective',
    effective_until DATETIME DEFAULT NULL COMMENT 'When this price expires (NULL = no expiry)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_product_prices_product_id (product_id),
    INDEX idx_product_prices_active (is_active),
    INDEX idx_product_prices_effective (effective_from, effective_until),
    
    -- Foreign key constraint
    CONSTRAINT fk_product_prices_product_id 
        FOREIGN KEY (product_id) REFERENCES Products(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Stores pricing information for products with original and discounted prices';