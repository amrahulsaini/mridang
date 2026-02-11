import { Suspense } from 'react'
import TopBanner from '@/app/components/TopBanner'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import CategoryContent from '@/app/category/[name]/CategoryContent'
import styles from '../Category.module.css'

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  return (
    <div className={styles.categoryPage}>
      <TopBanner />
      <Header />
      <Suspense fallback={
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.dotSpinner}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
            <p className={styles.loadingText}>Loading category...</p>
          </div>
        </div>
      }>
        <CategoryContent categoryName={decodeURIComponent(name)} />
      </Suspense>
      <Footer />
    </div>
  )
}
