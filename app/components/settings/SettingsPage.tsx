/**
 * SettingsPage Component
 * Main settings interface for the application.
 * Extensible design for future settings additions.
 */
import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Separator } from '@/app/components/ui/separator'
import { Switch } from '@/app/components/ui/switch'
import ShortcutInput, { formatAcceleratorDisplay } from './ShortcutInput'

interface Settings {
  toggleShortcut: string
  showInMenuBar: boolean
  hideAppIcon: boolean
  startAtLogin: boolean
}

const DEFAULT_SHORTCUT = 'CommandOrControl+Shift+S'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    toggleShortcut: DEFAULT_SHORTCUT,
    showInMenuBar: true,
    hideAppIcon: false,
    startAtLogin: false,
  })
  const [originalSettings, setOriginalSettings] = useState<Settings>({
    toggleShortcut: DEFAULT_SHORTCUT,
    showInMenuBar: true,
    hideAppIcon: false,
    startAtLogin: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Load current settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [currentShortcut, showInMenuBar, hideAppIcon, startAtLogin] =
          await Promise.all([
            window.api.invoke('shortcut-get-current'),
            window.api.invoke('settings-get-show-in-menu-bar'),
            window.api.invoke('settings-get-hide-app-icon'),
            window.api.invoke('settings-get-start-at-login'),
          ])
        const initialSettings = {
          toggleShortcut: currentShortcut || DEFAULT_SHORTCUT,
          showInMenuBar: showInMenuBar ?? true,
          hideAppIcon: hideAppIcon ?? false,
          startAtLogin: startAtLogin ?? false,
        }
        setSettings(initialSettings)
        setOriginalSettings(initialSettings)
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadSettings()
  }, [])

  const hasChanges =
    settings.toggleShortcut !== originalSettings.toggleShortcut ||
    settings.showInMenuBar !== originalSettings.showInMenuBar ||
    settings.hideAppIcon !== originalSettings.hideAppIcon ||
    settings.startAtLogin !== originalSettings.startAtLogin

  const handleShortcutChange = useCallback((shortcut: string) => {
    setSettings((prev) => ({ ...prev, toggleShortcut: shortcut }))
    setSaveMessage(null)
  }, [])

  // Handle toggle changes with immediate effect
  const handleShowInMenuBarChange = useCallback(async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, showInMenuBar: checked }))
    setSaveMessage(null)
    try {
      await window.api.invoke('settings-set-show-in-menu-bar', checked)
      setOriginalSettings((prev) => ({ ...prev, showInMenuBar: checked }))
    } catch (error) {
      console.error('Failed to update show in menu bar:', error)
    }
  }, [])

  const handleHideAppIconChange = useCallback(async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, hideAppIcon: checked }))
    setSaveMessage(null)
    try {
      await window.api.invoke('settings-set-hide-app-icon', checked)
      setOriginalSettings((prev) => ({ ...prev, hideAppIcon: checked }))
    } catch (error) {
      console.error('Failed to update hide app icon:', error)
    }
  }, [])

  const handleStartAtLoginChange = useCallback(async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, startAtLogin: checked }))
    setSaveMessage(null)
    try {
      await window.api.invoke('settings-set-start-at-login', checked)
      setOriginalSettings((prev) => ({ ...prev, startAtLogin: checked }))
    } catch (error) {
      console.error('Failed to update start at login:', error)
    }
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const success = await window.api.invoke(
        'shortcut-change',
        settings.toggleShortcut,
      )
      if (success) {
        setOriginalSettings((prev) => ({
          ...prev,
          toggleShortcut: settings.toggleShortcut,
        }))
        setSaveMessage('Settings saved successfully!')
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage(
          'Failed to register shortcut. It may be in use by another application.',
        )
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveMessage('An error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }, [settings])

  const handleReset = useCallback(async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const success = await window.api.invoke('shortcut-reset')
      if (success) {
        setSettings((prev) => ({ ...prev, toggleShortcut: DEFAULT_SHORTCUT }))
        setOriginalSettings((prev) => ({
          ...prev,
          toggleShortcut: DEFAULT_SHORTCUT,
        }))
        setSaveMessage('Settings reset to default!')
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage('Failed to reset settings.')
      }
    } catch (error) {
      console.error('Failed to reset settings:', error)
      setSaveMessage('An error occurred while resetting.')
    } finally {
      setIsSaving(false)
    }
  }, [])

  const handleCancel = useCallback(() => {
    setSettings(originalSettings)
    setSaveMessage(null)
  }, [originalSettings])

  const shortcutHasChanges =
    settings.toggleShortcut !== originalSettings.toggleShortcut

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your Signage preferences
          </p>
        </div>

        <Separator />

        {/* General Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General</CardTitle>
            <CardDescription>
              Control how Signage appears and behaves on your system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Show in Menu Bar */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-in-menu-bar">Show in menu bar</Label>
                <p className="text-xs text-muted-foreground">
                  Display Signage icon in the macOS menu bar
                </p>
              </div>
              <Switch
                id="show-in-menu-bar"
                checked={settings.showInMenuBar}
                onCheckedChange={handleShowInMenuBarChange}
              />
            </div>

            <Separator />

            {/* Hide App Icon */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hide-app-icon">Hide App Icon</Label>
                <p className="text-xs text-muted-foreground">
                  Hide Signage from the Dock
                </p>
              </div>
              <Switch
                id="hide-app-icon"
                checked={settings.hideAppIcon}
                onCheckedChange={handleHideAppIconChange}
              />
            </div>

            <Separator />

            {/* Start at Login */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="start-at-login">Start at Login</Label>
                <p className="text-xs text-muted-foreground">
                  Launch Signage automatically when you log in
                </p>
              </div>
              <Switch
                id="start-at-login"
                checked={settings.startAtLogin}
                onCheckedChange={handleStartAtLoginChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
            <CardDescription>
              Customize global keyboard shortcuts that work even when other apps
              are active.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toggle-shortcut">Toggle Signage</Label>
              <ShortcutInput
                value={settings.toggleShortcut}
                onChange={handleShortcutChange}
              />
              <p className="text-xs text-muted-foreground">
                Click the input field and press your desired key combination.
                Use modifier keys (⌘, ⇧, ⌥) with a letter, number, or function
                key.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="text-sm text-muted-foreground">
                Current:{' '}
                <span className="font-mono">
                  {formatAcceleratorDisplay(originalSettings.toggleShortcut)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Message */}
        {saveMessage && (
          <div
            className={`text-sm p-3 rounded-md ${
              saveMessage.includes('success') || saveMessage.includes('reset')
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {saveMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            Reset to Default
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={!shortcutHasChanges || isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!shortcutHasChanges || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
