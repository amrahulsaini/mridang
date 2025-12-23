import TopBanner from '../components/TopBanner'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ShopClient from './shop-client'

export const dynamic = 'force-dynamic'

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-cream">
      <TopBanner />
      <Header />
      <ShopClient />
      <Footer />
    </div>
  )
}
