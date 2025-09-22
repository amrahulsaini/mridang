import Header from './components/Header';
// import VideoBanner from './components/VideoBanner'; // No longer needed
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
      {/* Simple USP strip for trust and SEO-friendly content */}
      <div className="usp-strip">
        <div className="container">
          <ul className="usp-list">
            <li>Handcrafted in India</li>
            <li>Premium Quality Materials</li>
            <li>Custom Designs Available</li>
            <li>Secure & Fast Shipping</li>
          </ul>
        </div>
      </div>
      
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
