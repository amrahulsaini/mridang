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
      <VideoBanner />
      
      <section className="hero-content bg-white py-16">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Discover Handcrafted Mridang Platters</h1>
            <p className="text-lg text-gray-600 mb-8">Experience the rich tradition of Indian craftsmanship with our exquisite collection of mridang platters. Perfect for weddings, festivals, and special occasions, each piece is meticulously handcrafted using premium materials and traditional techniques.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Authentic Design</h3>
                <p className="text-gray-600">Inspired by centuries-old Indian artistry</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Made with the finest materials for lasting beauty</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Custom Options</h3>
                <p className="text-gray-600">Personalize your platter for unique occasions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
