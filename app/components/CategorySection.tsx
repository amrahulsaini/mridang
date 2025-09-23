'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { Product } from '../types'

interface CategorySectionProps {
  title: string
  products: Product[]
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, products }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360
      const currentScroll = scrollRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }

  const updateEdges = () => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= maxScroll - 4)
  }

  useEffect(() => {
    updateEdges()
    const el = scrollRef.current
    if (!el) return
    const handler = () => updateEdges()
    el.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      el.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <section className="category-section">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="section-header centered"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="category-title-wrapper">
            <h2 className="category-title">{title}</h2>
            <div className="curved-underline">
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

        {/* Products Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.button
            onClick={() => scroll('left')}
            className="carousel-arrow left"
            aria-label="Scroll left"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={atStart}
          >
            <ChevronLeft size={32} />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            className="carousel-arrow right"
            aria-label="Scroll right"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={atEnd}
          >
            <ChevronRight size={32} />
          </motion.button>
          <div
            ref={scrollRef}
            className="product-grid"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
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