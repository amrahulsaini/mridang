'use client'

import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
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
    { name: 'Wedding Essentials', href: '/wedding' }
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/mridang' },
    { icon: Facebook, href: 'https://facebook.com/mridang' },
    { icon: Twitter, href: 'https://twitter.com/mridang' },
    { icon: Youtube, href: 'https://youtube.com/mridang' }
  ]

  return (
    <footer>
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Connected with Mridang</h3>
            <p className="text-lg text-white mb-6 opacity-90">
              Get exclusive updates on new collections, special offers, and handcrafting tips
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="btn btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo.png"
                    alt="Mridang Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3>Mridang</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                A woman-led handcrafted brand celebrating life's special moments with 
                artistry and elegance. Every creation is lovingly handmade using premium materials.
              </p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Shop by Category</h4>
              <ul className="footer-links">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link href={category.href}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">
                      123 Artisan Street,<br />
                      Craft District, Mumbai<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <a href="tel:+918306916176" className="text-gray-300 hover:text-white transition-colors">
                      +91 8306916176
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <a href="mailto:hello@mridang.com" className="text-gray-300 hover:text-white transition-colors">
                      hello@mridang.com
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <a
                href="https://wa.me/918306916176"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors mt-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={16} className="mr-2" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-gray-400 text-sm">
              <span>© 2025 Mridang. Made with</span>
              <Heart size={16} className="mx-1 text-red-500 fill-current" />
              <span>in India</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
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
      </div>
    </footer>
  )
}

export default Footer