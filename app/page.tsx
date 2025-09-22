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
    <div className="min-h-screen">
      <Header />
      <VideoBanner />
      
      <CategorySection 
        title="Ring Platters"
        products={ringPlatters}
      />
      
      <CategorySection 
        title="Haldi Platters"
        products={haldiPlatters}
      />
      
      <CategorySection 
        title="Mehendi Platters"
        products={mehendiPlatters}
      />
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
