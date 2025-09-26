'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Info, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '../types'
import { useCart } from '../context/CartContext'
import { useNotification } from '../context/NotificationContext'

const ProductCard: React.FC<Product & { onInfoClick?: (product: Product) => void }> = ({
  name,
  cut_price,
  original_price,
  main_image_url,
  image_url,
  onInfoClick,
  ...product
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const { state, addItem, removeItem } = useCart()
  const { showNotification } = useNotification()

  // Use main_image_url first, then fallback to image_url, then placeholder
  const productImage = main_image_url || image_url || '/file.svg'
  const isProblematicSrc = typeof productImage === 'string' && productImage.includes('url=')
  
  // Complete product object for modal
  const completeProduct: Product = {
    name,
    cut_price,
    original_price,
    main_image_url,
    image_url,
    ...product
  }

  const handleInfoClick = () => {
    if (onInfoClick) {
      onInfoClick(completeProduct)
    }
  }

  // Check if item is in cart
  const isInCart = state.items.some(item => item.id === product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: name,
      price: cut_price || original_price || product.price,
      image: productImage,
      category: product.category_name || 'General'
    })
    
    showNotification({
      type: 'success',
      title: 'Added to Cart!',
      message: `${name} has been added to your cart.`
    })
  }

  const handleRemoveFromCart = () => {
    setShowRemoveConfirm(true)
  }

  const confirmRemove = () => {
    removeItem(product.id)
    setShowRemoveConfirm(false)
    
    showNotification({
      type: 'success',
      title: 'Removed from Cart',
      message: `${name} has been removed from your cart.`
    })
  }

  const cancelRemove = () => {
    setShowRemoveConfirm(false)
  }

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
      <div className={`product-image ${isHovered ? 'shape-morphed' : ''}`}>
        {isProblematicSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={productImage}
            alt={name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
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

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center relative">
          {!isInCart ? (
            <button 
              className="btn-icon btn-primary" 
              title="Add to Cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          ) : (
            <button 
              className="btn-icon bg-red-600 text-white hover:bg-red-700" 
              title="Remove from Cart"
              onClick={handleRemoveFromCart}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <X className="w-3 h-3 absolute -top-1 -right-1 bg-red-600 rounded-full" />
              </div>
            </button>
          )}
          
          <button className="btn-icon btn-secondary" title="Product Info" onClick={handleInfoClick}>
            <Info className="w-5 h-5" />
          </button>

          {/* Remove Confirmation Modal */}
          {showRemoveConfirm && (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white rounded-lg border-2 border-red-300 shadow-lg p-3 z-10">
              <p className="text-sm font-medium mb-2 text-center">Remove from cart?</p>
              <div className="flex gap-2 justify-center">
                <button 
                  className="btn-icon btn-secondary text-xs px-2 py-1" 
                  onClick={cancelRemove}
                >
                  Cancel
                </button>
                <button 
                  className="btn-icon bg-red-600 text-white hover:bg-red-700 text-xs px-2 py-1" 
                  onClick={confirmRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard