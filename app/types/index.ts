// Shared types for the application
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  category_name?: string;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}