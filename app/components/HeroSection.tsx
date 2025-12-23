'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

function useTypewriter(phrases: string[]) {
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const current = phrases[index] || ''

  useEffect(() => {
    const speed = isDeleting ? 28 : 42
    const pause = 950

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        const next = current.slice(0, typed.length + 1)
        setTyped(next)
        if (next === current) {
          window.setTimeout(() => setIsDeleting(true), pause)
        }
      } else {
        const next = current.slice(0, Math.max(0, typed.length - 1))
        setTyped(next)
        if (next.length === 0) {
          setIsDeleting(false)
          setIndex((i) => (i + 1) % phrases.length)
        }
      }
    }, speed)

    return () => window.clearTimeout(timer)
  }, [current, isDeleting, phrases.length, typed.length])

  return typed
}

const HeroSection = () => {
  const phrases = useMemo(
    () => [
      'Handcrafted platters that look premium in every photo',
      'Custom designs for haldi, mehendi & ring ceremonies',
      'Made to match your theme — clean, elegant, premium'
    ],
    []
  )

  const typed = useTypewriter(phrases)

  return (
    <section className="hero-section">
      <div className="container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            <span className="hero-typed">{typed}</span>
            <span className="hero-caret" aria-hidden="true">|</span>
          </h1>
          <p className="hero-subtitle">
            Ring trays, haldi & mehendi platters, and custom designs — made to match your theme.
          </p>
          <div className="flex items-center justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-primary">Shop all products</Link>
            <Link href="/#categories" className="btn btn-secondary">Browse categories</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
