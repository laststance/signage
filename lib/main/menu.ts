import type { MenuItemConstructorOptions } from 'electron'
import { app, Menu, BrowserWindow } from 'electron'

import {
  isDockHidden,
  toggleDockIcon,
  toggleSignageWindow,
} from './windowManager'

// Visual mode state
let isAutoMode = false

/** Callback to rebuild tray menu when visual mode changes */
let trayRebuildCallback: (() => void) | null = null

/**
 * Sets the callback function to rebuild tray menu.
 * Called when visual mode changes to keep tray in sync.
 *
 * @param callback - Function to rebuild tray menu
 */
export function setTrayRebuildCallback(callback: () => void): void {
  trayRebuildCallback = callback
}

export function createApplicationMenu(): Menu {
  const template: MenuItemConstructorOptions[] = [
    // App menu (macOS)
    {
      label: app.getName(),
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        {
          label: 'Toggle Signage',
          accelerator: 'CommandOrControl+Shift+S',
          click: () => toggleSignageWindow(),
        },
        {
          label: isDockHidden() ? 'Show App Icon' : 'Hide App Icon',
          click: () => toggleDockIcon(),
        },
        { type: 'separator' as const },
        {
          label: 'Default Mode',
          type: 'radio' as const,
          checked: !isAutoMode,
          click: () => setVisualMode(false),
        },
        {
          label: 'Auto Mode',
          type: 'radio' as const,
          checked: isAutoMode,
          click: () => setVisualMode(true),
        },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const },
      ],
    },
    // File menu
    {
      label: 'File',
      submenu: [{ role: 'close' as const }],
    },
    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'pasteAndMatchStyle' as const },
        { role: 'delete' as const },
        { role: 'selectAll' as const },
        { type: 'separator' as const },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' as const },
            { role: 'stopSpeaking' as const },
          ],
        },
      ],
    },
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'close' as const },
        { type: 'separator' as const },
        { role: 'front' as const },
        { type: 'separator' as const },
        { role: 'window' as const },
      ],
    },
    {
      role: 'help' as const,
      submenu: [
        {
          label: 'About Signage',
          click: async () => {
            const { shell } = await import('electron')
            await shell.openExternal('https://laststance.io')
          },
        },
      ],
    },
  ]

  return Menu.buildFromTemplate(template)
}

/**
 * Sets the visual mode and updates all menus.
 *
 * @param autoMode - true for auto mode, false for default mode
 */
export function setVisualMode(autoMode: boolean): void {
  isAutoMode = autoMode

  // Update app menu
  const menu = createApplicationMenu()
  Menu.setApplicationMenu(menu)

  // Rebuild tray menu to sync state
  if (trayRebuildCallback) {
    trayRebuildCallback()
  }

  // Notify renderer process
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    mainWindow.webContents.send('visual-mode-changed', isAutoMode)
  }
}

export function getVisualModeState(): boolean {
  return isAutoMode
}
