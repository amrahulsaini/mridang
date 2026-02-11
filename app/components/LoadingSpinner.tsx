'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import './LoadingSpinner.css'

export default function LoadingSpinner() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    window.addEventListener('beforeunload', handleStart)
    
    return () => {
      window.removeEventListener('beforeunload', handleStart)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        {/* Multi-ring spinner */}
        <div className="spinner-modern">
          <div className="spinner-ring-outer"></div>
          <div className="spinner-ring-middle"></div>
          <div className="spinner-ring-inner"></div>
          <div className="spinner-dot"></div>
        </div>
        
        {/* Loading text with gradient */}
        <div className="loading-text-wrapper">
          <p className="loading-text">Loading</p>
          <div className="loading-dots">
            <span className="dot dot-1">•</span>
            <span className="dot dot-2">•</span>
            <span className="dot dot-3">•</span>
          </div>
        </div>
      </div>
    </div>
  )
}
