'use client'
import { useEffect } from 'react'
import SplashCursor from './SplashCursor'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Full-screen modal for fluid simulation demo
 * Shows interactive WebGL fluid dynamics in default mode
 */
export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Fluid simulation demo"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200 group"
        aria-label="Close demo"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Instructions overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none animate-fade-in-up">
        <p className="text-white/60 text-sm mb-2">
          Move your mouse or touch to create fluid effects
        </p>
        <p className="text-white/40 text-xs">Press ESC or click X to close</p>
      </div>

      {/* Fluid simulation canvas */}
      <SplashCursor />
    </div>
  )
}
