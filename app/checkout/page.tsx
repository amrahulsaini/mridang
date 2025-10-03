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

// Cashfree type declaration
declare global {
  interface Window {
    Cashfree: {
      checkout: (options: CashfreeCheckoutOptions) => void
    }
  }
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string
  returnUrl?: string
  redirectTarget?: string
}

interface CashfreeResponse {
  order: {
    orderId: string
    status: string
  }
  transaction: {
    transactionId: string
  }
  error?: {
    code: string
    message: string
  }
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
    country: 'India'
  })
  const [emailVerified, setEmailVerified] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
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
    script.onload = () => setCashfreeLoaded(true)
    script.onerror = () => console.error('Failed to load Cashfree SDK')
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingCost = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
  const total = subtotal + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Reset email verification if email changes
    if (name === 'email') {
      setEmailVerified(false)
      setOtpSent(false)
      setOtp('')
      setOtpError('')
    }
  }

  const sendOTP = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      return
    }

    setIsVerifyingEmail(true)
    setOtpError('')
    setOtpSent(true) // Show OTP field immediately

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        // OTP sent successfully, keep otpSent as true
        setOtp('') // Clear any previous OTP
      } else {
        setErrors(prev => ({ ...prev, email: data.error || 'Failed to send OTP' }))
        setOtpSent(false) // Hide OTP field if sending failed
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setErrors(prev => ({ ...prev, email: 'Failed to send OTP. Please try again.' }))
      setOtpSent(false) // Hide OTP field if sending failed
    } finally {
      setIsVerifyingEmail(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP')
      return
    }

    setIsVerifyingOtp(true)
    setOtpError('')

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        setEmailVerified(true)
        setOtpSent(false)
        setErrors(prev => ({ ...prev, email: '' }))
      } else {
        setOtpError(data.error || 'Invalid OTP')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setOtpError('Failed to verify OTP. Please try again.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setIsProcessingPayment(true)
    setPaymentError('')

    try {
      // Create Cashfree order
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
          }
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // Initialize Cashfree Checkout
      if (window.Cashfree) {
        const cashfree = window.Cashfree
        
        const checkoutOptions: CashfreeCheckoutOptions = {
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: '_modal'
        }

        cashfree.checkout(checkoutOptions)
        
        // Store order data and cashfree order ID for verification
        sessionStorage.setItem('pendingOrderData', JSON.stringify({
          cashfreeOrderId: orderData.orderId,
          formData,
          items: state.items
        }))
        
        // Listen for payment completion
        window.addEventListener('message', handlePaymentMessage)
      } else {
        throw new Error('Cashfree SDK not loaded')
      }

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(error instanceof Error ? error.message : 'Payment failed')
      setIsProcessingPayment(false)
    }
  }

  const handlePaymentMessage = (event: MessageEvent) => {
    if (event.data && event.data.status) {
      const status = event.data.status
      
      if (status === 'PAID' || status === 'SUCCESS') {
        verifyPayment()
      } else if (status === 'FAILED') {
        setPaymentError('Payment failed. Please try again.')
        setIsProcessingPayment(false)
        window.removeEventListener('message', handlePaymentMessage)
      } else if (status === 'PENDING') {
        // Payment is pending, wait for completion
      }
    }
  }

  const verifyPayment = async () => {
    try {
      const pendingOrderDataStr = sessionStorage.getItem('pendingOrderData')
      if (!pendingOrderDataStr) {
        throw new Error('Order data not found')
      }

      const pendingOrderData = JSON.parse(pendingOrderDataStr)
      
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
        window.removeEventListener('message', handlePaymentMessage)
        
        // Store user email for orders page
        localStorage.setItem('userEmail', formData.email)

        // Clear the cart after successful payment
        clearCart()

        // Show success dialog
        setSuccessOrderId(result.orderId)
        setShowSuccessDialog(true)
      } else {
        throw new Error(result.error || 'Payment verification failed')
      }

    } catch (error) {
      console.error('Verification error:', error)
      setPaymentError(error instanceof Error ? error.message : 'Payment verification failed')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!emailVerified) newErrors.email = 'Please verify your email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlePayment()
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
              <div className={styles.emailGroup}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.email ? styles.error : ''}`}
                  placeholder="Enter your email address"
                  disabled={emailVerified}
                />
                <button
                  type="button"
                  onClick={otpSent ? verifyOTP : sendOTP}
                  disabled={emailVerified || isVerifyingEmail || isVerifyingOtp}
                  className={styles.verifyBtn}
                >
                  {emailVerified ? (
                    <CheckCircle className={styles.verifyIcon} />
                  ) : isVerifyingEmail ? (
                    'Sending...'
                  ) : isVerifyingOtp ? (
                    'Verifying...'
                  ) : otpSent ? (
                    'Verify OTP'
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              {emailVerified && (
                <span className={styles.successText}>
                  <CheckCircle className={styles.successIcon} />
                  Email verified successfully!
                </span>
              )}

              {/* OTP Field */}
              {otpSent && (
                <div className={styles.otpGroup}>
                  <label className={styles.label}>Enter OTP *</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setOtp(value)
                      if (otpError) setOtpError('')
                    }}
                    className={`${styles.input} ${otpError ? styles.error : ''}`}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    disabled={emailVerified}
                  />
                  {otpError && <span className={styles.errorText}>{otpError}</span>}
                  {emailVerified ? (
                    <span className={styles.successText}>
                      <CheckCircle className={styles.successIcon} />
                      OTP verified successfully!
                    </span>
                  ) : (
                    <span className={styles.otpHint}>
                      OTP sent to {formData.email}. Check your email and enter the 4-digit code.
                    </span>
                  )}
                </div>
              )}
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