'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

const VideoBanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Auto-play with muted audio for better UX
      video.muted = true
      video.play().catch(console.error)
      
      // Set up loop
      video.addEventListener('ended', () => {
        video.currentTime = 0
        video.play()
      })

      video.addEventListener('loadeddata', () => {
        setIsLoaded(true)
      })
    }
  }, [])

  // Controls removed per design; keep autoplay muted for smooth UX.

  return (
    <section className="relative w-full banner-h overflow-hidden bg-gray-900">
      {/* Video Element */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: isLoaded ? 1 : 1.1, opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        loop
        muted
        playsInline
        preload="metadata"
        poster="/logo.png"
      >
        <source src="/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-start">
  <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl text-white"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <span className="gradient-text">Mridang</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl mb-2 font-medium"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Handcrafted with Love & Tradition
            </motion.p>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl mb-6 text-gray-200"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              Creating masterpieces for your special moments
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <button className="btn btn-primary text-base lg:text-lg px-8 py-3">
                Shop Collection
              </button>
              <button className="btn btn-outline text-white border-white hover:bg-white hover:text-gray-900 text-base lg:text-lg px-8 py-3">
                Our Story
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Controls removed as requested */}

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          className="w-1 h-16 bg-white/60 rounded-full"
          animate={{ 
            height: [64, 48, 64],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <p className="text-white/80 text-sm mt-2 text-center">
          Scroll Down
        </p>
      </motion.div>

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