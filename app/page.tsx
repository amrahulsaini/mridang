import Header from './components/Header';
// import VideoBanner from './components/VideoBanner'; // No longer needed
import CategorySection from './components/CategorySection';
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
      
      {/* Dynamically render only categories that have products from database */}
      {categoriesWithProducts.map((categoryData, index) => (
        <div key={categoryData.category} className={index % 2 === 0 ? 'section-cream' : 'bg-white'}>
          <CategorySection 
            title={categoryData.category}
            products={categoryData.products}
          />
        </div>
      ))}
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
