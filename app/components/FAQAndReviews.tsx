'use client'

import { useState } from 'react'

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
      product: "Custom Ring Platter"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Ordered haldi platter for sister's wedding. Mridang's attention to detail is remarkable. Highly recommended!",
      product: "Haldi Ceremony Platter"
    },
    {
      id: 3,
      name: "Anita Reddy",
      rating: 5,
      comment: "The mehendi platter was the highlight of our celebration. Beautiful craftsmanship and timely delivery!",
      product: "Mehendi Platter"
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-grid">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className={`faq-item ${openFAQ === index ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">
                      {openFAQ === index ? '−' : '+'}
                    </span>
                  </button>
                  
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-900">What Our Customers Say</h2>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  {/* Rating */}
                  <div className="review-rating mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <div className="review-content">
                    &ldquo;{review.comment}&rdquo;
                  </div>
                  
                  {/* Reviewer Info */}
                  <div className="review-header">
                    <div className="review-info">
                      <h4>{review.name}</h4>
                      <div className="review-product">{review.product}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQAndReviews