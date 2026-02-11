'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import './LoadingSpinner.css'

export default function LoadingSpinner() {
  const [loading, setLoading] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const pathname = usePathname()

  // Hide spinner when pathname changes (navigation complete)
  useEffect(() => {
    if (loading) {
      setFadeOut(true)
      const timer = setTimeout(() => {
        setLoading(false)
        setFadeOut(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  // Intercept all link clicks for SPA navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (href === pathname) return
      setLoading(true)
      setFadeOut(false)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  // Also handle beforeunload for full page navigations
  useEffect(() => {
    const handleBeforeUnload = () => {
      setLoading(true)
      setFadeOut(false)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  if (!loading) return null

  return (
    <div className={`loading-spinner-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-spinner-container">
        <div className="loading-text-wrapper">
          <p className="loading-text">Loading</p>
        </div>
        <div className="spinner-dots">
          <span className="spinner-dot-item spinner-dot-1"></span>
          <span className="spinner-dot-item spinner-dot-2"></span>
          <span className="spinner-dot-item spinner-dot-3"></span>
        </div>
      </div>
    </div>
  )
}
