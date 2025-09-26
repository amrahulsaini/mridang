// Shared types for the application
export interface Product {
  id: number;
  pro_id?: string;          // Added for product ID from database
  name: string;
  description?: string;
  price: number;
  cut_price?: number;        // Added for discounted price
  original_price?: number;   // Added for original price before discount
  category_id: number;
  category_name?: string;
  stock_quantity: number;
  main_image_url?: string;  // Updated to match database schema
  image_url?: string;       // Keep for backward compatibility
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}