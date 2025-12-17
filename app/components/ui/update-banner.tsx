/**
 * Update banner component - VS Code/Slack style non-intrusive notification.
 * Displays at bottom of window when updates are available or downloaded.
 *
 * @module UpdateBanner
 */

import { AnimatePresence, motion } from 'framer-motion'
import { Download, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'

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

/**
 * Non-intrusive update banner that appears at the bottom of the window.
 * Follows VS Code/Slack UX pattern:
 * - Silent download in background
 * - User controls when to restart
 * - Can dismiss and continue working
 *
 * @example
 * // In App.tsx
 * <SplashCursor />
 * <UpdateBanner />
 */
export function UpdateBanner() {
  const [state, setState] = useState<UpdateState>('idle')
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [progress, setProgress] = useState<UpdateProgress | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
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
  }, [])

  /**
   * Handles the restart action to install update.
   */
  const handleRestart = () => {
    window.api.update.quitAndInstall()
  }

  /**
   * Handles manual update check.
   */
  const handleCheckForUpdates = () => {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
            'flex items-center gap-3 px-4 py-2.5',
            'bg-zinc-900/95 backdrop-blur-sm',
            'border border-zinc-700 rounded-lg shadow-lg',
            'text-sm text-zinc-100',
          )}
        >
          {/* Icon */}
          {state === 'downloading' ? (
            <Download className="size-4 text-blue-400 animate-pulse" />
          ) : state === 'ready' ? (
            <RefreshCw className="size-4 text-green-400" />
          ) : state === 'error' ? (
            <X className="size-4 text-red-400" />
          ) : (
            <Download className="size-4 text-zinc-400" />
          )}

          {/* Message */}
          <span className="text-zinc-200">
            {state === 'downloading' && progress && (
              <>Downloading update... {progress.percent.toFixed(0)}%</>
            )}
            {state === 'ready' && updateInfo && (
              <>Update v{updateInfo.version} ready</>
            )}
            {state === 'available' && updateInfo && (
              <>Update v{updateInfo.version} available</>
            )}
            {state === 'error' && (
              <span className="text-red-300">
                Update failed: {errorMessage || 'Unknown error'}
              </span>
            )}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-2">
            {state === 'ready' && (
              <Button
                size="sm"
                variant="default"
                onClick={handleRestart}
                className="bg-green-600 hover:bg-green-500 text-white h-7 px-3 text-xs"
              >
                Restart
              </Button>
            )}
            {state === 'error' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCheckForUpdates}
                className="h-7 px-3 text-xs border-zinc-600 text-zinc-200 hover:bg-zinc-800"
              >
                Retry
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
