'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
  duration?: number
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 3000
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, newNotification.duration)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />
      case 'error': return <XCircle size={20} />
      case 'warning': return <AlertCircle size={20} />
      default: return <CheckCircle size={20} />
    }
  }

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default: return 'bg-green-50 border-green-200 text-green-800'
    }
  }

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`max-w-sm w-full rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm ${getColors(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={getIconColor(notification.type)}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}