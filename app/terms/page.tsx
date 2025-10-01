'use client'

import { motion } from 'framer-motion'
import { FileText, Scale, Shield, CreditCard, Truck, RotateCcw } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './Terms.module.css'

export default function TermsPage() {
  const termsSections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: 'By accessing and using Mridang\'s website and services, you accept and agree to be bound by the terms and provision of this agreement.'
    },
    {
      icon: Scale,
      title: 'User Responsibilities',
      content: 'You agree to use our services only for lawful purposes and in accordance with these Terms of Service.'
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      content: 'All content, features, and functionality of our website are owned by Mridang and are protected by copyright, trademark, and other intellectual property laws.'
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      content: 'All payments must be made through our secure payment gateway. We accept various payment methods as indicated during checkout.'
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      content: 'We strive to deliver products within the estimated timeframe. Shipping costs and delivery times vary based on location and product type.'
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      content: 'Items may be returned within 30 days of purchase. Refunds will be processed according to our return policy.'
    }
  ]

  const userObligations = [
    {
      title: 'Account Security',
      description: 'Maintain the confidentiality of your account credentials and notify us immediately of any unauthorized use.',
      icon: '🔐'
    },
    {
      title: 'Accurate Information',
      description: 'Provide accurate and complete information when creating an account or making a purchase.',
      icon: '📝'
    },
    {
      title: 'Lawful Use',
      description: 'Use our services in compliance with applicable laws and regulations.',
      icon: '⚖️'
    },
    {
      title: 'Respect Others',
      description: 'Treat other users with respect and refrain from harmful or offensive behavior.',
      icon: '🤝'
    }
  ]

  const prohibitedActivities = [
    'Attempting to gain unauthorized access to our systems',
    'Using our services for any illegal or unauthorized purpose',
    'Transmitting viruses, malware, or harmful code',
    'Interfering with the proper functioning of our website',
    'Collecting information about other users without consent',
    'Circumventing our security measures or access restrictions'
  ]

  const liabilityLimitations = [
    {
      title: 'Service Availability',
      description: 'We do not guarantee uninterrupted access to our services.',
      icon: '⏰'
    },
    {
      title: 'Product Accuracy',
      description: 'Product descriptions and images are for illustrative purposes only.',
      icon: '📦'
    },
    {
      title: 'Third-Party Links',
      description: 'We are not responsible for content on external websites.',
      icon: '🔗'
    },
    {
      title: 'User Content',
      description: 'Users are responsible for content they submit to our platform.',
      icon: '💬'
    }
  ]

  return (
    <div className={styles.pageContainer}>
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
            <h1>Terms of Service</h1>
            <p>Please read these terms carefully before using our services.</p>
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
              <FileText size={32} />
            </div>
            <div className={styles.overviewContent}>
              <h2>Agreement Overview</h2>
              <p>
                These Terms of Service constitute a legally binding agreement between you and Mridang Handicrafts.
                By using our website or services, you agree to comply with these terms.
              </p>
              <p className={styles.lastUpdated}>
                <strong>Last Updated:</strong> October 1, 2025
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Overview */}
      <section className={styles.termsOverview}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Key Terms & Conditions</h2>
            <p>Understanding your rights and responsibilities when using our services.</p>
          </div>

          <div className={styles.termsGrid}>
            {termsSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.termCard}
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

      {/* User Obligations */}
      <section className={styles.obligationsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Your Obligations</h2>
            <p>As a user of our services, you agree to the following responsibilities:</p>
          </div>

          <div className={styles.obligationsGrid}>
            {userObligations.map((obligation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.obligationCard}
              >
                <div className={styles.obligationIcon}>{obligation.icon}</div>
                <h3>{obligation.title}</h3>
                <p>{obligation.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Activities */}
      <section className={styles.prohibitedSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Prohibited Activities</h2>
            <p>You may not engage in any of the following activities:</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.prohibitedCard}
          >
            <ul className={styles.prohibitedList}>
              {prohibitedActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Liability Limitations */}
      <section className={styles.liabilitySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Limitations of Liability</h2>
            <p>Important information about our liability and your expectations:</p>
          </div>

          <div className={styles.liabilityGrid}>
            {liabilityLimitations.map((limitation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.liabilityCard}
              >
                <div className={styles.liabilityIcon}>{limitation.icon}</div>
                <h3>{limitation.title}</h3>
                <p>{limitation.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <h2>Questions About Terms?</h2>
            <p>If you have any questions about these Terms of Service, please contact us.</p>

            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <FileText size={20} />
                <div>
                  <h4>Legal Department</h4>
                  <a href="mailto:legal@mridang.co.in">legal@mridang.co.in</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FileText size={20} />
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