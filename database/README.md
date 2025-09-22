# Mridang Database Schema Files

This directory contains all SQL schema files for the Mridang e-commerce database.

## Files Structure

### Individual Table Schemas
- `categories.sql` - Categories table schema
- `colors.sql` - Colors table schema  
- `materials.sql` - Materials table schema
- `art_form_types.sql` - Art Form Types table schema
- `regional_specialities.sql` - Regional Specialities table schema
- `key_features.sql` - Key Features table schema
- `search_keywords.sql` - Search Keywords table schema
- `products.sql` - Main Products table schema with foreign keys and trigger
- `product_prices.sql` - Product pricing table with original and cut prices

### Junction Table Schemas
- `product_colors.sql` - Product-Colors many-to-many relationship
- `product_materials.sql` - Product-Materials many-to-many relationship
- `product_key_features.sql` - Product-KeyFeatures many-to-many relationship
- `product_search_keywords.sql` - Product-SearchKeywords many-to-many relationship

### Complete Setup Files
- `setup_database.sql` - Complete database setup script (run this to create entire schema)
- `indexes_constraints.sql` - Performance indexes and data integrity constraints

## Database Overview

This is a comprehensive e-commerce database for handcrafted decorative products, specifically focusing on wedding and engagement accessories like ring platters, haldi platters, and ceremonial items.

### Key Features:
- **Multi-attribute Products**: Products can have multiple colors, materials, features, and keywords
- **Categorization**: Products organized by categories (Ring Platters, Haldi Platters, etc.)
- **Rich Metadata**: Detailed product information including dimensions, materials, art forms
- **E-commerce Integration**: Flipkart marketplace integration fields
- **Search Optimization**: Full-text search capabilities on descriptions and keywords
- **Regional Specialties**: Support for Indian regional art forms and specialties

### Usage:

To set up the complete database:
```sql
source setup_database.sql
```

To add performance indexes:
```sql
source indexes_constraints.sql
```

### Table Relationships:

```
Categories (1) -----> (M) Products
RegionalSpecialities (1) -----> (M) Products  
ArtFormTypes (1) -----> (M) Products

Products (M) <-----> (M) Colors (via Product_Colors)
Products (M) <-----> (M) Materials (via Product_Materials)
Products (M) <-----> (M) KeyFeatures (via Product_KeyFeatures)
Products (M) <-----> (M) SearchKeywords (via Product_SearchKeywords)
```