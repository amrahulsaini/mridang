'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Truck, Clock, MapPin, Shield, Package, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './Shipping.module.css'

export default function ShippingPage() {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'Standard Shipping',
      time: '5-7 Business Days',
      cost: '₹99',
      description: 'Reliable delivery across India with tracking updates.',
      features: ['Doorstep delivery', 'Real-time tracking', 'Insurance coverage', 'Customer support']
    },
    {
      icon: Clock,
      title: 'Express Shipping',
      time: '2-3 Business Days',
      cost: '₹199',
      description: 'Fast delivery for urgent orders and special occasions.',
      features: ['Priority handling', 'Express delivery', 'Premium packaging', 'Dedicated support']
    },
    {
      icon: Package,
      title: 'Free Shipping',
      time: '5-7 Business Days',
      cost: 'FREE',
      description: 'Complimentary shipping on orders above ₹2000.',
      features: ['No delivery charges', 'Standard packaging', 'Order tracking', 'Quality assurance']
    }
  ]

  const shippingInfo = [
    {
      icon: MapPin,
      title: 'Shipping Zones',
      content: 'We deliver across all major cities and towns in India. Remote areas may have extended delivery times.'
    },
    {
      icon: Shield,
      title: 'Secure Packaging',
      content: 'All products are carefully packaged with protective materials to ensure safe delivery of your handcrafted items.'
    },
    {
      icon: Clock,
      title: 'Processing Time',
      content: 'Orders are processed within 1-2 business days. Custom orders may take 3-5 days for preparation.'
    },
    {
      icon: CheckCircle,
      title: 'Order Tracking',
      content: 'Receive real-time updates via SMS and email. Track your order status from our website or app.'
    }
  ]

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days. Processing time is 1-2 business days.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within India. International shipping will be available soon. Stay tuned for updates!'
    },
    {
      question: 'What if my order is damaged during shipping?',
      answer: 'All orders are insured. If you receive a damaged item, contact us immediately with photos and we\'ll arrange a replacement or refund.'
    },
    {
      question: 'Can I change my shipping address after placing an order?',
      answer: 'Address changes are possible within 2 hours of order placement. Contact our support team at support@mridang.co.in for assistance.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and wallet payments through our secure payment gateway.'
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
            <h1>Shipping & Delivery</h1>
            <p>Carefully crafted, safely delivered. Learn about our shipping options and delivery process.</p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className={styles.shippingOptions}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Choose Your Shipping Method</h2>
            <p>Select the delivery option that best suits your needs and timeline.</p>
          </div>

          <div className={styles.optionsGrid}>
            {shippingOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.optionCard}
              >
                <div className={styles.optionIcon}>
                  <option.icon size={32} />
                </div>
                <h3>{option.title}</h3>
                <div className={styles.optionMeta}>
                  <span className={styles.time}>{option.time}</span>
                  <span className={styles.cost}>{option.cost}</span>
                </div>
                <p className={styles.description}>{option.description}</p>
                <ul className={styles.features}>
                  {option.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Information */}
      <section className={styles.shippingInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {shippingInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.infoCard}
              >
                <div className={styles.infoIcon}>
                  <info.icon size={24} />
                </div>
                <h3>{info.title}</h3>
                <p>{info.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Process */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>From order to delivery - here&apos;s what happens next.</p>
          </div>

          <div className={styles.processSteps}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.processStep}
            >
              <div className={styles.stepNumber}>1</div>
              <h3>Order Confirmation</h3>
              <p>You&apos;ll receive an email confirmation within minutes of placing your order.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={styles.processStep}
            >
              <div className={styles.stepNumber}>2</div>
              <h3>Quality Check</h3>
              <p>Each item undergoes a final quality inspection before packaging.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={styles.processStep}
            >
              <div className={styles.stepNumber}>3</div>
              <h3>Safe Packaging</h3>
              <p>Your items are carefully packaged with protective materials.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={styles.processStep}
            >
              <div className={styles.stepNumber}>4</div>
              <h3>Doorstep Delivery</h3>
              <p>Track your order and receive real-time delivery updates.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common shipping and delivery questions.</p>
          </div>

          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.faqItem}
              >
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <h2>Need Help with Shipping?</h2>
            <p>Our customer support team is here to assist you with any shipping-related questions.</p>
            <div className={styles.contactButtons}>
              <Link href="/contact" className={styles.contactBtn}>
                Contact Support
              </Link>
              <a href="mailto:support@mridang.co.in" className={styles.emailBtn}>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}