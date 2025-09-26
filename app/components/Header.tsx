'use client'

import { useState } from 'react'
import { Home, Info, Phone, Search, Menu, X, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { state } = useCart()

  const navItems = [
    { name: 'Home', href: '/', icon: Home, key: 'home' },
    { name: 'About', href: '/about', icon: Info, key: 'about' },
    { name: 'Contact', href: '/contact', icon: Phone, key: 'contact' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="header">
      <div className="container">
  <div className="flex items-center justify-between h-16 gap-3" style={{paddingLeft:0}}>
          {/* Logo Section */}
          <Link href="/" className="logo-container" aria-label="Mridang Home">
            <div className="logo-image">
              <Image
                src="/logo.png"
                alt="Mridang Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="logo-text hidden-mobile">Mridang</h1>
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
          <div className="hidden-mobile search-container" aria-label="Search">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Cart Section */}
          <div className="flex items-center gap-3">
            {/* Desktop Cart Button */}
            <div className="hidden-mobile flex items-center gap-2">
              <Link
                href="/cart"
                className="btn btn-primary inline-flex relative flex-col items-center gap-1"
              >
                <ShoppingCart size={18} />
                {state.totalItems === 0 ? (
                  <span className="text-sm">Cart</span>
                ) : (
                  <span className="bg-red-600 text-white rounded-full text-xs px-2 py-1 font-bold min-w-[1.5rem] text-center">
                    {state.totalItems}
                  </span>
                )}
              </Link>
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

            {/* Cart Button */}
            <div className="flex flex-col gap-3">
              <Link
                href="/cart"
                className="btn btn-primary w-full relative flex flex-col items-center gap-1"
              >
                <ShoppingCart size={18} />
                {state.totalItems === 0 ? (
                  <span className="text-sm">Cart</span>
                ) : (
                  <span className="bg-red-600 text-white rounded-full text-xs px-2 py-1 font-bold min-w-[1.5rem] text-center">
                    {state.totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

    </header>
  )
}

export default Header