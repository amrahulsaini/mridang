import Header from './components/Header';
import ProductGridWrapper from './components/ProductGridWrapper';
import FAQAndReviews from './components/FAQAndReviews';
import Footer from './components/Footer';
import { getProductsGroupedByCategory } from './lib/database';

// Force dynamic rendering OR use revalidation
// Option 1: Force dynamic (always fresh data)
export const dynamic = 'force-dynamic'

// Option 2: Revalidate every 30 seconds (good for performance but slight delay)
// export const revalidate = 30

export default async function Home() {
  // Fetch all categories that have products from database
  const categoriesWithProducts = await getProductsGroupedByCategory();

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <ProductGridWrapper categoriesWithProducts={categoriesWithProducts} />
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
