'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Info, 
  Phone, 
  User, 
  UserPlus, 
  Search, 
  ShoppingCart, 
  Menu, 
  X 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navItems = [
    { name: 'Home', href: '/', icon: Home, key: 'home' },
    { name: 'About', href: '/about', icon: Info, key: 'about' },
    { name: 'Contact', href: '/contact', icon: Phone, key: 'contact' },
  ]

  const authItems = [
    { name: 'Sign In', href: '/signin', icon: User, key: 'signin' },
    { name: 'Sign Up', href: '/signup', icon: UserPlus, key: 'signup' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <Image
                  src="/logo.png"
                  alt="Mridang Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold gradient-text">
                  Mridang
                </h1>
                <p className="text-xs text-gray-600">
                  Handcrafted with Love
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-[var(--accent-maroon)] transition-colors duration-300 font-medium"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <motion.div 
              className="relative w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-maroon)] focus:border-transparent transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* Auth & Cart Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button className="p-2 text-gray-700 hover:text-[var(--accent-maroon)] transition-colors duration-300">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-[var(--accent-maroon)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </motion.div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {authItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                >
                  <Link 
                    href={item.href}
                    className={`btn ${index === 0 ? 'btn-outline' : 'btn-primary'} text-sm`}
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-gray-700 hover:text-[var(--accent-maroon)] transition-colors duration-300"
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-gray-200"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-maroon)] focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="container mx-auto px-4 py-6">
              {/* Navigation Links */}
              <div className="space-y-4 mb-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link 
                      href={item.href}
                      className="flex items-center space-x-3 text-gray-700 hover:text-[var(--accent-maroon)] transition-colors duration-300 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col space-y-3">
                {authItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  >
                    <Link 
                      href={item.href}
                      className={`btn w-full ${index === 0 ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header