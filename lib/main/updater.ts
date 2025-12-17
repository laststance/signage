/**
 * Auto-updater module for Signage application.
 * Uses electron-updater with GitHub Releases for automatic updates.
 *
 * @module updater
 */

import type { BrowserWindow } from 'electron'
import log from 'electron-log'
import type { ProgressInfo, UpdateInfo } from 'electron-updater'
import { autoUpdater } from 'electron-updater'

/** Update check interval: 4 hours in milliseconds */
const UPDATE_CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000

/** Startup delay before first update check: 5 seconds */
const STARTUP_DELAY_MS = 5000

/**
 * Configures the auto-updater with security settings and logging.
 * Called once during app initialization.
 */
function configureUpdater(): void {
  // Configure logging
  autoUpdater.logger = log
  log.transports.file.level = 'info'

  // Security configuration
  autoUpdater.allowDowngrade = false // Prevent rollback attacks
  autoUpdater.allowPrerelease = false // Production stability only
  autoUpdater.autoDownload = true // Silent background download
  autoUpdater.autoInstallOnAppQuit = true // Non-intrusive install
}

/**
 * Initializes the auto-updater with event handlers and periodic checks.
 * Should be called after the main window is created.
 *
 * @param mainWindow - The main BrowserWindow instance to send IPC events
 * @example
 * app.whenReady().then(() => {
 *   const mainWindow = createAppWindow()
 *   initializeUpdater(mainWindow)
 * })
 */
export function initializeUpdater(mainWindow: BrowserWindow): void {
  configureUpdater()

  // Event: Checking for update
  autoUpdater.on('checking-for-update', () => {
    log.info('[Updater] Checking for update...')
    mainWindow.webContents.send('update-checking')
  })

  // Event: Update available
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    log.info(`[Updater] Update available: v${info.version}`)
    mainWindow.webContents.send('update-available', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    })
  })

  // Event: No update available
  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    log.info(`[Updater] No update available. Current: v${info.version}`)
    mainWindow.webContents.send('update-not-available')
  })

  // Event: Download progress
  autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    const logMessage = `[Updater] Download: ${progress.percent.toFixed(1)}% (${formatBytes(progress.transferred)}/${formatBytes(progress.total)})`
    log.info(logMessage)

    // Update dock/taskbar progress indicator
    mainWindow.setProgressBar(progress.percent / 100)

    // Send progress to renderer
    mainWindow.webContents.send('update-progress', {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    })
  })

  // Event: Update downloaded and ready to install
  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    log.info(`[Updater] Update downloaded: v${info.version}`)

    // Remove progress indicator
    mainWindow.setProgressBar(-1)

    // Notify renderer
    mainWindow.webContents.send('update-downloaded', {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    })
  })

  // Event: Error during update
  autoUpdater.on('error', (error: Error) => {
    log.error('[Updater] Error:', error.message)
    mainWindow.setProgressBar(-1)
    mainWindow.webContents.send('update-error', error.message)
  })

  // Initial update check after startup delay
  setTimeout(() => {
    log.info('[Updater] Starting initial update check...')
    autoUpdater.checkForUpdates().catch((error) => {
      log.error('[Updater] Initial check failed:', error.message)
    })
  }, STARTUP_DELAY_MS)

  // Periodic update checks
  setInterval(() => {
    log.info('[Updater] Starting periodic update check...')
    autoUpdater.checkForUpdates().catch((error) => {
      log.error('[Updater] Periodic check failed:', error.message)
    })
  }, UPDATE_CHECK_INTERVAL_MS)
}

/**
 * Manually triggers an update check.
 * Can be called from menu or IPC handler.
 *
 * @returns Promise that resolves when check completes
 * @example
 * // From menu click handler
 * checkForUpdates().catch(console.error)
 */
export async function checkForUpdates(): Promise<void> {
  log.info('[Updater] Manual update check triggered')
  await autoUpdater.checkForUpdates()
}

/**
 * Quits the app and installs the downloaded update.
 * Only call this after 'update-downloaded' event.
 *
 * @example
 * // From "Restart to Update" button click
 * quitAndInstall()
 */
export function quitAndInstall(): void {
  log.info('[Updater] Quitting and installing update...')
  autoUpdater.quitAndInstall()
}

/**
 * Formats bytes into human-readable string.
 *
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "10.5 MB")
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}
