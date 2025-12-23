'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import styles from './CategorySection.module.css'
import { Product } from '../types'

interface CategorySectionProps {
  title: string
  products: Product[]
  onInfoClick?: (product: Product) => void
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products, onInfoClick }) => {
  const previewProducts = products.slice(0, 4)
  const categoryHref = `/category/${encodeURIComponent(title)}`

  return (
    <section className={styles['category-section']}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div 
          className={styles['section-header'] + ' centered'}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles['category-title-wrapper']}>
            <h2 className={styles['category-title']}>{title}</h2>
            <div className={styles['curved-underline']}>
              <svg width="120" height="12" viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C20 2 40 2 60 6C80 10 100 10 118 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#800020" stopOpacity="0.6"/>
                    <stop offset="50%" stopColor="#a0002a" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#c00030" stopOpacity="0.6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Products Grid (4 items) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className={styles['product-grid']}>
            {previewProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
              >
                <ProductCard {...product} onInfoClick={onInfoClick} />
              </motion.div>
            ))}
          </div>

          <div className={styles['view-all-row']}>
            <Link href={categoryHref} className="btn btn-primary">
              View all {title}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CategorySection