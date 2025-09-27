// Shared OTP store for the application
// In production, replace this with Redis or a database

interface OTPData {
  otp: string
  expiresAt: number
}

class OTPStore {
  private store = new Map<string, OTPData>()

  // Clean up expired OTPs periodically
  private cleanup() {
    const now = Date.now()
    for (const [email, data] of this.store.entries()) {
      if (now > data.expiresAt) {
        this.store.delete(email)
      }
    }
  }

  set(email: string, data: OTPData) {
    this.cleanup()
    this.store.set(email, data)
  }

  get(email: string): OTPData | undefined {
    this.cleanup()
    return this.store.get(email)
  }

  delete(email: string) {
    this.store.delete(email)
  }

  has(email: string): boolean {
    this.cleanup()
    return this.store.has(email)
  }
}

// Export a singleton instance
export const otpStore = new OTPStore()