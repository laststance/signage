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
import ShortcutInput, { formatAcceleratorDisplay } from './ShortcutInput'

interface Settings {
  toggleShortcut: string
}

const DEFAULT_SHORTCUT = 'CommandOrControl+Shift+S'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    toggleShortcut: DEFAULT_SHORTCUT,
  })
  const [originalSettings, setOriginalSettings] = useState<Settings>({
    toggleShortcut: DEFAULT_SHORTCUT,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Load current settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentShortcut = await window.api.invoke('shortcut-get-current')
        const initialSettings = {
          toggleShortcut: currentShortcut || DEFAULT_SHORTCUT,
        }
        setSettings(initialSettings)
        setOriginalSettings(initialSettings)
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadSettings()
  }, [])

  const hasChanges = settings.toggleShortcut !== originalSettings.toggleShortcut

  const handleShortcutChange = useCallback((shortcut: string) => {
    setSettings((prev) => ({ ...prev, toggleShortcut: shortcut }))
    setSaveMessage(null)
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
        setOriginalSettings(settings)
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
        const newSettings = { toggleShortcut: DEFAULT_SHORTCUT }
        setSettings(newSettings)
        setOriginalSettings(newSettings)
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

        {/* Future Settings Sections can be added here */}
        {/*
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            ...
          </CardContent>
        </Card>
        */}

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
              disabled={!hasChanges || isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
