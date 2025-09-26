import mysql from 'mysql2/promise';
import { Product } from '../types';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'mrid_mridang',
  password: process.env.DB_PASS || 'mridang',
  database: process.env.DB_NAME || 'mrid_mridang',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Generic query function
export async function query(sql: string, params: unknown[] = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

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
        p.pro_id,
        p.model_name as name,
        p.description,
        COALESCE(pp.cut_price, pp.original_price, 2999) as price,
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
      LEFT JOIN product_prices pp ON p.pro_id = pp.product_id AND pp.is_active = 1
      WHERE p.pro_id IS NOT NULL
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
        p.pro_id,
        p.model_name as name,
        p.description,
        COALESCE(pp.cut_price, pp.original_price, 2999) as price,
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
      LEFT JOIN product_prices pp ON p.pro_id = pp.product_id AND pp.is_active = 1
      WHERE c.category_name = ? AND p.pro_id IS NOT NULL
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

// Get categories that have products
export async function getCategoriesWithProducts() {
  try {
    const [rows] = await pool.execute(`
      SELECT DISTINCT
        c.category_id as id,
        c.category_name as name,
        COUNT(p.id) as product_count
      FROM Categories c
      INNER JOIN Products p ON c.category_id = p.category_id
      GROUP BY c.category_id, c.category_name
      HAVING COUNT(p.id) > 0
      ORDER BY c.category_name
    `);
    
    return rows as (Category & { product_count: number })[];
  } catch (error) {
    console.error('Error fetching categories with products:', error);
    return [];
  }
}

// Get products grouped by category (only categories with products)
export async function getProductsGroupedByCategory() {
  try {
    const categories = await getCategoriesWithProducts();
    const result: { category: string; products: Product[] }[] = [];
    
    for (const category of categories) {
      const products = await getProductsByCategory(category.name);
      if (products.length > 0) {
        result.push({
          category: category.name,
          products: products
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching grouped products:', error);
    return [];
  }
}

export default pool;