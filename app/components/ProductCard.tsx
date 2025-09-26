'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Info, CheckCircle2, Trash2 } from 'lucide-react'
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
  const { addItem, removeItem, isItemInCart } = useCart()
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
  const isInCart = isItemInCart(product.id)

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
            <div className="relative">
              <button 
                className="btn-icon btn-success" 
                title="In Cart - Click to Remove"
                onClick={handleRemoveFromCart}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              
              {/* Remove Confirmation Modal - Fixed Overlay */}
              {showRemoveConfirm && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50"
                    onClick={cancelRemove}
                  ></div>
                  
                  {/* Modal */}
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl border-2 border-red-300 shadow-2xl p-6 z-50 min-w-[280px]">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-red-100 rounded-full p-3 mr-3">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">Remove from cart?</p>
                        <p className="text-sm text-gray-600 mt-1">This item will be removed from your cart.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button 
                        className="px-6 py-3 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold border-2 border-gray-300" 
                        onClick={cancelRemove}
                      >
                        Cancel
                      </button>
                      <button 
                        className="px-6 py-3 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl border-2 border-red-600" 
                        onClick={confirmRemove}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          <button className="btn-icon btn-secondary" title="Product Info" onClick={handleInfoClick}>
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard