import mysql from 'mysql2/promise';
import { Product } from '../types';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'char_mridang',
  password: process.env.DB_PASS || 'mridang',
  database: process.env.DB_NAME || 'char_mridang',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Category interface
export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

// Fetch all products with category information
export async function getAllProducts(): Promise<Product[]> {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.id,
        p.model_name as name,
        p.description,
        COALESCE(pp.cut_price, pp.original_price) as price,
        pp.cut_price as cut_price,
        pp.original_price as original_price,
        p.category_id,
        c.category_name as category_name,
        1 as stock_quantity,
        p.main_image_url as main_image_url,
        p.main_image_url as image_url,
        1 as is_active,
        NOW() as created_at,
        NOW() as updated_at
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN product_prices pp ON p.id = pp.product_id AND pp.is_active = 1
      ORDER BY p.id DESC
    `);
    
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category
export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.id,
        p.model_name as name,
        p.description,
        COALESCE(pp.cut_price, pp.original_price) as price,
        pp.cut_price as cut_price,
        pp.original_price as original_price,
        p.category_id,
        c.category_name as category_name,
        1 as stock_quantity,
        p.main_image_url as main_image_url,
        p.main_image_url as image_url,
        1 as is_active,
        NOW() as created_at,
        NOW() as updated_at
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN product_prices pp ON p.id = pp.product_id AND pp.is_active = 1
      WHERE c.category_name = ?
      ORDER BY p.id DESC
    `, [categoryName]);
    
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Fetch all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const [rows] = await pool.execute(`
      SELECT category_id as id, category_name as name, 1 as is_active
      FROM Categories
      ORDER BY category_name
    `);
    
    return rows as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get products grouped by category
export async function getProductsGroupedByCategory() {
  try {
    const categories = await getAllCategories();
    const result: { [key: string]: Product[] } = {};
    
    for (const category of categories) {
      const products = await getProductsByCategory(category.name);
      result[category.name.toLowerCase().replace(/\s+/g, '')] = products;
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching grouped products:', error);
    return {};
  }
}

export default pool;