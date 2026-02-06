'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, CreditCard, CheckCircle, Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import SuccessDialog from '../components/SuccessDialog'
import styles from './Checkout.module.css'

// Cashfree type declaration for v3 SDK
declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => Promise<CashfreeInstance>
  }
}

interface CashfreeInstance {
  checkout: (options: CashfreeCheckoutOptions) => Promise<void>
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string
  returnUrl?: string
  redirectTarget?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  brideName: string
  groomName: string
  engagementDate: string
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    brideName: '',
    groomName: '',
    engagementDate: ''
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false)

  // Success dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState('')

  // Load Cashfree SDK script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    script.onload = () => {
      console.log('Cashfree SDK loaded successfully')
      setCashfreeLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK')
      setPaymentError('Failed to load payment gateway')
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingCost: number = 0 // Free shipping on all orders
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlePayment()
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setIsProcessingPayment(true)
    setPaymentError('')

    try {
      // Create Cashfree order with full order details
      const orderResponse = await fetch('/api/create-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          customerData: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone
          },
          orderData: formData,
          items: state.items,
          subtotal: subtotal,
          shippingCost: shippingCost
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      console.log('Order created:', orderData)

      // Store order data for verification
      sessionStorage.setItem('pendingOrderData', JSON.stringify({
        cashfreeOrderId: orderData.orderId,
        internalOrderId: orderData.internalOrderId,
        formData,
        items: state.items
      }))

      // Initialize Cashfree Checkout using v3 SDK
      if (typeof window.Cashfree === 'undefined') {
        throw new Error('Cashfree SDK not loaded')
      }

      // Determine environment
      const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
      
      console.log('Initializing Cashfree with environment:', cashfreeEnv)

      // Create Cashfree instance
      const cashfree = await window.Cashfree({ mode: cashfreeEnv })

      const checkoutOptions: CashfreeCheckoutOptions = {
        paymentSessionId: orderData.paymentSessionId,
        returnUrl: `${window.location.origin}/checkout`,
        redirectTarget: '_modal'
      }

      console.log('Opening Cashfree checkout with session:', orderData.paymentSessionId)

      // Open checkout modal
      await cashfree.checkout(checkoutOptions)

      // After checkout modal closes, verify payment
      setTimeout(() => {
        verifyPayment()
      }, 2000)

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(error instanceof Error ? error.message : 'Payment failed')
      setIsProcessingPayment(false)
    }
  }

  const verifyPayment = async () => {
    try {
      const pendingOrderDataStr = sessionStorage.getItem('pendingOrderData')
      if (!pendingOrderDataStr) {
        console.log('No pending order data, skipping verification')
        setIsProcessingPayment(false)
        return
      }

      const pendingOrderData = JSON.parse(pendingOrderDataStr)
      
      console.log('Verifying payment for order:', pendingOrderData.cashfreeOrderId)
      
      const verificationData = {
        cashfree_order_id: pendingOrderData.cashfreeOrderId,
        orderData: {
          ...pendingOrderData.formData,
          items: pendingOrderData.items
        }
      }

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      })

      const result = await response.json()

      if (response.ok) {
        // Clean up session storage
        sessionStorage.removeItem('pendingOrderData')
        
        // Store user email for orders page
        localStorage.setItem('userEmail', formData.email)

        // Clear the cart after successful payment
        clearCart()

        // Show success dialog
        setSuccessOrderId(result.orderId)
        setShowSuccessDialog(true)
      } else {
        // Payment might still be pending
        if (result.error && result.error.includes('not found')) {
          console.log('Payment still pending, will retry...')
          setPaymentError('Payment is being processed. Please wait...')
          // Retry after 3 seconds
          setTimeout(() => verifyPayment(), 3000)
        } else {
          throw new Error(result.error || 'Payment verification failed')
        }
      }

    } catch (error) {
      console.error('Verification error:', error)
      setPaymentError(error instanceof Error ? error.message : 'Payment verification failed')
    } finally {
      setIsProcessingPayment(false)
    }
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
        <Link href="/cart" className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          Back to Cart
        </Link>
        <h1 className={styles.pageTitle}>Checkout</h1>
      </motion.div>

      <div className={styles.checkoutContent}>
        {/* Order Summary */}
        <motion.div
          className={styles.orderSummary}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.itemsList}>
              {state.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={styles.summaryItem}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
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
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemCategory}>{item.category}</p>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemPrice}>₹{item.price.toLocaleString()}</span>
                      <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal ({state.items.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Checkout Form */}
        <motion.form
          className={styles.checkoutForm}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              <MapPin className={styles.formIcon} />
              Shipping Information
            </h2>

            {/* Name Fields */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Phone Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number *</label>
              <div className={styles.phoneGroup}>
                <select className={styles.countryCode}>
                  <option value="+91">+91</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            {/* Address Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.address ? styles.error : ''}`}
                placeholder="Enter your complete address"
                rows={3}
              />
              {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>

            {/* City, State, Pincode */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.city ? styles.error : ''}`}
                  placeholder="Enter your city"
                />
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.state ? styles.error : ''}`}
                  placeholder="Enter your state"
                />
                {errors.state && <span className={styles.errorText}>{errors.state}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.pincode ? styles.error : ''}`}
                  placeholder="Enter pincode"
                />
                {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
              </div>
            </div>

            {/* Country */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* Customization Details Section */}
            <div className={styles.customizationSection}>
              <h3 className={styles.sectionTitle}>Customization Details (Optional)</h3>
              <p className={styles.sectionDescription}>
                Add personalization details for your order
              </p>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Bride Name</label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter bride's name (optional)"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Groom Name</label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter groom's name (optional)"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Date of Engagement</label>
                <input
                  type="date"
                  name="engagementDate"
                  value={formData.engagementDate}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isProcessingPayment || !cashfreeLoaded}
            >
              {isProcessingPayment ? (
                <>
                  <Loader className={`${styles.submitIcon} ${styles.spinning}`} />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className={styles.submitIcon} />
                  Pay ₹{total.toLocaleString()}
                </>
              )}
            </button>

            {paymentError && (
              <div className={styles.errorText} style={{ textAlign: 'center', marginTop: '10px' }}>
                {paymentError}
              </div>
            )}

            {!cashfreeLoaded && (
              <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
                Loading payment gateway...
              </div>
            )}
          </div>
        </motion.form>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        orderId={successOrderId}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={() => {
          setShowSuccessDialog(false)
          router.push('/order-success?orderId=' + successOrderId)
        }}
      />
    </div>
  )
}