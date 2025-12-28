-- =====================================================
-- IMAGE UPLOAD SETUP - SQL QUERIES
-- =====================================================
-- Run these queries if you need to make any changes to your database schema
-- for the image upload functionality. However, the existing schema already
-- supports storing image URLs (both external URLs and local paths).

-- 1. VERIFY EXISTING SCHEMA (Optional - just to check)
-- =====================================================
-- Check if the Products table has the required image columns
DESCRIBE Products;

-- The following columns should already exist:
-- - main_image_url (TEXT)
-- - other_image_url_1 (TEXT)
-- - other_image_url_2 (TEXT)
-- - other_image_url_3 (TEXT)
-- - other_image_url_4 (TEXT)
-- - supplier_image (TEXT)


-- 2. OPTIONAL: Remove URL constraint if it exists
-- =====================================================
-- If you have a constraint that validates URLs to start with 'http', 
-- you may want to remove it since local paths start with '/'

-- Check for existing constraints:
SELECT 
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE,
    TABLE_NAME
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'Products' 
AND CONSTRAINT_TYPE = 'CHECK';

-- If you see 'chk_main_image_url' or similar, drop it:
-- ALTER TABLE Products DROP CONSTRAINT chk_main_image_url;


-- 3. NO SCHEMA CHANGES NEEDED!
-- =====================================================
-- Your current database schema already supports the image upload functionality.
-- The TEXT columns can store:
-- - External URLs: https://example.com/image.jpg
-- - Dropbox URLs: https://www.dropbox.com/...
-- - Local paths: /uploads/products/product_123456789.jpg
--
-- No additional columns or changes are required.


-- 4. OPTIONAL: Add indexes for better performance (if not already exists)
-- =====================================================
-- Check existing indexes:
SHOW INDEXES FROM Products;

-- If you want to add an index on images for faster filtering:
-- CREATE INDEX idx_products_main_image ON Products(main_image_url(255));


-- 5. VERIFY DATA
-- =====================================================
-- Check existing products and their images:
SELECT 
    id,
    pro_id,
    model_name,
    main_image_url,
    other_image_url_1,
    other_image_url_2,
    other_image_url_3,
    other_image_url_4
FROM Products
ORDER BY id DESC
LIMIT 10;


-- =====================================================
-- SUMMARY
-- =====================================================
-- ✅ No SQL changes required for the image upload feature!
-- ✅ Your existing schema already supports storing both URLs and local paths
-- ✅ The image upload functionality will work with your current database
-- ✅ Images will be saved to: public/uploads/products/
-- ✅ Image paths will be stored as: /uploads/products/filename.jpg
