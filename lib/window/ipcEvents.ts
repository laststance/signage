import os from 'os'

import { type BrowserWindow, ipcMain, shell } from 'electron'

import {
  changeToggleShortcut,
  getCurrentShortcut,
  resetToggleShortcut,
} from '../main/globalShortcuts'
import { getVisualModeState } from '../main/menu'
import { SHORTCUT_PRESETS } from '../main/settings'

const handleIPC = (channel: string, handler: (...args: any[]) => void) => {
  ipcMain.handle(channel, handler)
}

export const registerWindowIPC = (mainWindow: BrowserWindow) => {
  // Hide the menu bar
  mainWindow.setMenuBarVisibility(false)

  // Register window IPC
  handleIPC('init-window', () => {
    const { width, height } = mainWindow.getBounds()
    const minimizable = mainWindow.isMinimizable()
    const maximizable = mainWindow.isMaximizable()
    const platform = os.platform()

    return { width, height, minimizable, maximizable, platform }
  })

  handleIPC('is-window-minimizable', () => mainWindow.isMinimizable())
  handleIPC('is-window-maximizable', () => mainWindow.isMaximizable())
  handleIPC('window-minimize', () => mainWindow.minimize())
  handleIPC('window-maximize', () => mainWindow.maximize())
  handleIPC('window-close', () => mainWindow.close())
  handleIPC('window-maximize-toggle', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  const webContents = mainWindow.webContents
  handleIPC('web-undo', () => webContents.undo())
  handleIPC('web-redo', () => webContents.redo())
  handleIPC('web-cut', () => webContents.cut())
  handleIPC('web-copy', () => webContents.copy())
  handleIPC('web-paste', () => webContents.paste())
  handleIPC('web-delete', () => webContents.delete())
  handleIPC('web-select-all', () => webContents.selectAll())
  handleIPC('web-reload', () => webContents.reload())
  handleIPC('web-force-reload', () => webContents.reloadIgnoringCache())
  handleIPC('web-toggle-devtools', () => webContents.toggleDevTools())
  handleIPC('web-actual-size', () => webContents.setZoomLevel(0))
  handleIPC('web-zoom-in', () =>
    webContents.setZoomLevel(webContents.zoomLevel + 0.5),
  )
  handleIPC('web-zoom-out', () =>
    webContents.setZoomLevel(webContents.zoomLevel - 0.5),
  )
  handleIPC('web-toggle-fullscreen', () => {
    const newState = !mainWindow.fullScreen
    mainWindow.setFullScreen(newState)
    return newState
  })
  handleIPC('web-get-fullscreen-status', () => mainWindow.fullScreen)
  handleIPC('web-open-url', async (_e, url) => shell.openExternal(url))

  // Visual mode IPC handlers (now handled by menu)
  handleIPC('visual-mode-get-state', () => getVisualModeState())

  // Global shortcut IPC handlers
  handleIPC('shortcut-get-current', () => getCurrentShortcut())
  handleIPC('shortcut-get-presets', () => SHORTCUT_PRESETS)
  handleIPC('shortcut-change', (_e, newShortcut: string) =>
    changeToggleShortcut(newShortcut),
  )
  handleIPC('shortcut-reset', () => resetToggleShortcut())
}
