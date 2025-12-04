import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron'

// Visual mode state
let isAutoMode = false

export function createApplicationMenu(): Menu {
  const template: MenuItemConstructorOptions[] = [
    // App menu (macOS)
    {
      label: app.getName(),
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        {
          label: 'Default Mode',
          type: 'radio' as const,
          checked: !isAutoMode,
          click: () => setVisualMode(false)
        },
        {
          label: 'Auto Mode',
          type: 'radio' as const,
          checked: isAutoMode,
          click: () => setVisualMode(true)
        },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const }
      ]
    },
    // File menu
    {
      label: 'File',
      submenu: [
        { role: 'close' as const }
      ]
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
            { role: 'stopSpeaking' as const }
          ]
        }
      ]
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
        { role: 'togglefullscreen' as const }
      ]
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
        { role: 'window' as const }
      ]
    },
    {
      role: 'help' as const,
      submenu: [
        {
          label: 'About Signage',
          click: async () => {
            const { shell } = await import('electron')
            await shell.openExternal('https://laststance.io')
          }
        }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}

function setVisualMode(autoMode: boolean): void {
  isAutoMode = autoMode
  
  // Update menu
  const menu = createApplicationMenu()
  Menu.setApplicationMenu(menu)
  
  // Notify renderer process
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    mainWindow.webContents.send('visual-mode-changed', isAutoMode)
  }
}

export function getVisualModeState(): boolean {
  return isAutoMode
}