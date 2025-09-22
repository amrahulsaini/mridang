'use client'

import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Heart,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Contact', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Return Policy', href: '/returns' },
    { name: 'Privacy Policy', href: '/privacy' }
  ]

  const categories = [
    { name: 'Ring Platters', href: '/category/ring-platters' },
    { name: 'Haldi Platters', href: '/category/haldi-platters' },
    { name: 'Mehendi Platters', href: '/category/mehendi-platters' },
    { name: 'Custom Orders', href: '/custom' },
    { name: 'Wedding Essentials', href: '/wedding' },
    { name: 'Gift Collections', href: '/gifts' }
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/mridang', color: 'hover:text-pink-500' },
    { icon: Facebook, href: 'https://facebook.com/mridang', color: 'hover:text-blue-500' },
    { icon: Twitter, href: 'https://twitter.com/mridang', color: 'hover:text-blue-400' },
    { icon: Youtube, href: 'https://youtube.com/mridang', color: 'hover:text-red-500' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <motion.div 
        className="bg-[var(--accent-maroon)] py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Connected with Mridang</h3>
            <p className="text-lg mb-6 opacity-90">
              Get exclusive updates on new collections, special offers, and handcrafting tips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                className="btn bg-white text-[var(--accent-maroon)] hover:bg-gray-100 px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo.png"
                    alt="Mridang Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold">Mridang</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                A woman-led handcrafted brand celebrating life&apos;s special moments with 
                artistry and elegance. Every creation is lovingly handmade using premium materials.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`p-2 bg-gray-800 rounded-full transition-colors ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Categories */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-4">Shop by Category</h4>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link 
                      href={category.href}
                      className="text-gray-300 hover:text-white transition-colors inline-flex items-center group"
                    >
                      <span>{category.name}</span>
                      <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-[var(--accent-maroon)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">
                      123 Artisan Street,<br />
                      Craft District, Mumbai<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-[var(--accent-maroon)] flex-shrink-0" />
                  <div>
                    <a href="tel:+918306916176" className="text-gray-300 hover:text-white transition-colors">
                      +91 8306916176
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-[var(--accent-maroon)] flex-shrink-0" />
                  <div>
                    <a href="mailto:hello@mridang.com" className="text-gray-300 hover:text-white transition-colors">
                      hello@mridang.com
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <motion.a
                href="https://wa.me/918306916176"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={16} className="mr-2" />
                WhatsApp Us
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        className="border-t border-gray-800 py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-gray-400 text-sm">
              <span>© 2025 Mridang. Made with</span>
              <Heart size={16} className="mx-1 text-red-500 fill-current" />
              <span>in India</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer