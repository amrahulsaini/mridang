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
          {/* Main Heading */}
          <h1 className="hero-title-modern">
            <span className="hero-typed-modern">
              {typed}
              <span className="hero-cursor">|</span>
            </span>
          </h1>
        </motion.div>
      </div>

      <style jsx>{`
        .hero-section-modern {
          position: relative;
          padding: 5rem 1.5rem;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
          border-top: 3px solid #000000;
        }

        .hero-gradient-bg {
          display: block;
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%);
          pointer-events: none;
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
          gap: 0.625rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #000000 0%, #d4af37 100%);
          border: none;
          border-radius: 100px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: white;
          margin-bottom: 2rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .hero-badge-icon {
          color: #fbbf24;
        }

        .hero-title-modern {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
        }

        .hero-typed-modern {
          display: inline-block;
          min-height: 4.5rem;
        }

        .hero-cursor {
          color: #000000;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .hero-subtitle-modern {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #64748b;
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 500;
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
          padding: 1.125rem 2.25rem;
          background: linear-gradient(135deg, #000000 0%, #d4af37 100%);
          color: white;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.0625rem;
          text-decoration: none;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-hero-primary::before {
          display: none;
        }

        .btn-hero-primary:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 
            0 12px 36px rgba(0, 0, 0, 0.4),
            0 6px 16px rgba(0, 0, 0, 0.12);
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
          padding: 1.125rem 2.25rem;
          background: rgba(255, 255, 255, 0.95);
          color: #000000;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.0625rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(10px);
        }

        .btn-hero-secondary:hover {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .hero-trust-indicators {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          padding: 1.75rem 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          max-width: 650px;
          margin: 0 auto;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #334155;
        }

        .trust-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #000000 0%, #d4af37 100%);
          color: white;
          border-radius: 50%;
          font-size: 0.875rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .trust-divider {
          width: 1px;
          height: 28px;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
        }

        @media (max-width: 768px) {
          .hero-section-modern {
            padding: 2rem 1rem;
          }

          .hero-badge {
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
          }

          .hero-title-modern {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }

          .hero-typed-modern {
            min-height: 2.5rem;
          }

          .hero-subtitle-modern {
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }

          .hero-cta-modern {
            flex-direction: column;
            width: 100%;
            gap: 0.75rem;
            margin-bottom: 2rem;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            justify-content: center;
            padding: 0.875rem 1.5rem;
            font-size: 0.9375rem;
          }

          .hero-trust-indicators {
            padding: 1rem;
            gap: 0.75rem;
          }

          .trust-item {
            font-size: 0.8125rem;
          }

          .trust-icon {
            width: 20px;
            height: 20px;
            font-size: 0.625rem;
          }

          .trust-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection

