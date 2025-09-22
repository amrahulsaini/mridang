'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
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
  const isProblematicSrc = typeof productImage === 'string' && productImage.includes('url=')

  // Determine pricing strictly as requested: show cut and original only
  const hasDiscount = !!(cut_price && original_price && cut_price < original_price)

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
        {isProblematicSrc ? (
          <img
            src={productImage}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        ) : (
          <Image
            src={productImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Price: show cut and original prices */}
        <div className="flex items-center gap-3 mb-4 justify-center">
          {cut_price && (
            <span className="text-xl font-bold text-gray-900">
              ₹{cut_price.toLocaleString()}
            </span>
          )}
          {original_price && (
            <span className={`text-sm text-gray-500 ${cut_price ? 'line-through' : ''}`}>
              ₹{original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="btn btn-primary w-full inline-flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  )
}

export default ProductCard