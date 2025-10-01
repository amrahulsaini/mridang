'use client'

import { motion } from 'framer-motion'
import { Cookie, Settings, BarChart3, Shield, Eye, X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './Cookies.module.css'

export default function CookiesPage() {
  const cookieTypes = [
    {
      icon: Settings,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. These cannot be disabled.',
      purpose: 'Enable core functionality like security, network management, and accessibility.',
      examples: ['Session management', 'Security features', 'Load balancing']
    },
    {
      icon: BarChart3,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      purpose: 'Collect information about website usage to improve our services.',
      examples: ['Page views', 'Traffic sources', 'User behavior patterns']
    },
    {
      icon: Cookie,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization.',
      purpose: 'Remember your preferences and provide enhanced features.',
      examples: ['Language settings', 'Shopping cart', 'User preferences']
    },
    {
      icon: Eye,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
      purpose: 'Show you relevant ads and measure advertising campaign performance.',
      examples: ['Ad targeting', 'Campaign tracking', 'Retargeting']
    }
  ]

  const cookieList = [
    {
      name: 'session_token',
      type: 'Essential',
      purpose: 'Maintains user session during browsing',
      duration: 'Session'
    },
    {
      name: '_ga',
      type: 'Analytics',
      purpose: 'Google Analytics tracking',
      duration: '2 years'
    },
    {
      name: '_gid',
      type: 'Analytics',
      purpose: 'Google Analytics session tracking',
      duration: '24 hours'
    },
    {
      name: 'cart_items',
      type: 'Functional',
      purpose: 'Stores shopping cart contents',
      duration: '30 days'
    },
    {
      name: 'user_preferences',
      type: 'Functional',
      purpose: 'Remembers user settings and preferences',
      duration: '1 year'
    },
    {
      name: 'marketing_id',
      type: 'Marketing',
      purpose: 'Tracks marketing campaign interactions',
      duration: '90 days'
    }
  ]

  const cookieControls = [
    {
      title: 'Browser Settings',
      description: 'Most browsers allow you to control cookies through their settings preferences.',
      icon: '🌐',
      steps: [
        'Open browser settings',
        'Find privacy or security section',
        'Adjust cookie preferences',
        'Save changes and refresh'
      ]
    },
    {
      title: 'Our Cookie Banner',
      description: 'Use our website cookie banner to manage your preferences directly.',
      icon: '📢',
      steps: [
        'Look for cookie banner on website',
        'Click "Manage Preferences"',
        'Select desired cookie categories',
        'Save your choices'
      ]
    },
    {
      title: 'Opt-out Links',
      description: 'Use third-party opt-out tools to disable specific tracking cookies.',
      icon: '🚫',
      steps: [
        'Visit third-party opt-out pages',
        'Follow opt-out instructions',
        'Clear existing cookies',
        'Test your preferences'
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
            <h1>Cookie Policy</h1>
            <p>Learn about how we use cookies to improve your browsing experience.</p>
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
              <Cookie size={32} />
            </div>
            <div className={styles.overviewContent}>
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit our website.
                They help us provide you with a better browsing experience by remembering your preferences and understanding how you use our site.
              </p>
              <p className={styles.lastUpdated}>
                <strong>Last Updated:</strong> October 1, 2025
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className={styles.cookieTypes}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Types of Cookies We Use</h2>
            <p>We use different types of cookies for various purposes on our website.</p>
          </div>

          <div className={styles.typesGrid}>
            {cookieTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.typeCard}
              >
                <div className={styles.typeIcon}>
                  <type.icon size={24} />
                </div>
                <h3>{type.title}</h3>
                <p className={styles.typeDescription}>{type.description}</p>
                <div className={styles.typeDetails}>
                  <h4>Purpose:</h4>
                  <p>{type.purpose}</p>
                  <h4>Examples:</h4>
                  <ul>
                    {type.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie List */}
      <section className={styles.cookieListSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Cookies We Use</h2>
            <p>Detailed list of cookies used on our website and their purposes.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.cookieTable}
          >
            <div className={styles.tableHeader}>
              <div>Cookie Name</div>
              <div>Type</div>
              <div>Purpose</div>
              <div>Duration</div>
            </div>
            {cookieList.map((cookie, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.cookieName}>{cookie.name}</div>
                <div className={styles.cookieType}>{cookie.type}</div>
                <div className={styles.cookiePurpose}>{cookie.purpose}</div>
                <div className={styles.cookieDuration}>{cookie.duration}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cookie Controls */}
      <section className={styles.controlsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Managing Your Cookie Preferences</h2>
            <p>You have control over how cookies are used on our website.</p>
          </div>

          <div className={styles.controlsGrid}>
            {cookieControls.map((control, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.controlCard}
              >
                <div className={styles.controlIcon}>{control.icon}</div>
                <h3>{control.title}</h3>
                <p>{control.description}</p>
                <div className={styles.controlSteps}>
                  <h4>Steps:</h4>
                  <ol>
                    {control.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className={styles.noticeSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.noticeCard}
          >
            <div className={styles.noticeIcon}>
              <Shield size={24} />
            </div>
            <div className={styles.noticeContent}>
              <h2>Important Notice</h2>
              <p>
                Please note that disabling certain cookies may affect the functionality of our website.
                Essential cookies cannot be disabled as they are necessary for the website to function properly.
              </p>
              <p>
                For more information about cookies and your privacy rights, please review our Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <h2>Questions About Cookies?</h2>
            <p>If you have any questions about our cookie policy or need assistance managing your preferences, please contact us.</p>

            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <Cookie size={20} />
                <div>
                  <h4>Privacy Team</h4>
                  <a href="mailto:privacy@mridang.co.in">privacy@mridang.co.in</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Cookie size={20} />
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