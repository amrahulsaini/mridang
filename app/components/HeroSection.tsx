'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react'

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
    <section className="hero-section-modern">
      <div className="hero-gradient-bg"></div>
      
      <div className="container-modern">
        <motion.div 
          className="hero-content-modern"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Accent Badge */}
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles size={16} className="hero-badge-icon" />
            <span>Handcrafted with Love</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="hero-title-modern">
            <span className="hero-typed-modern">
              {typed}
              <span className="hero-cursor">|</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle-modern">
            Ring trays, haldi & mehendi platters, and custom designs — made to match your theme with exceptional craftsmanship.
          </p>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-cta-modern"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href="/shop" className="btn-hero-primary">
              <ShoppingBag size={20} />
              <span>Shop All Products</span>
              <ArrowRight size={18} className="btn-arrow" />
            </Link>
            <Link href="/#categories" className="btn-hero-secondary">
              <span>Browse Categories</span>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="hero-trust-indicators"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>Premium Quality</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>Custom Designs</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <div className="trust-icon">✓</div>
              <span>Fast Delivery</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .hero-section-modern {
          position: relative;
          padding: 6rem 0;
          overflow: hidden;
          background: linear-gradient(180deg, 
            rgba(255, 248, 240, 0.6) 0%, 
            rgba(255, 253, 250, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        .hero-gradient-bg {
          position: absolute;
          top: -50%;
          left: -10%;
          width: 120%;
          height: 200%;
          background: 
            radial-gradient(circle at 30% 40%, rgba(255, 220, 180, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(255, 240, 210, 0.12) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(2deg); }
          66% { transform: translate(-20px, 20px) rotate(-2deg); }
        }

        .hero-content-modern {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #fff5e8 0%, #fffaf0 100%);
          border: 1px solid rgba(212, 165, 116, 0.2);
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #8b6f47;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(212, 165, 116, 0.1);
        }

        .hero-badge-icon {
          color: #d4a574;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .hero-title-modern {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #2d2d2d 0%, #4a4a4a 50%, #2d2d2d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-typed-modern {
          display: inline-block;
          min-height: 4rem;
        }

        .hero-cursor {
          color: #d4a574;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .hero-subtitle-modern {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #6b7280;
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #800020 0%, #a0002a 100%);
          color: white;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1.0625rem;
          text-decoration: none;
          box-shadow: 
            0 4px 16px rgba(128, 0, 32, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-hero-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-hero-primary:hover::before {
          left: 100%;
        }

        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 24px rgba(128, 0, 32, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .btn-arrow {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hero-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          color: #800020;
          border: 2px solid rgba(128, 0, 32, 0.2);
          border-radius: 14px;
          font-weight: 600;
          font-size: 1.0625rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .btn-hero-secondary:hover {
          background: rgba(128, 0, 32, 0.04);
          border-color: rgba(128, 0, 32, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .hero-trust-indicators {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border-radius: 16px;
          border: 1px solid rgba(212, 165, 116, 0.15);
          max-width: 600px;
          margin: 0 auto;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #4a4a4a;
        }

        .trust-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #d4a574 0%, #c89b68 100%);
          color: white;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .trust-divider {
          width: 1px;
          height: 24px;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
        }

        @media (max-width: 768px) {
          .hero-section-modern {
            padding: 4rem 0;
          }

          .hero-title-modern {
            font-size: 2rem;
          }

          .hero-typed-modern {
            min-height: 2.5rem;
          }

          .hero-subtitle-modern {
            font-size: 1.0625rem;
            margin-bottom: 2rem;
          }

          .hero-cta-modern {
            flex-direction: column;
            width: 100%;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            justify-content: center;
          }

          .hero-trust-indicators {
            flex-direction: column;
            gap: 1rem;
          }

          .trust-divider {
            width: 40px;
            height: 1px;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
