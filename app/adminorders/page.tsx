'use client'

import { useState, useEffect } from 'react'
import styles from './AdminOrders.module.css'

interface OrderProduct {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
}

interface Order {
  id: number
  order_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  products: OrderProduct[]
  subtotal: number
  shipping_cost: number
  total_amount: number
  email_verified: boolean
  phone_verified: boolean
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  verified_at?: string
  completed_at?: string
  ip_address?: string
  user_agent?: string
  notes?: string
}

export default function AdminOrdersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all')

  // Authentication
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_token', data.token)
        loadOrders()
      } else {
        alert(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Load orders
  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const ordersData = await response.json()
        setOrders(ordersData)
      } else {
        alert('Failed to load orders')
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      alert('Failed to load orders')
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId: number, status: string, paymentStatus?: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, paymentStatus, notes })
      })

      if (response.ok) {
        loadOrders()
        alert('Order updated successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order')
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === 'all' || order.status === filterStatus
    const paymentMatch = filterPaymentStatus === 'all' || order.payment_status === filterPaymentStatus
    return statusMatch && paymentMatch
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
      loadOrders()
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin Login</h1>
          <form onSubmit={handleAuth} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.authInput}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.authBtn}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <h1>Orders Management</h1>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token')
                setIsAuthenticated(false)
              }}
              className={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filtersContent}>
          <div className={styles.filtersGrid}>
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Order Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Payment Status</label>
                <select
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <button
                  onClick={loadOrders}
                  className={styles.refreshBtn}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <span className={styles.orderId}>{order.order_id}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.customerInfo}>
                        <div className={styles.customerName}>
                          {order.first_name} {order.last_name}
                        </div>
                        <div className={styles.customerEmail}>{order.email}</div>
                        <div className={styles.customerPhone}>{order.phone}</div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.amount}>{formatCurrency(order.total_amount)}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.statusBadge} ${styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`] || styles.statusPending}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.statusBadge} ${styles[`payment${order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}`] || styles.paymentPending}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.date}>{formatDate(order.created_at)}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.actions}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={styles.viewBtn}
                        >
                          View Details
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No orders found matching the current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}

// Order Details Modal Component
function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus
}: {
  order: Order
  onClose: () => void
  onUpdateStatus: (orderId: number, status: string, paymentStatus?: string, notes?: string) => void
}) {
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const [notes, setNotes] = useState(order.notes || '')

  const handleUpdate = () => {
    onUpdateStatus(order.id, status, paymentStatus, notes)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN')
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            Order Details - {order.order_id}
          </h3>
          <button
            onClick={onClose}
            className={styles.modalClose}
          >
            ×
          </button>
        </div>
        <div className={styles.modalBody}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {order.first_name} {order.last_name}</p>
                <p><span className="font-medium">Email:</span> {order.email}</p>
                <p><span className="font-medium">Phone:</span> {order.phone}</p>
                <p><span className="font-medium">Email Verified:</span> {order.email_verified ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Phone Verified:</span> {order.phone_verified ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Order Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Order ID:</span> {order.order_id}</p>
                <p><span className="font-medium">Created:</span> {formatDate(order.created_at)}</p>
                {order.verified_at && <p><span className="font-medium">Verified:</span> {formatDate(order.verified_at)}</p>}
                {order.completed_at && <p><span className="font-medium">Completed:</span> {formatDate(order.completed_at)}</p>}
                <p><span className="font-medium">IP Address:</span> {order.ip_address || 'N/A'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {order.address}<br />
                {order.city}, {order.state} {order.pincode}<br />
                {order.country}
              </div>
            </div>

            {/* Products */}
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3">Products</h4>
              <div className="space-y-2">
                {Array.isArray(order.products) ? order.products.map((product: OrderProduct, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(product.price * product.quantity)}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-600">Product details not available in expected format</p>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pricing</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-1">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Add notes about this order..."
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}