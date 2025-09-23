'use client'

import { motion } from 'framer-motion'
import { Download, Mail, Phone, MapPin, Award, Users, Heart, Star } from 'lucide-react'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
  const stats = [
    { icon: Users, number: "10,000+", label: "Happy Customers" },
    { icon: Award, number: "15+", label: "Years Experience" },
    { icon: Heart, number: "500+", label: "Custom Designs" },
    { icon: Star, number: "4.9", label: "Customer Rating" }
  ]

  const values = [
    {
      title: "Traditional Craftsmanship",
      description: "We preserve ancient techniques passed down through generations, ensuring each piece reflects authentic Indian artistry.",
      icon: "🎨"
    },
    {
      title: "Quality Materials",
      description: "Only the finest materials are selected for our products, from premium woods to authentic fabrics and metals.",
      icon: "⭐"
    },
    {
      title: "Custom Excellence",
      description: "Every piece is crafted with attention to detail, offering personalized solutions for your special occasions.",
      icon: "💎"
    },
    {
      title: "Cultural Heritage",
      description: "We honor Indian traditions while bringing modern elegance to ceremonial and decorative items.",
      icon: "🏛️"
    }
  ]

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">About Mridang</h1>
              <p className="hero-subtitle">
                Crafting Excellence in Traditional Indian Art & Ceremonial Items
              </p>
              <p className="hero-description">
                For over a decade, we have been dedicated to preserving and promoting 
                the rich heritage of Indian craftsmanship through our exquisite collection 
                of handcrafted ceremonial platters, decorative items, and custom designs.
              </p>
            </motion.div>
            
            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="image-container">
                <Image
                  src="/head.jpg"
                  alt="Mridang Founder"
                  width={400}
                  height={500}
                  className="founder-image"
                />
                <div className="image-overlay"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <stat.icon className="stat-icon" />
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <motion.div 
              className="story-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title">Our Story</h2>
              <div className="story-paragraphs">
                <p>
                  Mridang was born from a deep passion for preserving the timeless beauty 
                  of Indian craftsmanship. Founded with the vision of bringing authentic, 
                  handcrafted ceremonial items to modern celebrations, we have grown from 
                  a small artisan workshop to a trusted name in traditional Indian art.
                </p>
                <p>
                  Our journey began with a simple belief: every special occasion deserves 
                  to be celebrated with items that reflect our rich cultural heritage. 
                  From ring platters for engagements to haldi and mehendi ceremony essentials, 
                  each piece tells a story of tradition, craftsmanship, and love.
                </p>
                <p>
                  Today, we collaborate with skilled artisans across India, ensuring that 
                  traditional techniques are preserved while meeting contemporary aesthetic 
                  preferences. Every item in our collection is a testament to the skill, 
                  dedication, and artistic vision of our craftspeople.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="story-logo"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="logo-showcase">
                <Image
                  src="/logo.png"
                  alt="Mridang Logo"
                  width={300}
                  height={300}
                  className="company-logo"
                />
                <p className="logo-caption">
                  Our logo represents the harmony between tradition and modernity
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.div 
            className="section-header centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide our craftsmanship and customer relationships
            </p>
          </motion.div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download PDF Section */}
      <section className="pdf-section">
        <div className="container">
          <motion.div 
            className="pdf-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pdf-content">
              <div className="pdf-info">
                <h3>Complete Company Profile</h3>
                <p>
                  Download our comprehensive company profile to learn more about 
                  our history, values, product range, and commitment to quality.
                </p>
                <ul className="pdf-highlights">
                  <li>Detailed company history and milestones</li>
                  <li>Complete product catalog with specifications</li>
                  <li>Quality assurance and certification details</li>
                  <li>Client testimonials and case studies</li>
                </ul>
              </div>
              <div className="pdf-download">
                <a 
                  href="/aboutus.pdf" 
                  download 
                  className="btn btn-primary pdf-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </a>
                <p className="pdf-size">PDF • 2.5 MB</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <motion.div 
            className="section-header centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              We&apos;d love to hear from you and discuss your ceremonial item needs
            </p>
          </motion.div>
          
          <div className="contact-grid">
            <motion.div 
              className="contact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Mail className="contact-icon" />
              <h4>Email Us</h4>
              <p>info@mridang.com</p>
              <p>orders@mridang.com</p>
            </motion.div>
            
            <motion.div 
              className="contact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Phone className="contact-icon" />
              <h4>Call Us</h4>
              <p>+91 98765 43210</p>
              <p>+91 87654 32109</p>
            </motion.div>
            
            <motion.div 
              className="contact-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <MapPin className="contact-icon" />
              <h4>Visit Us</h4>
              <p>123 Artisan Lane</p>
              <p>Mumbai, Maharashtra 400001</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}