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

/** User preference; focused windows must retain the native application menu. */
let hideDockIconInBackground = false

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
 * Keeps the native menu accessible while any Signage window is focused.
 *
 * Called by {@link setDockIconVisibility} and the application focus listeners.
 * macOS accessory apps have no application menu, even with a focused window.
 */
function syncDockIconVisibility(): void {
  const hidden =
    hideDockIconInBackground && BrowserWindow.getFocusedWindow() === null

  // Avoid repeating activation changes, which can themselves affect focus.
  if (hidden === isDockIconHidden) return

  isDockIconHidden = hidden
  app.setActivationPolicy(hidden ? 'accessory' : 'regular')
}

/**
 * Registers application-wide focus handling before startup creates windows.
 *
 * Called once by the main entry point so both the screensaver and Settings
 * restore their application menu without changing the saved Dock preference.
 */
export function initializeDockIconVisibility(): void {
  app.on('browser-window-focus', syncDockIconVisibility)
  app.on('browser-window-blur', () => {
    // Let focus transfer to another Signage window before hiding its menu.
    setImmediate(syncDockIconVisibility)
  })
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
 * Toggles the background Dock preference through {@link setDockIconVisibility}.
 *
 * Focused windows keep the Dock icon and application menu available.
 */
export function toggleDockIcon(): void {
  setDockIconVisibility(!hideDockIconInBackground)
}

/**
 * Returns whether the Dock icon is currently hidden.
 * @returns true if Dock icon is hidden, false otherwise
 */
export function isDockHidden(): boolean {
  return isDockIconHidden
}

/**
 * Applies the Dock preference at startup or when Settings changes it.
 *
 * {@link syncDockIconVisibility} keeps the native menu available during use.
 *
 * @param hidden - Whether to hide the Dock icon while Signage is unfocused.
 */
export function setDockIconVisibility(hidden: boolean): void {
  hideDockIconInBackground = hidden
  syncDockIconVisibility()

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
