import Header from './components/Header';
import VideoBanner from './components/VideoBanner';
import CategorySection from './components/CategorySection';
import FAQAndReviews from './components/FAQAndReviews';
import Footer from './components/Footer';
import { getProductsByCategory } from './lib/database';

export default async function Home() {
  // Fetch real products from database
  const ringPlatters = await getProductsByCategory('Ring Platters');
  const haldiPlatters = await getProductsByCategory('Haldi Platters');
  const mehendiPlatters = await getProductsByCategory('Mehendi Platters');

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <VideoBanner />
      
      <div className="section-cream">
        <CategorySection 
          title="Ring Platters"
          products={ringPlatters}
        />
      </div>
      
      <div className="bg-white">
        <CategorySection 
          title="Haldi Platters"
          products={haldiPlatters}
        />
      </div>
      
      <div className="section-cream">
        <CategorySection 
          title="Mehendi Platters"
          products={mehendiPlatters}
        />
      </div>
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
