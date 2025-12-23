'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Handcrafted platters that look premium in every photo
          </h1>
          <p className="hero-subtitle">
            Ring trays, haldi & mehendi platters, and custom designs — made to match your theme.
          </p>
          <div className="flex items-center justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-primary">Shop all products</Link>
            <Link href="/#categories" className="btn btn-secondary">Browse categories</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
