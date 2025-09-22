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
        p.name,
        p.description,
        p.price,
        p.category_id,
        c.name as category_name,
        p.stock_quantity,
        p.image_url,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.created_at DESC
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
        p.name,
        p.description,
        p.price,
        p.category_id,
        c.name as category_name,
        p.stock_quantity,
        p.image_url,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1 AND c.name = ?
      ORDER BY p.created_at DESC
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
      SELECT id, name, description, is_active
      FROM categories
      WHERE is_active = 1
      ORDER BY name
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