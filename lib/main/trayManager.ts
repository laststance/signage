/**
 * Tray Manager Module
 * macOS Menu Bar Icon with native context menu
 *
 * Features:
 * - Toggle Signage window visibility
 * - Toggle Dock icon visibility
 * - Visual mode switching (Default/Auto)
 * - Start at login setting
 * - Standard native macOS menu style
 */
import { join } from 'path'

import { app, Menu, nativeImage, Tray } from 'electron'

import {
  isDockHidden,
  toggleDockIcon,
  toggleSignageWindow,
} from './windowManager'

/** Global tray reference to prevent garbage collection */
let tray: Tray | null = null

/** Visual mode state - synchronized with menu.ts */
let isAutoMode = false

/** Callback to get current visual mode state from menu */
let getVisualModeCallback: (() => boolean) | null = null

/** Callback to set visual mode (updates both tray and app menu) */
let setVisualModeCallback: ((autoMode: boolean) => void) | null = null

/**
 * Creates a 16x16 Template icon for macOS menu bar.
 * Template images are automatically inverted in dark mode.
 *
 * @returns NativeImage suitable for Tray
 */
function createTrayIcon(): Electron.NativeImage {
  // Use file-based template icon for reliability
  // Template icons must be named with "Template" suffix and be black on transparent
  const iconPath = join(__dirname, '../../resources/tray/iconTemplate.png')
  const icon = nativeImage.createFromPath(iconPath)

  // If file doesn't exist in dev, fallback to data URL
  if (icon.isEmpty()) {
    // Fallback: 16x16 filled square on transparent (macOS template icon)
    const fallbackDataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAB3RJTUUH6QwECjE5I8KQ0AAAAB9JREFUOMtjYBhowIjE/k+OXiZKXTBqwKgBg8OAgQcAtksBGILoGLcAAAAASUVORK5CYII='
    const fallbackIcon = nativeImage.createFromDataURL(fallbackDataUrl)
    fallbackIcon.setTemplateImage(true)
    return fallbackIcon
  }

  icon.setTemplateImage(true)
  return icon
}

/**
 * Builds the native context menu for the tray.
 *
 * @returns Menu instance with all tray options
 */
function buildTrayMenu(): Menu {
  const currentAutoMode = getVisualModeCallback
    ? getVisualModeCallback()
    : isAutoMode
  const loginSettings = app.getLoginItemSettings()

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Toggle Signage',
      accelerator: 'CommandOrControl+Shift+S',
      click: () => toggleSignageWindow(),
    },
    { type: 'separator' },
    {
      label: 'Default Mode',
      type: 'radio',
      checked: !currentAutoMode,
      click: () => {
        if (setVisualModeCallback) {
          setVisualModeCallback(false)
        } else {
          isAutoMode = false
        }
        rebuildTrayMenu()
      },
    },
    {
      label: 'Auto Mode',
      type: 'radio',
      checked: currentAutoMode,
      click: () => {
        if (setVisualModeCallback) {
          setVisualModeCallback(true)
        } else {
          isAutoMode = true
        }
        rebuildTrayMenu()
      },
    },
    { type: 'separator' },
    {
      label: isDockHidden() ? 'Show App Icon' : 'Hide App Icon',
      click: () => {
        toggleDockIcon()
        rebuildTrayMenu()
      },
    },
    {
      label: 'Start at Login',
      type: 'checkbox',
      checked: loginSettings.openAtLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({
          openAtLogin: menuItem.checked,
          openAsHidden: true,
        })
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Signage',
      accelerator: 'CommandOrControl+Q',
      click: () => app.quit(),
    },
  ]

  return Menu.buildFromTemplate(template)
}

/**
 * Rebuilds and updates the tray menu.
 * Call this when state changes that affect menu items.
 */
export function rebuildTrayMenu(): void {
  if (tray) {
    tray.setContextMenu(buildTrayMenu())
  }
}

/**
 * Sets callback functions for visual mode synchronization.
 *
 * @param getter - Function to get current visual mode state
 * @param setter - Function to set visual mode
 */
export function setVisualModeCallbacks(
  getter: () => boolean,
  setter: (autoMode: boolean) => void,
): void {
  getVisualModeCallback = getter
  setVisualModeCallback = setter
}

/**
 * Creates and initializes the system tray icon with native context menu.
 * Must be called after app.whenReady().
 *
 * @returns The created Tray instance
 */
export function createTray(): Tray {
  const icon = createTrayIcon()

  tray = new Tray(icon)
  tray.setToolTip('Signage')

  // Set native context menu
  tray.setContextMenu(buildTrayMenu())

  return tray
}

/**
 * Gets the current tray instance.
 *
 * @returns The Tray instance or null if not created
 */
export function getTray(): Tray | null {
  return tray
}

/**
 * Destroys the tray icon.
 */
export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
