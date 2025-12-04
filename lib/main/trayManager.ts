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
 * Super dark gray color with transparency for menu bar icon.
 *
 * @color #111111 (RGB 17, 17, 17) with 70% opacity (alpha 178)
 * @rationale Ultra-dark gray with transparency for a subtle, refined appearance.
 *            The transparency allows the icon to blend slightly with the menu bar
 *            while maintaining visibility and professional aesthetics.
 *
 * @example Alpha scale reference:
 *   - 255 = 100% opaque (fully solid)
 *   - 204 = 80% opacity
 *   - 178 = 70% opacity ← Current
 *   - 128 = 50% opacity
 */
const TRAY_ICON_HEX = '#111111' as const
const TRAY_ICON_OPACITY = 0.5 as const
const TRAY_ICON_COLOR = {
  hex: TRAY_ICON_HEX,
  r: 17,
  g: 17,
  b: 17,
  a: Math.round(255 * TRAY_ICON_OPACITY), // 178 (~70% opacity)
} as const

/**
 * Creates a 16x16 super dark gray icon for macOS menu bar.
 * Uses custom color instead of template image for precise color control.
 *
 * @returns NativeImage with super dark gray filled square
 */
function createTrayIcon(): Electron.NativeImage {
  // Create 16x16 icon (standard) and 32x32 (@2x for Retina)
  const size = 16
  const size2x = 32

  // Create raw RGBA buffer for 16x16 icon
  const buffer = Buffer.alloc(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    const offset = i * 4
    buffer[offset] = TRAY_ICON_COLOR.r // Red
    buffer[offset + 1] = TRAY_ICON_COLOR.g // Green
    buffer[offset + 2] = TRAY_ICON_COLOR.b // Blue
    buffer[offset + 3] = TRAY_ICON_COLOR.a // Alpha
  }

  // Create raw RGBA buffer for 32x32 icon (Retina @2x)
  const buffer2x = Buffer.alloc(size2x * size2x * 4)
  for (let i = 0; i < size2x * size2x; i++) {
    const offset = i * 4
    buffer2x[offset] = TRAY_ICON_COLOR.r
    buffer2x[offset + 1] = TRAY_ICON_COLOR.g
    buffer2x[offset + 2] = TRAY_ICON_COLOR.b
    buffer2x[offset + 3] = TRAY_ICON_COLOR.a
  }

  // Create nativeImage from raw RGBA buffer
  const icon = nativeImage.createFromBuffer(buffer, {
    width: size,
    height: size,
  })

  // Add high-DPI representation for Retina displays (@2x)
  icon.addRepresentation({
    width: size2x,
    height: size2x,
    scaleFactor: 2.0,
    buffer: buffer2x,
  })

  // Do NOT set as template image - we want our specific gray color
  // Template images would be automatically colorized by macOS
  icon.setTemplateImage(false)

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
