'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const VideoBanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch(() => {
        // Fallback: ensure muted+autoplay attributes handle it
      })
    }
  }, [])

  return (
    <section className="relative w-full banner-h overflow-hidden" style={{background:'#f9eec8'}}>
      {/* Video Element */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover video-banner-video"
        style={{ objectPosition: 'top' }}
        initial={{ scale: 1.05, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        loop
        muted
        autoPlay
        playsInline
        preload="metadata"
      >
        <source src="/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Overlay Gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      
      {/* Content Overlay removed per request for a clean visual hero */}

  {/* Controls removed as requested */}

      {/* Scroll indicator removed */}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

  {/* Tagline removed for a cleaner hero */}
    </section>
  )
}

export default VideoBanner