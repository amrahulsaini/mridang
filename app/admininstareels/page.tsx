'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminInstaReels.module.css';

interface Reel {
  id?: number;
  embed_code: string;
  display_order?: number;
}

export default function AdminInstaReels() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchReels();
    }
  }, [isAuthenticated]);

  const fetchReels = async () => {
    try {
      const response = await fetch('/api/admin/instagram-reels');
      const data = await response.json();
      
      if (data.reels && data.reels.length > 0) {
        setReels(data.reels);
      } else {
        // Initialize with empty reels if none exist
        setReels([{ embed_code: '' }, { embed_code: '' }, { embed_code: '' }]);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
      setReels([{ embed_code: '' }, { embed_code: '' }, { embed_code: '' }]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Password will be verified on the server
    setIsAuthenticated(true);
  };

  const handleUpdateReels = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/instagram-reels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          reels: reels.filter(reel => reel.embed_code.trim() !== ''),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Instagram reels updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update reels');
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      setError('An error occurred while updating reels');
      console.error('Error updating reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReelChange = (index: number, value: string) => {
    const newReels = [...reels];
    newReels[index] = { ...newReels[index], embed_code: value };
    setReels(newReels);
  };

  const addReel = () => {
    setReels([...reels, { embed_code: '' }]);
  };

  const removeReel = (index: number) => {
    if (reels.length > 1) {
      const newReels = reels.filter((_, i) => i !== index);
      setReels(newReels);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Manage Instagram Reels</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.adminPanel}>
        <div className={styles.header}>
          <h1 className={styles.title}>Manage Instagram Reels</h1>
          <button
            onClick={() => router.push('/')}
            className={styles.backButton}
          >
            ← Back to Home
          </button>
        </div>

        <div className={styles.instructions}>
          <h3>How to add Instagram Reels:</h3>
          <ol>
            <li>Go to the Instagram reel you want to embed</li>
            <li>Click the three dots (...) menu</li>
            <li>Select "Embed"</li>
            <li>Copy the entire embed code</li>
            <li>Paste it into the textarea below</li>
          </ol>
        </div>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleUpdateReels} className={styles.form}>
          {reels.map((reel, index) => (
            <div key={index} className={styles.reelItem}>
              <div className={styles.reelHeader}>
                <h3>Reel {index + 1}</h3>
                {reels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReel(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                value={reel.embed_code}
                onChange={(e) => handleReelChange(index, e.target.value)}
                placeholder="Paste Instagram embed code here..."
                className={styles.textarea}
                rows={6}
              />
            </div>
          ))}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={addReel}
              className={styles.addButton}
            >
              + Add Another Reel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Updating...' : 'Update Reels'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
