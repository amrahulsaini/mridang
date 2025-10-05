'use client';

import { useEffect } from 'react';
import styles from './InstagramReels.module.css';

interface InstagramReelsProps {
  reels: Array<{
    id: number;
    embed_code: string;
  }>;
}

export default function InstagramReels({ reels }: InstagramReelsProps) {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Process embeds after script loads
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
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
          {reels.map((reel) => (
            <div 
              key={reel.id} 
              className={styles.reelWrapper}
              dangerouslySetInnerHTML={{ __html: reel.embed_code }}
            />
          ))}
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
