'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Star, Quote } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const FAQAndReviews = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const faqs = [
    {
      question: "What materials are used in Mridang products?",
      answer: "We use high-quality MDF, Korean flowers, and premium décor elements. Each piece is handcrafted with attention to detail and durability."
    },
    {
      question: "How long does customization take?",
      answer: "Custom orders typically take 3-5 business days to complete. We'll send you a preview before finalizing your order."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within India. We're working on expanding our shipping to international destinations soon."
    },
    {
      question: "Can I return or exchange products?",
      answer: "Due to the handcrafted and often customized nature of our products, we have a specific return policy. Please contact us within 24 hours of delivery for any issues."
    },
    {
      question: "How do I care for my Mridang products?",
      answer: "Our products are designed to last. Clean gently with a soft cloth, avoid direct sunlight for extended periods, and handle with care."
    }
  ]

  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      comment: "Absolutely beautiful ring platter for our engagement! The customization was perfect and the quality exceeded expectations.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face",
      product: "Custom Ring Platter"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Ordered haldi platter for sister's wedding. Mridang's attention to detail is remarkable. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      product: "Haldi Ceremony Platter"
    },
    {
      id: 3,
      name: "Anita Reddy",
      rating: 5,
      comment: "The mehendi platter was the highlight of our celebration. Beautiful craftsmanship and timely delivery!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      product: "Mehendi Platter"
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-secondary mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <motion.button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFAQ(index)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openFAQ === index ? <Minus size={20} /> : <Plus size={20} />}
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-secondary mb-8">What Our Customers Say</h2>
            
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                >
                  {/* Quote Icon */}
                  <Quote className="absolute top-4 right-4 text-[var(--accent-maroon)] opacity-20" size={24} />
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 italic">&ldquo;{review.comment}&rdquo;</p>
                  
                  {/* Reviewer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={review.image}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{review.name}</p>
                        <p className="text-sm text-gray-500">{review.product}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-gray-600 mb-4">Love our products? Share your experience!</p>
              <button className="btn btn-outline">Write a Review</button>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--accent-maroon)] mb-2">500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--accent-maroon)] mb-2">100%</div>
              <div className="text-sm text-gray-600">Handcrafted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--accent-maroon)] mb-2">3-5</div>
              <div className="text-sm text-gray-600">Days Delivery</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--accent-maroon)] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQAndReviews