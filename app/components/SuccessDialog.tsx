'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import styles from './SuccessDialog.module.css'

interface SuccessDialogProps {
  isOpen: boolean
  orderId: string
  onClose: () => void
  onConfirm: () => void
}

export default function SuccessDialog({ isOpen, orderId, onClose, onConfirm }: SuccessDialogProps) {
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
            className={styles.dialog}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={24} />
            </button>

            <div className={styles.content}>
              <div className={styles.icon}>
                <CheckCircle className={styles.checkIcon} />
              </div>

              <h2 className={styles.title}>Payment Successful!</h2>

              <div className={styles.message}>
                <p>Your order has been placed successfully.</p>
                <div className={styles.orderId}>
                  <strong>Order ID:</strong> {orderId}
                </div>
                <p>You will receive a confirmation email shortly.</p>
              </div>

              <div className={styles.actions}>
                <button className={styles.confirmBtn} onClick={onConfirm}>
                  View Order Details
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}