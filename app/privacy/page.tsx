'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Database, Cookie, Mail } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './Privacy.module.css'

export default function PrivacyPage() {
  const privacySections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.'
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.'
    },
    {
      icon: Lock,
      title: 'Information Security',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.'
    },
    {
      icon: Cookie,
      title: 'Cookies and Tracking',
      content: 'We use cookies and similar technologies to enhance your browsing experience and analyze site traffic.'
    }
  ]

  const dataCategories = [
    {
      title: 'Personal Information',
      items: [
        'Name, email address, and phone number',
        'Shipping and billing addresses',
        'Payment information (processed securely)',
        'Order history and preferences'
      ]
    },
    {
      title: 'Technical Information',
      items: [
        'IP address and location data',
        'Browser type and version',
        'Device information',
        'Website usage patterns'
      ]
    },
    {
      title: 'Communication Data',
      items: [
        'Customer service interactions',
        'Email correspondence',
        'Order-related communications',
        'Feedback and reviews'
      ]
    }
  ]

  const privacyRights = [
    {
      title: 'Access Your Data',
      description: 'Request a copy of the personal information we have about you.',
      icon: '📋'
    },
    {
      title: 'Correct Your Data',
      description: 'Update or correct inaccurate or incomplete personal information.',
      icon: '✏️'
    },
    {
      title: 'Delete Your Data',
      description: 'Request deletion of your personal information, subject to legal requirements.',
      icon: '🗑️'
    },
    {
      title: 'Data Portability',
      description: 'Receive your data in a structured, machine-readable format.',
      icon: '📦'
    },
    {
      title: 'Opt-out of Marketing',
      description: 'Unsubscribe from promotional emails and marketing communications.',
      icon: '🚫'
    },
    {
      title: 'Withdraw Consent',
      description: 'Withdraw consent for data processing where applicable.',
      icon: '🔄'
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
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. Learn how we collect, use, and protect your information.</p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.overviewCard}
          >
            <div className={styles.overviewIcon}>
              <Shield size={32} />
            </div>
            <div className={styles.overviewContent}>
              <h2>Our Commitment to Privacy</h2>
              <p>
                At Mridang, we are committed to protecting your privacy and ensuring the security of your personal information.
                This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p className={styles.lastUpdated}>
                <strong>Last Updated:</strong> October 1, 2025
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className={styles.privacyOverview}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How We Handle Your Privacy</h2>
            <p>Our approach to collecting and protecting your personal information.</p>
          </div>

          <div className={styles.overviewGrid}>
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.overviewCard}
              >
                <div className={styles.sectionIcon}>
                  <section.icon size={24} />
                </div>
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection Details */}
      <section className={styles.dataSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Types of Information We Collect</h2>
            <p>We collect different types of information to provide and improve our services.</p>
          </div>

          <div className={styles.dataGrid}>
            {dataCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.dataCard}
              >
                <h3>{category.title}</h3>
                <ul className={styles.dataList}>
                  {category.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Rights */}
      <section className={styles.rightsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Your Privacy Rights</h2>
            <p>You have certain rights regarding your personal information. Here's what you can do:</p>
          </div>

          <div className={styles.rightsGrid}>
            {privacyRights.map((right, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className={styles.rightCard}
              >
                <div className={styles.rightIcon}>{right.icon}</div>
                <h3>{right.title}</h3>
                <p>{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <h2>Questions About Privacy?</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us.</p>

            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <Mail size={20} />
                <div>
                  <h4>Data Protection Officer</h4>
                  <a href="mailto:privacy@mridang.co.in">privacy@mridang.co.in</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Mail size={20} />
                <div>
                  <h4>General Support</h4>
                  <a href="mailto:support@mridang.co.in">support@mridang.co.in</a>
                </div>
              </div>
            </div>

            <div className={styles.contactAddress}>
              <h4>Mailing Address</h4>
              <p>
                Mridang Handicrafts<br />
                801, Barkat Nagar, Tonk Phatak<br />
                Jaipur, Rajasthan 302015<br />
                India
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}