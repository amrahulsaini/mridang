'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '../types'

const ProductCard: React.FC<Product> = ({
  name,
  cut_price,
  original_price,
  main_image_url,
  image_url
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Use main_image_url first, then fallback to image_url, then placeholder
  const productImage = main_image_url || image_url || '/file.svg'

  // Determine pricing
  const currentPrice = cut_price || original_price
  const hasDiscount = cut_price && original_price && cut_price < original_price

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="product-image">
        <Image
          src={productImage}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Sale Badge */}
        {hasDiscount && (
          <div className="sale-badge">
            SALE
          </div>
        )}

        {/* Hover Actions */}
        <motion.div 
          className="product-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button className="action-btn">
            <Heart className="w-5 h-5" />
          </button>
          
          <button className="action-btn">
            <Eye className="w-5 h-5" />
          </button>
          
          <button className="action-btn">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-3 text-gray-900">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {currentPrice && (
            <span className="text-xl font-bold text-gray-900">
              ₹{currentPrice.toLocaleString()}
            </span>
          )}
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ₹{original_price?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="btn btn-primary w-full">
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard