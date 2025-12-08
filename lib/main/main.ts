import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, Menu } from 'electron'

import { createAppWindow } from './app'
import {
  registerGlobalShortcuts,
  unregisterGlobalShortcuts,
} from './globalShortcuts'
import {
  createApplicationMenu,
  getVisualModeState,
  setTrayRebuildCallback,
  setVisualMode,
} from './menu'
import { registerSettingsWindowIPC } from './settingsWindow'
import {
  createTray,
  rebuildTrayMenu,
  setVisualModeCallbacks,
} from './trayManager'
import {
  setMenuRebuildCallback,
  setTrayRebuildCallback as setWindowManagerTrayCallback,
} from './windowManager'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Set app user model id
  electronApp.setAppUserModelId('com.laststance.signage')

  // Set menu rebuild callback for windowManager
  setMenuRebuildCallback(createApplicationMenu)

  // Set tray rebuild callback for windowManager (dock icon toggle)
  setWindowManagerTrayCallback(rebuildTrayMenu)

  // Set tray rebuild callback for menu (visual mode changes)
  setTrayRebuildCallback(rebuildTrayMenu)

  // Create and set application menu
  const menu = createApplicationMenu()
  Menu.setApplicationMenu(menu)

  // Create system tray with visual mode sync callbacks
  setVisualModeCallbacks(getVisualModeState, setVisualMode)
  createTray()

  // Register global shortcuts (works even when app is not focused)
  registerGlobalShortcuts()

  // Register settings window IPC handlers
  registerSettingsWindowIPC()

  // Create app window
  createAppWindow()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow()
    }
  })
})

// On macOS, apps typically stay active until the user explicitly quits with Cmd+Q.
// The window-all-closed handler is intentionally empty to preserve this behavior.
app.on('window-all-closed', () => {
  // macOS: Do nothing - app stays in dock/tray
})

// Unregister global shortcuts when quitting
app.on('will-quit', () => {
  unregisterGlobalShortcuts()
})
// In this file, you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
