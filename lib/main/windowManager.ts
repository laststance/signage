/**
 * Window Manager Module
 * Centralized window management for macOS-specific features
 *
 * Handles:
 * - Toggle Signage window visibility (show/hide based on focus state)
 * - Toggle Dock icon visibility (accessory/regular activation policy)
 */
import { app, BrowserWindow, Menu } from 'electron'

/** Reference to the main application window */
let mainWindow: BrowserWindow | null = null

/** Whether the Dock icon is currently hidden */
let isDockIconHidden = false

/** Callback to rebuild the application menu when state changes */
let menuRebuildCallback: (() => Menu) | null = null

/** Callback to rebuild the tray menu when state changes */
let trayRebuildCallback: (() => void) | null = null

/**
 * Sets the main window reference for window management operations.
 * @param win - The BrowserWindow instance to track
 */
export function setMainWindow(win: BrowserWindow): void {
  mainWindow = win

  // Clear reference when window is closed
  win.on('closed', () => {
    mainWindow = null
  })
}

/**
 * Gets the current main window reference.
 * @returns The main BrowserWindow or null if not set/closed
 */
export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

/**
 * Sets the callback function to rebuild the application menu.
 * Called when dock icon visibility changes to update menu labels.
 * @param callback - Function that creates and returns a new Menu
 */
export function setMenuRebuildCallback(callback: () => Menu): void {
  menuRebuildCallback = callback
}

/**
 * Sets the callback function to rebuild the tray menu.
 * Called when dock icon visibility changes to update menu labels.
 *
 * @param callback - Function that rebuilds the tray menu
 */
export function setTrayRebuildCallback(callback: () => void): void {
  trayRebuildCallback = callback
}

/**
 * Toggles the Signage window visibility.
 *
 * Behavior:
 * - If window is focused (at foreground) → hide the window
 * - If window is not focused (hidden, background, other screen) → bring to front
 * - Ensures only one window exists at the foreground
 *
 * @param createWindowFn - Optional function to create a new window if none exists
 */
export function toggleSignageWindow(createWindowFn?: () => void): void {
  const windows = BrowserWindow.getAllWindows()

  // No windows exist - create one if callback provided
  if (windows.length === 0) {
    if (createWindowFn) {
      createWindowFn()
    }
    return
  }

  // Get the main window (first window or tracked reference)
  const targetWindow = mainWindow ?? windows[0]

  // Close extra windows to ensure only one exists
  if (windows.length > 1) {
    for (let i = 0; i < windows.length; i++) {
      if (windows[i] !== targetWindow) {
        windows[i].close()
      }
    }
  }

  // Toggle based on current focus state
  if (targetWindow.isFocused()) {
    // Window is at foreground → hide it
    targetWindow.hide()
  } else {
    // Window is hidden/background/other screen → bring to front
    if (targetWindow.isMinimized()) {
      targetWindow.restore()
    }
    if (!targetWindow.isVisible()) {
      targetWindow.show()
    }
    targetWindow.focus()
    // macOS: steal focus from other apps
    app.focus({ steal: true })
  }
}

/**
 * Toggles the Dock icon visibility on macOS.
 *
 * Uses activation policy:
 * - 'regular': App appears in Dock with menu bar
 * - 'accessory': App hidden from Dock, no menu bar when unfocused
 *
 * Note: When in 'accessory' mode, the app's menu bar is only visible
 * when a window is focused. User must click the window to access menus.
 */
export function toggleDockIcon(): void {
  if (isDockIconHidden) {
    // Show the Dock icon
    app.setActivationPolicy('regular')
    isDockIconHidden = false
  } else {
    // Hide the Dock icon
    app.setActivationPolicy('accessory')
    isDockIconHidden = true
  }

  // Rebuild app menu to update label
  if (menuRebuildCallback) {
    const menu = menuRebuildCallback()
    Menu.setApplicationMenu(menu)
  }

  // Rebuild tray menu to update label
  if (trayRebuildCallback) {
    trayRebuildCallback()
  }
}

/**
 * Returns whether the Dock icon is currently hidden.
 * @returns true if Dock icon is hidden, false otherwise
 */
export function isDockHidden(): boolean {
  return isDockIconHidden
}

/**
 * Sets the Dock icon visibility directly.
 *
 * @param hidden - true to hide the Dock icon, false to show it
 */
export function setDockIconVisibility(hidden: boolean): void {
  if (hidden === isDockIconHidden) {
    return // No change needed
  }

  if (hidden) {
    app.setActivationPolicy('accessory')
    isDockIconHidden = true
  } else {
    app.setActivationPolicy('regular')
    isDockIconHidden = false
  }

  // Rebuild app menu to update label
  if (menuRebuildCallback) {
    const menu = menuRebuildCallback()
    Menu.setApplicationMenu(menu)
  }

  // Rebuild tray menu to update label
  if (trayRebuildCallback) {
    trayRebuildCallback()
  }
}
