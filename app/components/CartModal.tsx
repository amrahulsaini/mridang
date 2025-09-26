'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import styles from './CartModal.module.css'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { state, updateQuantity, removeItem, clearCart } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
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
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.titleSection}>
                <ShoppingBag className={styles.headerIcon} />
                <h2 className={styles.title}>Your Cart ({state.totalItems} items)</h2>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <X className={styles.closeIcon} />
              </button>
            </div>

            {/* Cart Content */}
            <div className={styles.content}>
              {state.items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <ShoppingBag className={styles.emptyIcon} />
                  <h3>Your cart is empty</h3>
                  <p>Add some products to get started!</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className={styles.itemsList}>
                    {state.items.map((item) => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.itemImage}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={styles.productImage}
                          />
                        </div>
                        
                        <div className={styles.itemDetails}>
                          <h4 className={styles.itemName}>{item.name}</h4>
                          <p className={styles.itemCategory}>{item.category}</p>
                          <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
                        </div>

                        <div className={styles.quantityControls}>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className={styles.quantity}>{item.quantity}</span>
                          <button
                            className={styles.quantityButton}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className={styles.itemTotal}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          className={styles.removeButton}
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className={styles.cartSummary}>
                    <div className={styles.summaryRow}>
                      <span>Total Items:</span>
                      <span>{state.totalItems}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.totalLabel}>Total Amount:</span>
                      <span className={styles.totalAmount}>₹{state.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.clearButton}
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                    <button className={styles.checkoutButton}>
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CartModal