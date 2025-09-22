-- Additional Indexes and Constraints for Performance Optimization

-- Add indexes for frequently queried columns
CREATE INDEX idx_products_brand ON Products(brand);
CREATE INDEX idx_products_category ON Products(category_id);
CREATE INDEX idx_products_price_range ON Products(weight_g); -- Assuming weight correlates with price
CREATE INDEX idx_products_dimensions ON Products(width_inch, height_inch, depth_inch);
CREATE INDEX idx_products_fragile ON Products(is_fragile);
CREATE INDEX idx_products_gift_pack ON Products(gift_pack);
CREATE INDEX idx_products_warranty ON Products(domestic_warranty);

-- Search optimization indexes
CREATE FULLTEXT INDEX ft_products_description ON Products(description);
CREATE FULLTEXT INDEX ft_products_model_name ON Products(model_name);
CREATE FULLTEXT INDEX ft_products_theme ON Products(theme);
CREATE FULLTEXT INDEX ft_search_keywords ON SearchKeywords(keyword_text);
CREATE FULLTEXT INDEX ft_key_features ON KeyFeatures(feature_text);

-- Composite indexes for common query patterns
CREATE INDEX idx_product_category_brand ON Products(category_id, brand);
CREATE INDEX idx_product_dimensions_category ON Products(category_id, width_inch, height_inch);
CREATE INDEX idx_product_features_category ON Products(category_id, is_fragile, gift_pack);

-- Junction table optimization indexes
CREATE INDEX idx_product_colors_color ON Product_Colors(color_id);
CREATE INDEX idx_product_materials_material ON Product_Materials(material_id);
CREATE INDEX idx_product_features_feature ON Product_KeyFeatures(feature_id);
CREATE INDEX idx_product_keywords_keyword ON Product_SearchKeywords(keyword_id);

-- Additional constraints for data integrity
ALTER TABLE Products 
ADD CONSTRAINT chk_width_positive CHECK (width_inch > 0 OR width_inch IS NULL),
ADD CONSTRAINT chk_height_positive CHECK (height_inch > 0 OR height_inch IS NULL),
ADD CONSTRAINT chk_depth_positive CHECK (depth_inch > 0 OR depth_inch IS NULL),
ADD CONSTRAINT chk_diameter_positive CHECK (diameter_inch > 0 OR diameter_inch IS NULL),
ADD CONSTRAINT chk_weight_positive CHECK (weight_g > 0 OR weight_g IS NULL),
ADD CONSTRAINT chk_pack_positive CHECK (pack_of > 0 OR pack_of IS NULL),
ADD CONSTRAINT chk_domestic_warranty CHECK (domestic_warranty >= 0 OR domestic_warranty IS NULL),
ADD CONSTRAINT chk_international_warranty CHECK (international_warranty >= 0 OR international_warranty IS NULL);

-- URL validation constraints (basic check for http/https)
ALTER TABLE Products 
ADD CONSTRAINT chk_main_image_url CHECK (main_image_url IS NULL OR main_image_url LIKE 'http%'),
ADD CONSTRAINT chk_other_image_url_1 CHECK (other_image_url_1 IS NULL OR other_image_url_1 LIKE 'http%'),
ADD CONSTRAINT chk_other_image_url_2 CHECK (other_image_url_2 IS NULL OR other_image_url_2 LIKE 'http%'),
ADD CONSTRAINT chk_other_image_url_3 CHECK (other_image_url_3 IS NULL OR other_image_url_3 LIKE 'http%'),
ADD CONSTRAINT chk_other_image_url_4 CHECK (other_image_url_4 IS NULL OR other_image_url_4 LIKE 'http%'),
ADD CONSTRAINT chk_video_url CHECK (video_url IS NULL OR video_url LIKE 'http%'),
ADD CONSTRAINT chk_flipkart_link CHECK (flipkart_product_link IS NULL OR flipkart_product_link LIKE 'http%'),
ADD CONSTRAINT chk_supplier_image CHECK (supplier_image IS NULL OR supplier_image LIKE 'http%');

-- Ensure non-empty strings for required text fields
ALTER TABLE Categories 
ADD CONSTRAINT chk_category_name_not_empty CHECK (TRIM(category_name) != '');

ALTER TABLE Colors 
ADD CONSTRAINT chk_color_name_not_empty CHECK (TRIM(color_name) != '');

ALTER TABLE Materials 
ADD CONSTRAINT chk_material_name_not_empty CHECK (TRIM(material_name) != '');

ALTER TABLE ArtFormTypes 
ADD CONSTRAINT chk_art_form_name_not_empty CHECK (TRIM(art_form_type_name) != '');

ALTER TABLE RegionalSpecialities 
ADD CONSTRAINT chk_regional_name_not_empty CHECK (TRIM(regional_speciality_name) != '');

ALTER TABLE KeyFeatures 
ADD CONSTRAINT chk_feature_text_not_empty CHECK (TRIM(feature_text) != '');

ALTER TABLE SearchKeywords 
ADD CONSTRAINT chk_keyword_text_not_empty CHECK (TRIM(keyword_text) != '');