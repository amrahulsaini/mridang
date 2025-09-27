-- Checkout Orders Table Schema
-- This table stores all checkout information including user details, address, and verification status

CREATE TABLE IF NOT EXISTS checkout_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique order identifier (e.g., ORD-20250927-001)',

    -- User Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL COMMENT 'Phone number with country code',

    -- Address Information
    address TEXT NOT NULL COMMENT 'Full address/street address',
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',

    -- Product Information (JSON format to store cart items)
    products JSON NOT NULL COMMENT 'Cart items with product details, quantities, and prices',

    -- Pricing Information
    subtotal DECIMAL(10,2) NOT NULL COMMENT 'Subtotal before shipping',
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,

    -- Verification Status
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_otp VARCHAR(10) NULL COMMENT 'Last email OTP sent (for debugging)',
    phone_otp VARCHAR(10) NULL COMMENT 'Last phone OTP sent (for debugging)',

    -- Order Status
    status ENUM('pending', 'verified', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL COMMENT 'When email/phone verification completed',
    completed_at TIMESTAMP NULL COMMENT 'When order was completed',

    -- Additional Metadata
    ip_address VARCHAR(45) NULL COMMENT 'User IP address',
    user_agent TEXT NULL COMMENT 'Browser user agent',
    notes TEXT NULL COMMENT 'Additional order notes',

    -- Indexes for performance
    INDEX idx_order_id (order_id),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_email_verified (email_verified),
    INDEX idx_phone_verified (phone_verified)
);

-- Example of how to insert a checkout order
/*
INSERT INTO checkout_orders (
    order_id, first_name, last_name, email, phone,
    address, city, state, pincode, country,
    products, subtotal, total_amount,
    email_verified, phone_verified
) VALUES (
    'ORD-20250927-001',
    'John', 'Doe',
    'john.doe@example.com', '+919876543210',
    '123 Main Street, Apartment 4B',
    'Mumbai', 'Maharashtra', '400001', 'India',
    '[{"id": "PROD-001", "name": "Mridang Drum", "price": 15000.00, "quantity": 1}]',
    15000.00, 15000.00,
    true, false
);
*/

-- Optional: Create a table for OTP logs (for auditing/debugging)
CREATE TABLE IF NOT EXISTS otp_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NULL COMMENT 'Reference to checkout_orders.order_id',
    otp_type ENUM('email', 'phone') NOT NULL,
    recipient VARCHAR(255) NOT NULL COMMENT 'Email or phone number',
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'verification',
    status ENUM('sent', 'verified', 'expired', 'failed') DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    error_message TEXT NULL,

    INDEX idx_order_id (order_id),
    INDEX idx_recipient (recipient),
    INDEX idx_otp_type (otp_type),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at)
);