'use client'

import { Mail, Phone, MapPin, Instagram, Heart } from 'lucide-react'
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

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/mridang_by_pragyajain' }
    
  ]

  return (
    <footer>
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4" style={{color: '#800020'}}>Stay Connected with Mridang</h3>
            <p className="text-lg mb-6" style={{color: '#4b5563'}}>
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
              <p className="text-gray-600 leading-relaxed mb-4">
                A woman-led handcrafted brand celebrating life&apos;s special moments with 
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
              <h4 className="text-lg font-semibold mb-4" style={{color: '#800020'}}>Quick Links</h4>
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

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{color: '#800020'}}>Get in Touch</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">
                      801, Barkat Nagar, Tonk Phatak<br />
                      Jaipur, Rajasthan 302015<br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <a href="tel:+919413419163" className="text-gray-600 hover:text-red-600 transition-colors">
                      +91 9413419163
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <a href="mailto:support@mridang.co.in" className="text-gray-600 hover:text-red-600 transition-colors">
                      support@mridang.co.in
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-gray-600 text-sm">
              <span>© 2025 Mridang. Made with</span>
              <Heart size={16} className="mx-1 text-red-500 fill-current" />
              <span>in India</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms" className="hover:text-red-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-red-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-red-600 transition-colors">
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