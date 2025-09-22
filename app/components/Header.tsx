'use client'

import { useState } from 'react'
import { Home, Info, Phone, User, UserPlus, Search, ShoppingCart, Menu, X } from 'lucide-react'
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
    <header className="header">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="logo-container">
            <div className="logo-image">
              <Image
                src="/logo.png"
                alt="Mridang Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden-mobile">
              <h1 className="logo-text">
                Mridang
              </h1>
              {/* subtitle intentionally removed per design request */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden-mobile flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.key}
                href={item.href}
                className="nav-link"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden-mobile search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Auth & Cart Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button className="relative p-2 text-gray-700 hover:text-red-600 transition-colors" aria-label="Cart">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden-mobile flex items-center gap-2">
              {authItems.map((item, index) => (
                <Link 
                  key={item.key}
                  href={item.href}
                  className={`btn ${index === 0 ? 'btn-secondary' : 'btn-primary'} text-sm inline-flex`}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button - hidden on desktop */}
            <button
              className="visible-mobile p-2 text-gray-700 hover:text-red-600 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="visible-mobile py-4 border-t border-gray-200">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="visible-mobile bg-white border-t border-gray-200 shadow-lg">
          <div className="container py-6">
            {/* Navigation Links */}
            <div className="space-y-4 mb-6">
              {navItems.map((item) => (
                <Link 
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex flex-col gap-3">
              {authItems.map((item, index) => (
                <Link 
                  key={item.key}
                  href={item.href}
                  className={`btn w-full ${index === 0 ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header