'use client';

import { useEffect, useState } from 'react';
import styles from './InstagramReels.module.css';

interface InstagramReelsProps {
  reels: Array<{
    id: number;
    embed_code: string;
  }>;
}

export default function InstagramReels({ reels }: InstagramReelsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Remove any existing Instagram script
    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      // Force process embeds after script loads
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);

    // Retry processing embeds after a delay
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [reels]);

  if (!reels || reels.length === 0) {
    return null;
  }

  return (
    <section className={styles.instagramSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Follow Our Journey</h2>
          <p className={styles.subtitle}>
            See our handcrafted instruments come to life on Instagram
          </p>
        </div>
        
        <div className={styles.reelsGrid}>
          {mounted && reels.map((reel) => (
            <div 
              key={reel.id} 
              className={styles.reelWrapper}
              dangerouslySetInnerHTML={{ __html: reel.embed_code }}
            />
          ))}
        </div>

        <div className={styles.followButton}>
          <a 
            href="https://www.instagram.com/mridang_by_pragyajain/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @mridang_by_pragyajain
          </a>
        </div>
      </div>
    </section>
  );
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
