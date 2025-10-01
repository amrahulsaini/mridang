'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './Contact.module.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Address',
      details: [
        '801, Barkat Nagar, Tonk Phatak',
        'Jaipur, Rajasthan 302015',
        'India'
      ]
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        'General Support: support@mridang.co.in',
        'Order Tracking: orders@mridang.co.in',
        'Business Inquiries: hello@mridang.co.in'
      ]
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        '+91 9413419163',
        'Mon-Sat: 10:00 AM - 7:00 PM IST',
        'Sunday: Closed'
      ]
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        'Monday - Saturday: 10:00 AM - 7:00 PM',
        'Sunday: Closed',
        'Response time: Within 24 hours'
      ]
    }
  ]

  return (
    <div className={styles.container}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroText}
          >
            <h1>Get in Touch</h1>
            <p>We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={styles.contactInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.infoCard}
              >
                <div className={styles.iconWrapper}>
                  <info.icon size={24} />
                </div>
                <h3>{info.title}</h3>
                <div className={styles.details}>
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.formContainer}
            >
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={styles.successMessage}
                >
                  <CheckCircle size={20} />
                  <span>Thank you! Your message has been sent successfully.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="orders">Order Support</option>
                    <option value="custom">Custom Orders</option>
                    <option value="wholesale">Wholesale/Business</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.mapContainer}
            >
              <h2>Visit Our Workshop</h2>
              <p>Located in the heart of Jaipur&apos;s artisan district, our workshop is where all the magic happens.</p>

              <div className={styles.mapPlaceholder}>
                <MapPin size={48} />
                <h3>Our Location</h3>
                <p>801, Barkat Nagar, Tonk Phatak</p>
                <p>Jaipur, Rajasthan 302015</p>
                <p>India</p>
              </div>

              <div className={styles.directions}>
                <h4>Getting Here:</h4>
                <ul>
                  <li>• 15 minutes from Jaipur Railway Station</li>
                  <li>• 20 minutes from Jaipur International Airport</li>
                  <li>• Easily accessible by local transport</li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className={styles.whatsappSection}>
        <div className={styles.container}>
          <div className={styles.whatsappContent}>
            <h2>Need Immediate Help?</h2>
            <p>Chat with us on WhatsApp for instant support and order updates.</p>
            <a
              href="https://wa.me/918306916176"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <Phone size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}