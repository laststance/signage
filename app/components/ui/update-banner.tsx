/**
 * Update banner component - VS Code/Slack style non-intrusive notification.
 * Displays at bottom of window when updates are available or downloaded.
 * Uses React Portal to render outside of overflow-hidden containers for correct positioning.
 *
 * @module UpdateBanner
 */

import { AnimatePresence, motion } from 'framer-motion'
import { Download, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/app/lib/utils'

import { Button } from './button'

/** Update state types */
type UpdateState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'ready'
  | 'error'

/** Update info from main process */
interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseNotes?: string | null
}

/** Download progress from main process */
interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}

/** Props for UpdateBanner component */
interface UpdateBannerProps {
  /**
   * Demo mode for development/testing. When set, forces the banner to display
   * in the specified state with mock data. Set to undefined for production use.
   * @example <UpdateBanner demoState="ready" />
   */
  demoState?: UpdateState
}

/**
 * Non-intrusive update banner that appears at the bottom of the window.
 * Follows VS Code/Slack UX pattern:
 * - Silent download in background
 * - User controls when to restart
 * - Can dismiss and continue working
 *
 * @param props - Component props
 * @param props.demoState - Optional demo state for testing/development
 * @example
 * // Production use in App.tsx
 * <SplashCursor />
 * <UpdateBanner />
 *
 * @example
 * // Development/testing - show "ready" state
 * <UpdateBanner demoState="ready" />
 */
export function UpdateBanner({ demoState }: UpdateBannerProps) {
  const [state, setState] = useState<UpdateState>(demoState ?? 'idle')
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(
    demoState ? { version: '2.0.0', releaseDate: '2025-01-15' } : null,
  )
  const [progress, setProgress] = useState<UpdateProgress | null>(
    demoState === 'downloading'
      ? {
          percent: 67,
          bytesPerSecond: 1024000,
          transferred: 5000000,
          total: 7500000,
        }
      : null,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(
    demoState === 'error' ? 'Network connection failed' : null,
  )
  const [isDismissed, setIsDismissed] = useState(false)

  // Update state when demoState prop changes
  useEffect(() => {
    if (demoState !== undefined) {
      setState(demoState)
      setIsDismissed(false)
      if (demoState === 'downloading') {
        setProgress({
          percent: 67,
          bytesPerSecond: 1024000,
          transferred: 5000000,
          total: 7500000,
        })
      }
      if (demoState === 'error') {
        setErrorMessage('Network connection failed')
      }
      if (demoState === 'available' || demoState === 'ready') {
        setUpdateInfo({ version: '2.0.0', releaseDate: '2025-01-15' })
      }
    }
  }, [demoState])

  useEffect(() => {
    // Skip IPC setup in demo mode or when window.api is not available
    if (
      demoState !== undefined ||
      typeof window === 'undefined' ||
      !window.api?.update
    ) {
      return
    }

    const api = window.api

    // Register event listeners
    api.update.onChecking(() => {
      setState('checking')
      setIsDismissed(false)
    })

    api.update.onUpdateAvailable((info) => {
      setState('available')
      setUpdateInfo(info)
      setIsDismissed(false)
    })

    api.update.onUpdateNotAvailable(() => {
      setState('idle')
    })

    api.update.onProgress((prog) => {
      setState('downloading')
      setProgress(prog)
    })

    api.update.onUpdateDownloaded((info) => {
      setState('ready')
      setUpdateInfo(info)
      setProgress(null)
      setIsDismissed(false)
    })

    api.update.onError((message) => {
      setState('error')
      setErrorMessage(message)
      setProgress(null)
    })

    // Cleanup listeners on unmount
    return () => {
      api.update.removeAllListeners()
    }
  }, [demoState])

  /**
   * Handles the restart action to install update.
   */
  const handleRestart = () => {
    if (demoState !== undefined) {
      // In demo mode, just dismiss the banner
      setIsDismissed(true)
      return
    }
    window.api.update.quitAndInstall()
  }

  /**
   * Handles manual update check.
   */
  const handleCheckForUpdates = () => {
    if (demoState !== undefined) {
      // In demo mode, just dismiss the banner
      setIsDismissed(true)
      return
    }
    window.api.update.checkForUpdates()
  }

  /**
   * Dismisses the banner.
   */
  const handleDismiss = () => {
    setIsDismissed(true)
  }

  // Determine if banner should be visible
  const isVisible =
    !isDismissed &&
    (state === 'available' ||
      state === 'downloading' ||
      state === 'ready' ||
      state === 'error')

  /**
   * Renders the banner content.
   * Uses Portal to escape overflow-hidden containers in Electron.
   */
  const bannerContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 350,
            mass: 0.8,
          }}
          role="status"
          aria-live="polite"
          className={cn(
            // Position: fixed to viewport, bottom with 16px margin, centered
            'fixed bottom-4 left-1/2 -translate-x-1/2',
            // Stacking: above all content
            'z-[9999]',
            // Layout: horizontal flex with consistent gaps
            'flex items-center gap-3',
            // Spacing: 16px horizontal, 12px vertical (4/8 grid compliant)
            'px-4 py-3',
            // Background: semi-transparent with blur for depth
            'bg-zinc-900/95 backdrop-blur-md',
            // Border & shape: subtle border, 12px radius per HIG hierarchy
            'border border-zinc-700/80 rounded-xl',
            // Shadow: layered for depth perception
            'shadow-lg shadow-black/30',
            // Typography
            'text-sm text-zinc-100',
          )}
        >
          {/* Status Icon - 20px for visibility */}
          <div className="flex-shrink-0">
            {state === 'downloading' ? (
              <Download
                className="size-5 text-blue-400"
                aria-hidden="true"
                style={{
                  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            ) : state === 'ready' ? (
              <RefreshCw
                className="size-5 text-emerald-400"
                aria-hidden="true"
              />
            ) : state === 'error' ? (
              <X className="size-5 text-red-400" aria-hidden="true" />
            ) : (
              <Download className="size-5 text-zinc-400" aria-hidden="true" />
            )}
          </div>

          {/* Message - flexible width */}
          <span className="text-zinc-200 select-none">
            {state === 'downloading' && progress && (
              <span className="flex items-center gap-2">
                <span>Downloading update...</span>
                <span className="tabular-nums font-medium text-zinc-100">
                  {progress.percent.toFixed(0)}%
                </span>
              </span>
            )}
            {state === 'ready' && updateInfo && (
              <>
                Update{' '}
                <span className="font-medium text-zinc-100">
                  v{updateInfo.version}
                </span>{' '}
                ready
              </>
            )}
            {state === 'available' && updateInfo && (
              <>
                Update{' '}
                <span className="font-medium text-zinc-100">
                  v{updateInfo.version}
                </span>{' '}
                available
              </>
            )}
            {state === 'error' && (
              <span className="text-red-300">
                Update failed: {errorMessage || 'Unknown error'}
              </span>
            )}
          </span>

          {/* Action Buttons - 44px min touch target */}
          <div className="flex items-center gap-2 ml-1">
            {state === 'ready' && (
              <Button
                size="sm"
                variant="default"
                onClick={handleRestart}
                className={cn(
                  // Size: compact height for desktop (32px)
                  'h-8 min-w-[72px] px-3',
                  // Colors: emerald for positive action
                  'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700',
                  'text-white font-medium text-sm',
                  // Focus state for keyboard navigation
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-emerald-400 focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-zinc-900',
                  // Transition
                  'transition-colors duration-150',
                )}
              >
                Restart
              </Button>
            )}
            {state === 'error' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCheckForUpdates}
                className={cn(
                  // Size: compact height for desktop (32px)
                  'h-8 min-w-[64px] px-3',
                  // Colors: subtle outline style
                  'border-zinc-600 text-zinc-200',
                  'hover:bg-zinc-800 hover:border-zinc-500',
                  'active:bg-zinc-700',
                  'text-sm',
                  // Focus state for keyboard navigation
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-zinc-900',
                  // Transition
                  'transition-colors duration-150',
                )}
              >
                Retry
              </Button>
            )}

            {/* Dismiss Button - 44x44px touch target */}
            <button
              onClick={handleDismiss}
              className={cn(
                // Size: exactly 44x44px for touch target
                'flex items-center justify-center',
                'size-11 -mr-1',
                // Shape & colors
                'rounded-lg',
                'text-zinc-400 hover:text-zinc-100',
                'hover:bg-zinc-800 active:bg-zinc-700',
                // Focus state for keyboard navigation
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-zinc-900',
                // Transition
                'transition-colors duration-150',
              )}
              aria-label="Dismiss update notification"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use Portal to render at document.body level
  // This ensures fixed positioning works correctly in Electron's renderer
  return createPortal(bannerContent, document.body)
}
