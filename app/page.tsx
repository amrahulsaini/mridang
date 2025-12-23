import TopBanner from './components/TopBanner';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductMarquee from './components/ProductMarquee';
import ProductGridWrapper from './components/ProductGridWrapper';
import InstagramReels from './components/InstagramReels';
import FAQAndReviews from './components/FAQAndReviews';
import Footer from './components/Footer';
import { getProductsGroupedByCategory, getInstagramReels } from './lib/database';

// Force dynamic rendering OR use revalidation
// Option 1: Force dynamic (always fresh data)
export const dynamic = 'force-dynamic'

// Option 2: Revalidate every 30 seconds (good for performance but slight delay)
// export const revalidate = 30

export default async function Home() {
  // Fetch all categories that have products from database
  const categoriesWithProducts = await getProductsGroupedByCategory();
  
  // Fetch Instagram reels
  const instagramReels = await getInstagramReels();

  return (
    <div className="min-h-screen bg-cream">
      <TopBanner />
      <Header />
      <HeroSection />
      <ProductMarquee />

      <div id="categories">
        <ProductGridWrapper categoriesWithProducts={categoriesWithProducts} />
      </div>
      
      <InstagramReels reels={instagramReels} />
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
