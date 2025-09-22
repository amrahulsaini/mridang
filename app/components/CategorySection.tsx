'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import ProductCard from '../components/ProductCard'
import { Product } from '../types'

interface CategorySectionProps {
  title: string
  products: Product[]
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Width of one product card + gap
      const currentScroll = scrollRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="category-section">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2>{title}</h2>
            {/* Subtitle removed to keep product focus as per request */}
          </div>
        </motion.div>

        {/* Products Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Side Arrows */}
          <motion.button
            onClick={() => scroll('left')}
            className="carousel-arrow left"
            aria-label="Scroll left"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={22} />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            className="carousel-arrow right"
            aria-label="Scroll right"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={22} />
          </motion.button>

          <div
            ref={scrollRef}
            className="product-grid"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-card"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* View All button removed for minimal product-focused design */}
      </div>
    </section>
  )
}

export default CategorySection