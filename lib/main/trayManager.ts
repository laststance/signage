/**
 * Tray Manager Module
 * macOS Menu Bar Icon with native context menu
 *
 * Features:
 * - Toggle Signage window visibility
 * - Visual mode switching (Default/Auto/Black Mirror)
 * - Standard native macOS menu style
 */
import { app, Menu, nativeImage, Tray } from 'electron'

import type { VisualMode } from '@/lib/types/visualMode'

import { getToggleShortcut } from './settings'
import { openSettingsWindow } from './settingsWindow'
import { toggleSignageWindow } from './windowManager'

/** Global tray reference to prevent garbage collection */
let tray: Tray | null = null

/** Visual mode state - synchronized with menu.ts */
let currentVisualMode: VisualMode = 'default'

/** Callback to get current visual mode state from menu */
let getVisualModeCallback: (() => VisualMode) | null = null

/** Callback to set visual mode (updates both tray and app menu) */
let setVisualModeCallback: ((mode: VisualMode) => void) | null = null

/**
 * White color for menu bar icon - rest/mindfulness theme.
 *
 * @color #FFFFFF (RGB 255, 255, 255) with 90% opacity
 * @rationale White provides excellent visibility on macOS menu bar
 *            while the zen circle design evokes rest and mindfulness.
 */
const TRAY_ICON_HEX = '#FFFFFF' as const
const TRAY_ICON_OPACITY = 0.9 as const
const TRAY_ICON_COLOR = {
  hex: TRAY_ICON_HEX,
  r: 255,
  g: 255,
  b: 255,
  a: Math.round(255 * TRAY_ICON_OPACITY), // 230 (~90% opacity)
} as const

/**
 * Creates a 16x16 zen circle icon for macOS menu bar.
 * Design: Outer ring with inner dot - evokes rest, mindfulness, and focus.
 *
 * @returns NativeImage with zen circle design
 */
function createTrayIcon(): Electron.NativeImage {
  // Create 16x16 icon (standard) and 32x32 (@2x for Retina)
  const size = 16
  const size2x = 32

  // Create raw RGBA buffer for 16x16 icon
  const buffer = Buffer.alloc(size * size * 4)
  const centerX = size / 2
  const centerY = size / 2
  const outerRadius = 6.5 // Outer ring radius
  const innerRadius = 4.5 // Inner ring radius (creates ring effect)
  const dotRadius = 1.5 // Center dot radius

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const offset = (y * size + x) * 4
      const dx = x - centerX + 0.5
      const dy = y - centerY + 0.5
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Check if pixel is part of the outer ring or center dot
      const isOuterRing = distance <= outerRadius && distance >= innerRadius
      const isCenterDot = distance <= dotRadius

      if (isOuterRing || isCenterDot) {
        buffer[offset] = TRAY_ICON_COLOR.r // Red
        buffer[offset + 1] = TRAY_ICON_COLOR.g // Green
        buffer[offset + 2] = TRAY_ICON_COLOR.b // Blue
        buffer[offset + 3] = TRAY_ICON_COLOR.a // Alpha
      } else {
        buffer[offset] = 0
        buffer[offset + 1] = 0
        buffer[offset + 2] = 0
        buffer[offset + 3] = 0 // Transparent
      }
    }
  }

  // Create raw RGBA buffer for 32x32 icon (Retina @2x)
  const buffer2x = Buffer.alloc(size2x * size2x * 4)
  const centerX2x = size2x / 2
  const centerY2x = size2x / 2
  const outerRadius2x = 13 // Scaled for 2x
  const innerRadius2x = 9 // Scaled for 2x
  const dotRadius2x = 3 // Scaled for 2x

  for (let y = 0; y < size2x; y++) {
    for (let x = 0; x < size2x; x++) {
      const offset = (y * size2x + x) * 4
      const dx = x - centerX2x + 0.5
      const dy = y - centerY2x + 0.5
      const distance = Math.sqrt(dx * dx + dy * dy)

      const isOuterRing = distance <= outerRadius2x && distance >= innerRadius2x
      const isCenterDot = distance <= dotRadius2x

      if (isOuterRing || isCenterDot) {
        buffer2x[offset] = TRAY_ICON_COLOR.r
        buffer2x[offset + 1] = TRAY_ICON_COLOR.g
        buffer2x[offset + 2] = TRAY_ICON_COLOR.b
        buffer2x[offset + 3] = TRAY_ICON_COLOR.a
      } else {
        buffer2x[offset] = 0
        buffer2x[offset + 1] = 0
        buffer2x[offset + 2] = 0
        buffer2x[offset + 3] = 0
      }
    }
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

  // Do NOT set as template image - we want our specific white color
  icon.setTemplateImage(false)

  return icon
}

/**
 * Builds the native context menu for the tray.
 *
 * @returns Menu instance with all tray options
 */
function buildTrayMenu(): Menu {
  const activeMode = getVisualModeCallback
    ? getVisualModeCallback()
    : currentVisualMode

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Toggle Signage',
      accelerator: getToggleShortcut(),
      click: () => toggleSignageWindow(),
    },
    {
      label: 'Settings...',
      accelerator: 'CommandOrControl+,',
      click: () => openSettingsWindow(),
    },
    { type: 'separator' },
    {
      label: 'Default Mode',
      type: 'radio',
      checked: activeMode === 'default',
      click: () => {
        if (setVisualModeCallback) {
          setVisualModeCallback('default')
        } else {
          currentVisualMode = 'default'
        }
        rebuildTrayMenu()
      },
    },
    {
      label: 'Auto Mode',
      type: 'radio',
      checked: activeMode === 'auto',
      click: () => {
        if (setVisualModeCallback) {
          setVisualModeCallback('auto')
        } else {
          currentVisualMode = 'auto'
        }
        rebuildTrayMenu()
      },
    },
    {
      label: 'Black Mirror Mode',
      type: 'radio',
      checked: activeMode === 'blackmirror',
      click: () => {
        if (setVisualModeCallback) {
          setVisualModeCallback('blackmirror')
        } else {
          currentVisualMode = 'blackmirror'
        }
        rebuildTrayMenu()
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
  getter: () => VisualMode,
  setter: (mode: VisualMode) => void,
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

/**
 * Shows the tray icon (creates if not exists).
 */
export function showTray(): void {
  if (!tray) {
    createTray()
  }
}

/**
 * Hides the tray icon (destroys it).
 */
export function hideTray(): void {
  destroyTray()
}

/**
 * Checks if the tray is currently visible.
 */
export function isTrayVisible(): boolean {
  return tray !== null
}

/**
 * Sets tray visibility.
 * @param visible - Whether the tray should be visible
 */
export function setTrayVisibility(visible: boolean): void {
  if (visible) {
    showTray()
  } else {
    hideTray()
  }
}
