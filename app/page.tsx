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
        categoryId="ring-platters"
      />
      
      <CategorySection 
        title="Haldi Platters"
        products={haldiPlatters}
        categoryId="haldi-platters"
      />
      
      <CategorySection 
        title="Mehendi Platters"
        products={mehendiPlatters}
        categoryId="mehendi-platters"
      />
      
      <FAQAndReviews />
      <Footer />
    </div>
  );
}
