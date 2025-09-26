import Header from './components/Header';
import ProductGridWrapper from './components/ProductGridWrapper';
import FAQAndReviews from './components/FAQAndReviews';
import Footer from './components/Footer';
import { getProductsGroupedByCategory } from './lib/database';

export default async function Home() {
  // Fetch all categories that have products from database
  const categoriesWithProducts = await getProductsGroupedByCategory();

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      {/* Simple Video Player */}
      <div className="simple-video-container">
        <video 
          className="simple-video"
          src="/banner.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
        />
        <div className="simple-video-overlay"></div>
        
      </div>
      
      <ProductGridWrapper categoriesWithProducts={categoriesWithProducts} />
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
