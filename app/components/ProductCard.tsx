'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
              
              {/* Remove Confirmation Modal - Animated Overlay */}
              <AnimatePresence>
                {showRemoveConfirm && (
                  <>
                    {/* Animated Backdrop */}
                    <motion.div 
                      className="fixed inset-0 bg-black z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={cancelRemove}
                    />
                    
                    {/* Animated Modal */}
                    <motion.div 
                      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 min-w-[320px] border-2 border-red-100"
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 50 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Header with red accent */}
                      <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-t-2xl border-b-2 border-red-200">
                        <div className="flex items-center justify-center">
                          <motion.div 
                            className="bg-red-500 rounded-full p-3 mr-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <Trash2 className="w-7 h-7 text-white" />
                          </motion.div>
                          <div className="text-center">
                            <motion.h3 
                              className="text-xl font-bold text-red-800 mb-1"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              Remove from Cart
                            </motion.h3>
                            <motion.p 
                              className="text-sm text-red-600 font-medium"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.3 }}
                            >
                              This item will be removed permanently
                            </motion.p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div 
                        className="p-6 bg-white rounded-b-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <div className="flex gap-4 justify-center">
                          <motion.button 
                            className="px-8 py-3 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
                            onClick={cancelRemove}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button 
                            className="px-8 py-3 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl border-2 border-red-600 hover:border-red-700"
                            onClick={confirmRemove}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Item
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
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