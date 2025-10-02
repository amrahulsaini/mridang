import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory } from '@/app/lib/database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let products;

    if (category) {
      // Fetch products by category
      products = await getProductsByCategory(category);
    } else {
      // Fetch all products
      products = await getAllProducts();
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        products: []
      },
      { status: 500 }
    );
  }
}
