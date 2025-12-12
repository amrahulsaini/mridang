'use client'

import { motion } from 'framer-motion'
import { Truck, RotateCcw, Clock, Tag } from 'lucide-react'
import { useState, useEffect } from 'react'

const TopBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const announcements = [
    { icon: Truck, text: 'Free Shipping Above ₹499', color: '#059669' },
    { icon: RotateCcw, text: '7 Days Easy Return', color: '#2563eb' },
    { icon: Clock, text: 'Delivery in 7-10 Days', color: '#f59e0b' },
    { icon: Tag, text: 'Special Festival Offers Available', color: '#dc2626' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [announcements.length])

  return (
    <div className="top-banner">
      <div className="top-banner-content">
        {announcements.map((item, index) => (
          <motion.div
            key={index}
            className="banner-item"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              y: index === currentIndex ? 0 : -20,
              display: index === currentIndex ? 'flex' : 'none'
            }}
            transition={{ duration: 0.5 }}
          >
            <item.icon size={18} style={{ color: item.color, flexShrink: 0 }} />
            <span>{item.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TopBanner
