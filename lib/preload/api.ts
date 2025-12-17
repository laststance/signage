import { ipcRenderer } from 'electron'

/** Update info sent from main process */
export interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseNotes?: string | null
}

/** Download progress info */
export interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}

const api = {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  },
  invoke: async (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  },

  // Auto-update API
  update: {
    /**
     * Manually triggers an update check.
     * @returns Promise that resolves when check completes
     */
    checkForUpdates: async (): Promise<void> =>
      ipcRenderer.invoke('update-check'),

    /**
     * Quits the app and installs the downloaded update.
     */
    quitAndInstall: async (): Promise<void> =>
      ipcRenderer.invoke('update-install'),

    /**
     * Registers a callback for when update check starts.
     * @param callback - Function called when checking for updates
     */
    onChecking: (callback: () => void) => {
      ipcRenderer.on('update-checking', () => callback())
    },

    /**
     * Registers a callback for when an update is available.
     * @param callback - Function called with update info
     */
    onUpdateAvailable: (callback: (info: UpdateInfo) => void) => {
      ipcRenderer.on('update-available', (_, info) => callback(info))
    },

    /**
     * Registers a callback for when no update is available.
     * @param callback - Function called when already up to date
     */
    onUpdateNotAvailable: (callback: () => void) => {
      ipcRenderer.on('update-not-available', () => callback())
    },

    /**
     * Registers a callback for download progress updates.
     * @param callback - Function called with progress info
     */
    onProgress: (callback: (progress: UpdateProgress) => void) => {
      ipcRenderer.on('update-progress', (_, progress) => callback(progress))
    },

    /**
     * Registers a callback for when update is downloaded and ready.
     * @param callback - Function called with update info
     */
    onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => {
      ipcRenderer.on('update-downloaded', (_, info) => callback(info))
    },

    /**
     * Registers a callback for update errors.
     * @param callback - Function called with error message
     */
    onError: (callback: (message: string) => void) => {
      ipcRenderer.on('update-error', (_, message) => callback(message))
    },

    /**
     * Removes all update-related event listeners.
     */
    removeAllListeners: () => {
      ipcRenderer.removeAllListeners('update-checking')
      ipcRenderer.removeAllListeners('update-available')
      ipcRenderer.removeAllListeners('update-not-available')
      ipcRenderer.removeAllListeners('update-progress')
      ipcRenderer.removeAllListeners('update-downloaded')
      ipcRenderer.removeAllListeners('update-error')
    },
  },
}

export default api
