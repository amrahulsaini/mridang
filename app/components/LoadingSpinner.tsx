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

    // Listen to Next.js router events
    window.addEventListener('beforeunload', handleStart)
    
    return () => {
      window.removeEventListener('beforeunload', handleStart)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  )
}
