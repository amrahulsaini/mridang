'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Eye, Calendar, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Orders.module.css'

interface Order {
  id: number
  orderId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  products: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  pricing: {
    subtotal: number
    shippingCost: number
    totalAmount: number
  }
  customization?: {
    brideName?: string
    groomName?: string
    engagementDate?: string
  }
  status: string
  paymentStatus: string
  createdAt: string
  completedAt: string | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get the user's email from authentication
      // For now, we'll use a test email or get it from localStorage
      const userEmail = localStorage.getItem('userEmail') || 'test@example.com'

      const response = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
      } else {
        setError(data.error || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('Failed to fetch orders')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981'
      case 'processing':
        return '#f59e0b'
      case 'pending':
        return '#6b7280'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return '#10b981'
      case 'pending':
        return '#f59e0b'
      case 'failed':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={fetchOrders} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft className={styles.backIcon} />
          Back to Home
        </Link>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>Track and manage your purchases</p>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          className={styles.emptyState}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Package className={styles.emptyIcon} />
          <h2>No Orders Yet</h2>
          <p>You haven&apos;t placed any orders yet. Start shopping to see your orders here!</p>
          <Link href="/" className={styles.shopBtn}>
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              className={styles.orderCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3 className={styles.orderId}>Order #{order.orderId}</h3>
                  <div className={styles.orderDate}>
                    <Calendar className={styles.dateIcon} />
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className={styles.orderStatus}>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                  <span
                    className={styles.paymentBadge}
                    style={{ backgroundColor: getPaymentStatusColor(order.paymentStatus) }}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className={styles.orderProducts}>
                {order.products.slice(0, 3).map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h4 className={styles.productName}>{product.name}</h4>
                      <p className={styles.productDetails}>
                        Qty: {product.quantity} × ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {order.products.length > 3 && (
                  <div className={styles.moreProducts}>
                    +{order.products.length - 3} more items
                  </div>
                )}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalAmount}>
                    ₹{order.pricing.totalAmount.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className={styles.viewDetailsBtn}
                >
                  <Eye className={styles.viewIcon} />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.orderSummary}>
                <div className={styles.summaryItem}>
                  <strong>Order ID:</strong> {selectedOrder.orderId}
                </div>
                <div className={styles.summaryItem}>
                  <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </div>
                <div className={styles.summaryItem}>
                  <strong>Status:</strong>
                  <span style={{ color: getStatusColor(selectedOrder.status) }}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>Payment:</strong>
                  <span style={{ color: getPaymentStatusColor(selectedOrder.paymentStatus) }}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className={styles.customerInfo}>
                <h3>Customer Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <Mail className={styles.infoIcon} />
                    <span>{selectedOrder.customer.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Phone className={styles.infoIcon} />
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <MapPin className={styles.infoIcon} />
                    <span>
                      {selectedOrder.customer.address}, {selectedOrder.customer.city},
                      {selectedOrder.customer.state} {selectedOrder.customer.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customization Details */}
              {selectedOrder.customization && (selectedOrder.customization.brideName || selectedOrder.customization.groomName || selectedOrder.customization.engagementDate) && (
                <div className={styles.customizationInfo}>
                  <h3>💝 Customization Details</h3>
                  <div className={styles.customizationGrid}>
                    {selectedOrder.customization.brideName && (
                      <div className={styles.customItem}>
                        <strong>Bride Name:</strong>
                        <span>{selectedOrder.customization.brideName}</span>
                      </div>
                    )}
                    {selectedOrder.customization.groomName && (
                      <div className={styles.customItem}>
                        <strong>Groom Name:</strong>
                        <span>{selectedOrder.customization.groomName}</span>
                      </div>
                    )}
                    {selectedOrder.customization.engagementDate && (
                      <div className={styles.customItem}>
                        <strong>Engagement Date:</strong>
                        <span>{new Date(selectedOrder.customization.engagementDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.productsList}>
                <h3>Products</h3>
                {selectedOrder.products.map((product) => (
                  <div key={product.id} className={styles.productDetail}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={80}
                      height={80}
                      className={styles.productDetailImage}
                    />
                    <div className={styles.productDetailInfo}>
                      <h4>{product.name}</h4>
                      <p>Quantity: {product.quantity}</p>
                      <p>Price: ₹{product.price.toLocaleString()}</p>
                      <p>Subtotal: ₹{(product.price * product.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.pricingSummary}>
                <div className={styles.pricingRow}>
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.pricingRow}>
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.pricing.shippingCost.toLocaleString()}</span>
                </div>
                <div className={styles.pricingRow + ' ' + styles.total}>
                  <span>Total:</span>
                  <span>₹{selectedOrder.pricing.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}