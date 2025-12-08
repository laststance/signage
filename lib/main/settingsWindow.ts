/**
 * Settings Window Manager
 * Manages the creation and lifecycle of the Settings window
 */
import { BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'

import { is } from '@electron-toolkit/utils'

/** Reference to the settings window */
let settingsWindow: BrowserWindow | null = null

/**
 * Creates and shows the Settings window.
 * If the window already exists, it will be focused instead.
 */
export function openSettingsWindow(): void {
  // If window already exists, focus it
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 480,
    height: 400,
    minWidth: 400,
    minHeight: 300,
    title: 'Settings',
    show: false,
    resizable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    // macOS specific
    titleBarStyle: 'default',
    vibrancy: 'window',
    visualEffectState: 'active',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Show window when ready
  settingsWindow.once('ready-to-show', () => {
    settingsWindow?.show()
  })

  // Clean up reference when closed
  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  // Open external links in browser
  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the settings page
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(
      `${process.env['ELECTRON_RENDERER_URL']}/settings.html`,
    )
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'))
  }
}

/**
 * Closes the settings window if it exists.
 */
export function closeSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.close()
  }
}

/**
 * Gets the settings window instance.
 */
export function getSettingsWindow(): BrowserWindow | null {
  return settingsWindow
}

/**
 * Registers IPC handlers for settings window operations.
 */
export function registerSettingsWindowIPC(): void {
  ipcMain.handle('open-settings', () => {
    openSettingsWindow()
  })

  ipcMain.handle('close-settings', () => {
    closeSettingsWindow()
  })
}
