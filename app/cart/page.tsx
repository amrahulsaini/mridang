'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import styles from './Cart.module.css'

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleBuyNow = () => {
    // Navigate to checkout or handle purchase logic
    alert('Buy Now functionality will be implemented!')
  }

  if (state.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <motion.div
            className={styles.emptyCartContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className={styles.emptyCartIcon} />
            <h1 className={styles.emptyCartTitle}>Your Cart is Empty</h1>
            <p className={styles.emptyCartText}>
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/" className={styles.continueShoppingBtn}>
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          Continue Shopping
        </Link>
        <h1 className={styles.pageTitle}>Your Cart ({state.totalItems} items)</h1>
      </motion.div>

      {/* Cart Items */}
      <motion.div
        className={styles.cartContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className={styles.itemsSection}>
          {state.items.map((item, index) => (
            <motion.div
              key={item.id}
              className={styles.cartItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className={styles.itemImage}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={styles.image}
                />
              </div>

              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemCategory}>{item.category}</p>
                <p className={styles.itemPrice}>₹{item.price.toLocaleString()}</p>
              </div>

              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className={styles.quantityIcon} />
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className={styles.quantityIcon} />
                </button>
              </div>

              <div className={styles.itemTotal}>
                <p className={styles.totalPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              <button
                className={styles.removeBtn}
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className={styles.removeIcon} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          className={styles.summarySection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal ({state.totalItems} items)</span>
              <span>₹{state.totalPrice.toLocaleString()}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{state.totalPrice.toLocaleString()}</span>
            </div>

            <button
              className={styles.buyNowBtn}
              onClick={handleBuyNow}
            >
              <CreditCard className={styles.buyNowIcon} />
              Buy Now
            </button>

            <button
              className={styles.clearCartBtn}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}