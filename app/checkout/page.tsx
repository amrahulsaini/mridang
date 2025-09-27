'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, CreditCard, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import styles from './Checkout.module.css'

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
  const { state } = useCart()
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
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [smsOtpSent, setSmsOtpSent] = useState(false)
  const [smsOtp, setSmsOtp] = useState('')
  const [isVerifyingSmsOtp, setIsVerifyingSmsOtp] = useState(false)
  const [smsOtpError, setSmsOtpError] = useState('')
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Redirect if cart is empty
  if (state.items.length === 0) {
    router.push('/cart')
    return null
  }

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

    // Reset phone verification if phone changes
    if (name === 'phone') {
      setPhoneVerified(false)
      setSmsOtpSent(false)
      setSmsOtp('')
      setSmsOtpError('')
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

  const sendSmsOTP = async () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }))
      return
    }

    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }))
      return
    }

    setIsVerifyingPhone(true)
    setSmsOtpError('')
    setSmsOtpSent(true) // Show SMS OTP field immediately

    try {
      const response = await fetch('/api/send-sms-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone }),
      })

      const data = await response.json()

      if (response.ok) {
        setSmsOtp('') // Clear any previous SMS OTP
      } else {
        setErrors(prev => ({ ...prev, phone: data.error || 'Failed to send SMS OTP' }))
        setSmsOtpSent(false) // Hide SMS OTP field if sending failed
      }
    } catch (error) {
      console.error('Error sending SMS OTP:', error)
      setErrors(prev => ({ ...prev, phone: 'Failed to send SMS OTP. Please try again.' }))
      setSmsOtpSent(false) // Hide SMS OTP field if sending failed
    } finally {
      setIsVerifyingPhone(false)
    }
  }

  const verifySmsOTP = async () => {
    if (!smsOtp || smsOtp.length !== 4) {
      setSmsOtpError('Please enter a valid 4-digit OTP')
      return
    }

    setIsVerifyingSmsOtp(true)
    setSmsOtpError('')

    try {
      const response = await fetch('/api/verify-sms-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone, otp: smsOtp }),
      })

      const data = await response.json()

      if (response.ok && data.verified) {
        setPhoneVerified(true)
        setErrors(prev => ({ ...prev, phone: '' }))
      } else {
        setSmsOtpError(data.error || 'Invalid OTP')
      }
    } catch (error) {
      console.error('Error verifying SMS OTP:', error)
      setSmsOtpError('Failed to verify OTP. Please try again.')
    } finally {
      setIsVerifyingSmsOtp(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!emailVerified) newErrors.email = 'Please verify your email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!phoneVerified) newErrors.phone = 'Please verify your phone number'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Proceed to payment
      alert('Proceeding to payment... (Payment integration would go here)')
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
                <span>Subtotal ({state.totalItems} items)</span>
                <span>₹{state.totalPrice.toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                <span>Total Amount</span>
                <span>₹{state.totalPrice.toLocaleString()}</span>
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
                  disabled={phoneVerified}
                />
                <button
                  type="button"
                  onClick={smsOtpSent ? verifySmsOTP : sendSmsOTP}
                  disabled={phoneVerified || isVerifyingPhone || isVerifyingSmsOtp}
                  className={styles.verifyBtn}
                >
                  {phoneVerified ? (
                    <CheckCircle className={styles.verifyIcon} />
                  ) : isVerifyingPhone ? (
                    'Sending...'
                  ) : isVerifyingSmsOtp ? (
                    'Verifying...'
                  ) : smsOtpSent ? (
                    'Verify OTP'
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              {phoneVerified && (
                <span className={styles.successText}>
                  <CheckCircle className={styles.successIcon} />
                  Phone number verified successfully!
                </span>
              )}

              {/* SMS OTP Field */}
              {smsOtpSent && (
                <div className={styles.otpGroup}>
                  <label className={styles.label}>Enter SMS OTP *</label>
                  <input
                    type="text"
                    value={smsOtp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setSmsOtp(value)
                      if (smsOtpError) setSmsOtpError('')
                    }}
                    className={`${styles.input} ${smsOtpError ? styles.error : ''}`}
                    placeholder="Enter 4-digit SMS OTP"
                    maxLength={4}
                    disabled={phoneVerified}
                  />
                  {smsOtpError && <span className={styles.errorText}>{smsOtpError}</span>}
                  {phoneVerified ? (
                    <span className={styles.successText}>
                      <CheckCircle className={styles.successIcon} />
                      SMS OTP verified successfully!
                    </span>
                  ) : (
                    <span className={styles.otpHint}>
                      OTP sent to {formData.phone}. Check your SMS and enter the 4-digit code.
                    </span>
                  )}
                </div>
              )}
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
            >
              <CreditCard className={styles.submitIcon} />
              Proceed to Payment - ₹{state.totalPrice.toLocaleString()}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}