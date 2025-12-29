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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 3000) // Change banner every 3 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentBanner(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className={styles.bannerShowcase}>
      <div className={styles.container}>
        {/* Main Banner Display */}
        <div className={styles.bannerWrapper}>
          <div 
            className={styles.bannersTrack}
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={index} className={styles.bannerSlide}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={banner}
                    alt={`Featured banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    className={styles.bannerImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                  {/* Gradient Overlay for better text visibility if needed */}
                  <div className={styles.gradientOverlay} />
                </div>
              </div>
            ))}
          </div>

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
