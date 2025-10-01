'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RefreshCw, Shield, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './Returns.module.css'

export default function ReturnsPage() {
  const returnPolicy = [
    {
      icon: Clock,
      title: '30-Day Return Window',
      description: 'You have 30 days from delivery to initiate a return for most items.',
      details: 'Custom and personalized items may have different policies.'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'All our handcrafted items come with our quality assurance guarantee.',
      details: 'We stand behind the craftsmanship and materials used.'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns Process',
      description: 'Simple online return requests with prepaid return shipping labels.',
      details: 'Most returns are processed within 5-7 business days.'
    }
  ]

  const returnConditions = [
    {
      icon: CheckCircle,
      title: 'Eligible for Return',
      items: [
        'Items in original condition and packaging',
        'Items with all original tags and labels attached',
        'Items that are unused and unwashed',
        'Items purchased within the last 30 days',
        'Items that arrived damaged or defective'
      ]
    },
    {
      icon: XCircle,
      title: 'Not Eligible for Return',
      items: [
        'Custom or personalized items',
        'Items damaged due to misuse or normal wear',
        'Items missing original packaging or tags',
        'Items purchased during sale or clearance',
        'Perishable or consumable items'
      ]
    }
  ]

  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Contact our support team or start a return request through your order dashboard.',
      icon: '📝'
    },
    {
      step: 2,
      title: 'Package Item',
      description: 'Carefully package the item in its original packaging with all accessories.',
      icon: '📦'
    },
    {
      step: 3,
      title: 'Ship Back',
      description: 'Use the prepaid return label we provide for free return shipping.',
      icon: '🚚'
    },
    {
      step: 4,
      title: 'Refund Processed',
      description: 'Once received and inspected, your refund will be processed within 3-5 business days.',
      icon: '💰'
    }
  ]

  const faqs = [
    {
      question: 'How long do I have to return an item?',
      answer: 'You have 30 days from the date of delivery to initiate a return. For defective items, please contact us immediately.'
    },
    {
      question: 'Will I get a full refund?',
      answer: 'Yes, eligible returns receive a full refund to your original payment method. Shipping charges are not refundable unless the item was defective.'
    },
    {
      question: 'What if my item arrives damaged?',
      answer: 'Please take photos of the damaged item and packaging, then contact us within 48 hours of delivery. We\'ll arrange a replacement or full refund.'
    },
    {
      question: 'Can I exchange an item for a different size/color?',
      answer: 'Exchanges are treated as returns followed by a new purchase. Contact us to discuss your options.'
    },
    {
      question: 'Do I have to pay for return shipping?',
      answer: 'No, we provide prepaid return shipping labels for all approved returns. Simply print the label and drop off at any shipping location.'
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
            <h1>Returns & Exchanges</h1>
            <p>Not satisfied with your purchase? We make returns easy and hassle-free.</p>
          </motion.div>
        </div>
      </section>

      {/* Return Policy Overview */}
      <section className={styles.policySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Return Promise</h2>
            <p>We&apos;re committed to your satisfaction with every handcrafted purchase.</p>
          </div>

          <div className={styles.policyGrid}>
            {returnPolicy.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.policyCard}
              >
                <div className={styles.policyIcon}>
                  <policy.icon size={32} />
                </div>
                <h3>{policy.title}</h3>
                <p className={styles.description}>{policy.description}</p>
                <p className={styles.details}>{policy.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className={styles.conditionsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Return Eligibility</h2>
            <p>Check if your item qualifies for return or exchange.</p>
          </div>

          <div className={styles.conditionsGrid}>
            {returnConditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={styles.conditionCard}
              >
                <div className={styles.conditionHeader}>
                  <div className={styles.conditionIcon}>
                    <condition.icon size={24} />
                  </div>
                  <h3>{condition.title}</h3>
                </div>
                <ul className={styles.conditionList}>
                  {condition.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How to Return an Item</h2>
            <p>Follow these simple steps to return your purchase.</p>
          </div>

          <div className={styles.processGrid}>
            {returnProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={styles.processStep}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepNumber}>{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className={styles.noticeSection}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={styles.noticeCard}
          >
            <div className={styles.noticeIcon}>
              <AlertTriangle size={24} />
            </div>
            <div className={styles.noticeContent}>
              <h3>Important Notice</h3>
              <p>
                Custom and personalized items cannot be returned unless they arrive damaged or defective.
                For all returns, please ensure items are in their original condition with all tags and packaging intact.
                Contact our support team at <a href="mailto:support@mridang.co.in">support@mridang.co.in</a> to initiate your return.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common return and exchange questions.</p>
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
            <h2>Need Help with a Return?</h2>
            <p>Our customer support team is here to assist you with your return or exchange.</p>
            <div className={styles.contactButtons}>
              <Link href="/contact" className={styles.contactBtn}>
                Start Return Process
              </Link>
              <a href="mailto:support@mridang.co.in" className={styles.emailBtn}>
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}