'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, CreditCard, Info as InfoIcon, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '../types'
import { useCart } from '../context/CartContext'
import styles from './ProductInfoModal.module.css'

interface ProductInfoModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  if (!product) return null

  const productImage = product.main_image_url || product.image_url || '/file.svg'
  const isProblematicSrc = typeof productImage === 'string' && productImage.includes('url=')

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const handleAddToCart = () => {
    // Add multiple quantities if more than 1
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImage,
        category: product.category_name || 'General'
      })
    }
    
    // Optional: Show success message or close modal
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className={styles.closeButton}
              onClick={onClose}
              title="Close"
            >
              <X className={styles.closeIcon} />
            </button>

            <div className={styles.content}>
              {/* Left Side - Image */}
              <div className={styles.imageSection}>
                <div className={styles.imageContainer}>
                  {isProblematicSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={productImage}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  ) : (
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className={styles.productImage}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className={styles.detailsSection}>
                {/* Product Name */}
                <h2 className={styles.productName}>{product.name}</h2>

                {/* Price Section */}
                <div className={styles.priceSection}>
                  {product.cut_price && (
                    <span className={styles.cutPrice}>
                      ₹{product.cut_price.toLocaleString()}
                    </span>
                  )}
                  {product.original_price && (
                    <span className={`${styles.originalPrice} ${product.cut_price ? styles.strikethrough : ''}`}>
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className={styles.quantitySection}>
                  <label className={styles.quantityLabel}>Quantity:</label>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityButton}
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className={styles.quantityIcon} />
                    </button>
                    <span className={styles.quantityValue}>{quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={increaseQuantity}
                    >
                      <Plus className={styles.quantityIcon} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button className={`${styles.actionButton} ${styles.buyNowButton}`}>
                    <CreditCard className={styles.buttonIcon} />
                    Buy Now
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.addToCartButton}`}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className={styles.buttonIcon} />
                    Add to Cart
                  </button>
                  <button className={`${styles.actionButton} ${styles.moreDetailsButton}`}>
                    <InfoIcon className={styles.buttonIcon} />
                    More Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProductInfoModal