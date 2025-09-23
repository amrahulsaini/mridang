'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Info, X } from 'lucide-react'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use main_image_url first, then fallback to image_url, then placeholder
  const productImage = main_image_url || image_url || '/file.svg'
  const isProblematicSrc = typeof productImage === 'string' && productImage.includes('url=')

  return (
    <motion.div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div 
        className={`product-image ${isHovered ? 'shape-morphed' : ''}`}
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        {isProblematicSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={productImage}
            alt={name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              objectPosition: 'center',
              display: 'block' 
            }}
            loading="lazy"
          />
        ) : (
          <Image
            src={productImage}
            alt={name}
            fill
            className="object-contain"
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

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button className="btn-icon btn-primary" title="Add to Cart">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="btn-icon btn-secondary" title="Product Info">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="product-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="product-modal-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onMouseLeave={() => setIsModalOpen(false)}
            >
              {/* Close Button */}
              <button
                className="product-modal-close"
                onClick={() => setIsModalOpen(false)}
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Image */}
              <div className="product-modal-image">
                {isProblematicSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={productImage}
                    alt={name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain', 
                      objectPosition: 'center',
                      display: 'block' 
                    }}
                  />
                ) : (
                  <Image
                    src={productImage}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 60vw"
                  />
                )}
              </div>

              {/* Action Buttons - Floating */}
              <div className="product-modal-actions-floating">
                <button className="btn-icon btn-primary" title="Add to Cart">
                  <ShoppingCart className="w-6 h-6" />
                </button>
                <button className="btn-icon btn-secondary" title="Product Info">
                  <Info className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProductCard