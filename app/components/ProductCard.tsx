'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '../types'

const ProductCard: React.FC<Product> = ({
  id,
  name,
  price,
  image_url,
  description,
  stock_quantity,
  category_name
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate if item is on sale (you can modify this logic based on your business rules)
  const isOnSale = false // This can be determined based on your business logic
  const originalPrice = price * 1.2 // Example: show 20% higher as original price if on sale
  const salePrice = price

  // Default image if none provided
  const productImage = image_url || '/placeholder-product.jpg'

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <motion.div
          className="aspect-square relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={productImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              SALE
            </div>
          )}
          
          {/* Stock Badge */}
          {stock_quantity === 0 && (
            <div className="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-semibold">
              OUT OF STOCK
            </div>
          )}
        </motion.div>

        {/* Hover Actions */}
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
            />
          </motion.button>
          
          <motion.button
            className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          <motion.button
            className="bg-white p-3 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={stock_quantity === 0}
          >
            <ShoppingCart 
              className={`w-5 h-5 ${stock_quantity === 0 ? 'text-gray-400' : 'text-gray-600'}`} 
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {category_name && (
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
            {category_name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{salePrice.toLocaleString()}
          </span>
          {isOnSale && (
            <span className="text-lg text-gray-500 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          {isOnSale && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              {Math.round(((originalPrice - salePrice) / originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {stock_quantity > 0 ? (
              <>
                <span className="text-green-600">✓ In Stock</span>
                {stock_quantity < 10 && (
                  <span className="text-orange-600 ml-2">
                    Only {stock_quantity} left!
                  </span>
                )}
              </>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </p>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
            stock_quantity > 0
              ? 'bg-[#8b1538] text-white hover:bg-[#6d0f2a]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={{ scale: stock_quantity > 0 ? 1.02 : 1 }}
          whileTap={{ scale: stock_quantity > 0 ? 0.98 : 1 }}
          disabled={stock_quantity === 0}
        >
          {stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProductCard