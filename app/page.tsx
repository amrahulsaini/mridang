import TopBanner from './components/TopBanner';
import Header from './components/Header';
import BannerShowcase from './components/BannerShowcase';
import ProductGridWrapper from './components/ProductGridWrapper';
import InstagramReels from './components/InstagramReels';
import FAQAndReviews from './components/FAQAndReviews';
import Footer from './components/Footer';
import { getProductsGroupedByCategory, getInstagramReels } from './lib/database';
import { Suspense } from 'react';

// Optimize with revalidation for better performance
export const revalidate = 60 // Revalidate every 60 seconds

// Loading components for better UX
function ProductGridSkeleton() {
  return (
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card" style={{
            height: '400px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s ease-in-out infinite',
            borderRadius: '16px'
          }}></div>
        ))}
      </div>
    </div>
  );
}

function InstagramSkeleton() {
  return (
    <div className="container py-12">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: '300px',
            height: '400px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'loading 1.5s ease-in-out infinite',
            borderRadius: '16px'
          }}></div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  // Fetch data with parallel requests for better performance
  const [categoriesWithProducts, instagramReels] = await Promise.all([
    getProductsGroupedByCategory(),
    getInstagramReels()
  ]);

  return (
    <div className="min-h-screen modern-layout">
      <TopBanner />
      <Header />
      <BannerShowcase />

      {/* Categories with suspense boundary */}
      <div id="categories" className="section-spacing">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGridWrapper categoriesWithProducts={categoriesWithProducts} />
        </Suspense>
      </div>
      
      {/* Instagram section */}
      <div className="section-spacing instagram-section">
        <Suspense fallback={<InstagramSkeleton />}>
          <InstagramReels reels={instagramReels} />
        </Suspense>
      </div>
      
      {/* FAQ and Footer */}
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
