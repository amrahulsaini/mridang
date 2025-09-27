'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from './OrderSuccess.module.css'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.successCard}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.successIcon}>
          <CheckCircle className={styles.icon} />
        </div>

        <h1 className={styles.title}>Order Placed Successfully!</h1>

        <div className={styles.orderInfo}>
          <p className={styles.message}>
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>

          {orderId && (
            <div className={styles.orderId}>
              <strong>Order ID:</strong> {orderId}
            </div>
          )}

          <div className={styles.details}>
            <p>You will receive an email confirmation shortly with your order details.</p>
            <p>Our team will contact you within 24 hours to arrange delivery.</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <ArrowLeft className={styles.btnIcon} />
            Continue Shopping
          </Link>

          <Link href="/orders" className={styles.secondaryBtn}>
            View Order History
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}