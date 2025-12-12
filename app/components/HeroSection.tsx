'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react'

const HeroSection = () => {
  const features = [
    { icon: ShoppingBag, text: 'Premium Quality', color: '#800020' },
    { icon: Truck, text: 'Fast Delivery', color: '#059669' },
    { icon: Shield, text: 'Secure Payments', color: '#2563eb' },
    { icon: Star, text: 'Handcrafted', color: '#f59e0b' }
  ]

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
            Welcome to <span className="hero-brand">Mridang</span>
          </h1>
          <p className="hero-subtitle">
            Premium Wedding & Ceremonial Platters - Handcrafted with Tradition
          </p>
          <div className="hero-features">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="hero-feature"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              >
                <feature.icon 
                  size={24} 
                  style={{ color: feature.color, flexShrink: 0 }} 
                />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
