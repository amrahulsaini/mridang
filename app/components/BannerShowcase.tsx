'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './BannerShowcase.module.css'

const banners = [
  '/banners/ban1.jpeg',
  '/banners/ban2.jpeg',
  '/banners/ban3.jpeg',
  '/banners/ban4.jpeg',
]

export default function BannerShowcase() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [nextBanner, setNextBanner] = useState(1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      const next = (currentBanner + 1) % banners.length
      setNextBanner(next)
      
      setTimeout(() => {
        setCurrentBanner(next)
        setIsAnimating(false)
      }, 1500) // Animation duration
    }, 3000) // Change banner every 3 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentBanner])

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    if (index === currentBanner || isAnimating) return
    
    setIsAnimating(true)
    setNextBanner(index)
    setIsAutoPlaying(false)
    
    setTimeout(() => {
      setCurrentBanner(index)
      setIsAnimating(false)
    }, 1500)
  }

  return (
    <section className={styles.bannerShowcase}>
      <div className={styles.container}>
        {/* Main Banner Display */}
        <div className={styles.bannerWrapper}>
          {/* Current Banner */}
          <div className={`${styles.bannerLayer} ${isAnimating ? styles.bannerLayerExit : ''}`}>
            <div className={styles.imageWrapper}>
              <Image
                src={banners[currentBanner]}
                alt={`Featured banner ${currentBanner + 1}`}
                fill
                priority
                className={styles.bannerImage}
                sizes="100vw"
              />
            </div>
          </div>

          {/* Next Banner (during transition) */}
          {isAnimating && (
            <div className={styles.bannerLayer}>
              <div className={styles.imageWrapper}>
                <Image
                  src={banners[nextBanner]}
                  alt={`Featured banner ${nextBanner + 1}`}
                  fill
                  className={styles.bannerImage}
                  sizes="100vw"
                />
              </div>
              {/* Pixel Grid Overlay */}
              <div className={styles.pixelGrid}>
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className={styles.pixelTile} style={{ '--delay': `${i * 0.01}s` } as React.CSSProperties} />
                ))}
              </div>
            </div>
          )}

          <div className={styles.gradientOverlay} />

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

        </div>

        {/* Thumbnail Preview (Hidden on Mobile) */}
        <div className={styles.thumbnailsWrapper}>
          {banners.map((banner, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.thumbnail} ${
                index === currentBanner ? styles.thumbnailActive : ''
              }`}
            >
              <Image
                src={banner}
                alt={`Thumbnail ${index + 1}`}
                fill
                className={styles.thumbnailImage}
                sizes="150px"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
