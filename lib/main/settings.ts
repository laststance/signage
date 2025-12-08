/**
 * Settings Module
 * Manages persistent user preferences using a simple JSON file.
 *
 * Settings are stored in the user's app data directory.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

import { app } from 'electron'

/** Default keyboard shortcut for toggling Signage */
export const DEFAULT_TOGGLE_SHORTCUT = 'CommandOrControl+Shift+S'

/** Available preset shortcuts for easy selection */
export const SHORTCUT_PRESETS = [
  'CommandOrControl+Shift+S',
  'CommandOrControl+Shift+Space',
  'CommandOrControl+Alt+S',
  'CommandOrControl+Alt+Space',
  'F12',
] as const

/** Application settings structure */
export interface AppSettings {
  toggleShortcut: string
  showInMenuBar: boolean
  hideAppIcon: boolean
  startAtLogin: boolean
}

/** Default settings */
const defaultSettings: AppSettings = {
  toggleShortcut: DEFAULT_TOGGLE_SHORTCUT,
  showInMenuBar: true,
  hideAppIcon: false,
  startAtLogin: false,
}

/** Cached settings to avoid repeated file reads */
let cachedSettings: AppSettings | null = null

/**
 * Gets the path to the settings file.
 */
function getSettingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

/**
 * Loads settings from disk.
 * Returns default settings if file doesn't exist or is invalid.
 */
function loadSettings(): AppSettings {
  const settingsPath = getSettingsPath()

  try {
    if (existsSync(settingsPath)) {
      const data = readFileSync(settingsPath, 'utf-8')
      const parsed = JSON.parse(data) as Partial<AppSettings>

      // Merge with defaults to ensure all fields exist
      return {
        ...defaultSettings,
        ...parsed,
      }
    }
  } catch (error) {
    console.warn('Failed to load settings, using defaults:', error)
  }

  return { ...defaultSettings }
}

/**
 * Saves settings to disk.
 */
function saveSettings(settings: AppSettings): void {
  const settingsPath = getSettingsPath()

  try {
    // Ensure directory exists
    const dir = dirname(settingsPath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')
    cachedSettings = settings
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

/**
 * Gets the current settings.
 * Uses cached value if available.
 */
export function getSettings(): AppSettings {
  if (!cachedSettings) {
    cachedSettings = loadSettings()
  }
  return cachedSettings
}

/**
 * Gets the current toggle shortcut.
 */
export function getToggleShortcut(): string {
  return getSettings().toggleShortcut
}

/**
 * Sets the toggle shortcut.
 *
 * @param shortcut - The new keyboard shortcut (e.g., 'CommandOrControl+Shift+S')
 */
export function setToggleShortcut(shortcut: string): void {
  const settings = getSettings()
  settings.toggleShortcut = shortcut
  saveSettings(settings)
}

/**
 * Resets the toggle shortcut to default.
 */
export function resetToggleShortcut(): void {
  setToggleShortcut(DEFAULT_TOGGLE_SHORTCUT)
}

/**
 * Validates if a shortcut string is in valid Electron accelerator format.
 * Basic validation - checks for common patterns.
 *
 * @param shortcut - The shortcut string to validate
 * @returns true if the shortcut appears valid
 */
export function isValidShortcut(shortcut: string): boolean {
  if (!shortcut || shortcut.length === 0) return false

  // Common valid patterns
  const validPattern =
    /^(CommandOrControl|Command|Control|Ctrl|Alt|Option|Shift|Super|Meta|\+|F[1-9]|F1[0-2]|[A-Z0-9]|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|numadd|numsub|numdec|numlock)+$/i

  // Split by + and validate each part
  const parts = shortcut.split('+').map((p) => p.trim())

  // Must have at least one modifier and one key, or a function key
  if (parts.length === 1) {
    // Single key - must be a function key
    return /^F[1-9]|F1[0-2]$/i.test(parts[0])
  }

  return validPattern.test(shortcut.replace(/\s/g, ''))
}

/**
 * Gets whether the menu bar icon should be shown.
 */
export function getShowInMenuBar(): boolean {
  return getSettings().showInMenuBar
}

/**
 * Sets whether the menu bar icon should be shown.
 */
export function setShowInMenuBar(show: boolean): void {
  const settings = getSettings()
  settings.showInMenuBar = show
  saveSettings(settings)
}

/**
 * Gets whether the app icon should be hidden from the Dock.
 */
export function getHideAppIcon(): boolean {
  return getSettings().hideAppIcon
}

/**
 * Sets whether the app icon should be hidden from the Dock.
 */
export function setHideAppIcon(hide: boolean): void {
  const settings = getSettings()
  settings.hideAppIcon = hide
  saveSettings(settings)
}

/**
 * Gets whether the app should start at login.
 */
export function getStartAtLogin(): boolean {
  return getSettings().startAtLogin
}

/**
 * Sets whether the app should start at login.
 */
export function setStartAtLogin(start: boolean): void {
  const settings = getSettings()
  settings.startAtLogin = start
  saveSettings(settings)
}
