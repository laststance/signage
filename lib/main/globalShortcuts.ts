/**
 * Global Shortcuts Module
 * Registers system-wide keyboard shortcuts that work even when the app is not focused.
 *
 * This is separate from menu accelerators which only work when the app has focus.
 */
import { globalShortcut } from 'electron'

import {
  getToggleShortcut,
  setToggleShortcut as saveToggleShortcut,
  isValidShortcut,
  DEFAULT_TOGGLE_SHORTCUT,
} from './settings'
import { toggleSignageWindow } from './windowManager'

/** Currently registered shortcut (to track for re-registration) */
let currentShortcut: string | null = null

/**
 * Registers all global shortcuts for the application.
 * Should be called after app is ready.
 *
 * @returns true if all shortcuts were registered successfully
 */
export function registerGlobalShortcuts(): boolean {
  const shortcut = getToggleShortcut()
  return registerToggleShortcut(shortcut)
}

/**
 * Registers the toggle shortcut.
 *
 * @param shortcut - The keyboard shortcut to register
 * @returns true if registration was successful
 */
function registerToggleShortcut(shortcut: string): boolean {
  // Unregister existing shortcut if different
  if (currentShortcut && currentShortcut !== shortcut) {
    globalShortcut.unregister(currentShortcut)
  }

  const success = globalShortcut.register(shortcut, () => {
    toggleSignageWindow()
  })

  if (success) {
    currentShortcut = shortcut
  } else {
    console.warn(
      `Failed to register global shortcut: ${shortcut}. ` +
        'It may be in use by another application.',
    )
    currentShortcut = null
  }

  return success
}

/**
 * Changes the toggle shortcut to a new value.
 * Unregisters the old shortcut and registers the new one.
 *
 * @param newShortcut - The new keyboard shortcut
 * @returns true if the new shortcut was registered successfully
 */
export function changeToggleShortcut(newShortcut: string): boolean {
  if (!isValidShortcut(newShortcut)) {
    console.warn(`Invalid shortcut format: ${newShortcut}`)
    return false
  }

  // Unregister current shortcut
  if (currentShortcut) {
    globalShortcut.unregister(currentShortcut)
  }

  // Try to register new shortcut
  const success = registerToggleShortcut(newShortcut)

  if (success) {
    // Save to settings
    saveToggleShortcut(newShortcut)
  } else {
    // Restore previous shortcut if registration failed
    if (currentShortcut) {
      registerToggleShortcut(currentShortcut)
    }
  }

  return success
}

/**
 * Resets the toggle shortcut to the default value.
 *
 * @returns true if the default shortcut was registered successfully
 */
export function resetToggleShortcut(): boolean {
  return changeToggleShortcut(DEFAULT_TOGGLE_SHORTCUT)
}

/**
 * Gets the currently active toggle shortcut.
 *
 * @returns The current shortcut or null if not registered
 */
export function getCurrentShortcut(): string | null {
  return currentShortcut
}

/**
 * Unregisters all global shortcuts.
 * Should be called when the app is quitting.
 */
export function unregisterGlobalShortcuts(): void {
  globalShortcut.unregisterAll()
  currentShortcut = null
}

/**
 * Checks if the toggle shortcut is currently registered.
 *
 * @returns true if the shortcut is registered
 */
export function isToggleShortcutRegistered(): boolean {
  return (
    currentShortcut !== null && globalShortcut.isRegistered(currentShortcut)
  )
}
