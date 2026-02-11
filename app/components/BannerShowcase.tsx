'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './BannerShowcase.module.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const banners = [
  '/banners/ban1.jpeg',
  '/banners/ban2.jpeg',
  '/banners/ban3.jpeg',
  '/banners/ban4.jpeg',
]

export default function BannerShowcase() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000) // Change banner every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000) // Resume auto-play after 8 seconds
  }

  const goToPrevious = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const goToSlide = (index: number) => {
    setCurrentBanner(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  return (
    <section className={styles.bannerShowcase}>
      <div className={styles.container}>
        {/* Main Banner Display */}
        <div className={`${styles.bannerWrapper} ${isLoaded ? styles.loaded : ''}`}>
          <div 
            className={styles.bannersTrack}
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={index} className={styles.bannerSlide}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={banner}
                    alt={`Featured collection ${index + 1}`}
                    fill
                    priority={index === 0}
                    className={styles.bannerImage}
                    sizes="100vw"
                    quality={90}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Modern Gradient Overlays */}
          <div className={styles.gradientOverlay} />
          <div className={styles.gradientOverlayTop} />

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            aria-label="Previous banner"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            className={`${styles.navButton} ${styles.navButtonRight}`}
            aria-label="Next banner"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dot Indicators */}
          <div className={styles.indicators}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.indicator} ${
                  index === currentBanner ? styles.indicatorActive : ''
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          {isAutoPlaying && (
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{
                  animation: 'progress 4s linear',
                  animationPlayState: isAutoPlaying ? 'running' : 'paused'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
