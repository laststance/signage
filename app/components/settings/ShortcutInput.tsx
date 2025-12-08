/**
 * ShortcutInput Component
 * A keyboard shortcut capture input that records key combinations
 * and converts them to Electron accelerator format.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/app/lib/utils'

interface ShortcutInputProps {
  value: string
  onChange: (shortcut: string) => void
  onValidate?: (shortcut: string) => boolean
  className?: string
}

/**
 * Maps browser key names to Electron accelerator format
 */
function keyToAccelerator(key: string): string {
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Escape: 'Esc',
    Enter: 'Return',
  }
  return keyMap[key] || key
}

/**
 * Formats an accelerator string for display with macOS symbols
 */
export function formatAcceleratorDisplay(accelerator: string): string {
  if (!accelerator) return ''
  return accelerator
    .replace('CommandOrControl', '\u2318')
    .replace('Command', '\u2318')
    .replace('Control', '\u2303')
    .replace('Shift', '\u21E7')
    .replace('Alt', '\u2325')
    .replace('Option', '\u2325')
    .replace(/\+/g, ' ')
}

/**
 * Converts a keyboard event to Electron accelerator format
 */
function eventToAccelerator(e: KeyboardEvent): string | null {
  const modifiers: string[] = []

  // Check for modifier keys only
  if (
    e.key === 'Meta' ||
    e.key === 'Control' ||
    e.key === 'Shift' ||
    e.key === 'Alt'
  ) {
    return null // Don't record modifier-only presses
  }

  // Build modifier string
  if (e.metaKey || e.ctrlKey) {
    modifiers.push('CommandOrControl')
  }
  if (e.shiftKey) {
    modifiers.push('Shift')
  }
  if (e.altKey) {
    modifiers.push('Alt')
  }

  // Get the main key
  let key = e.key

  // Handle function keys
  if (key.startsWith('F') && /^F\d+$/.test(key)) {
    // F1-F12 can be used alone
    if (modifiers.length === 0) {
      return key
    }
    return [...modifiers, key].join('+')
  }

  // For other keys, require at least one modifier
  if (modifiers.length === 0) {
    return null
  }

  // Convert key to accelerator format
  key = keyToAccelerator(key)

  // Handle single character keys (letters and numbers)
  if (key.length === 1) {
    key = key.toUpperCase()
  }

  return [...modifiers, key].join('+')
}

export default function ShortcutInput({
  value,
  onChange,
  onValidate,
  className,
}: ShortcutInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [displayValue, setDisplayValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(formatAcceleratorDisplay(value))
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isRecording) return

      // Handle Escape to cancel
      if (e.key === 'Escape') {
        setIsRecording(false)
        setDisplayValue(formatAcceleratorDisplay(value))
        return
      }

      // Handle Backspace to clear
      if (
        e.key === 'Backspace' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        onChange('')
        setDisplayValue('')
        setIsRecording(false)
        return
      }

      const accelerator = eventToAccelerator(e.nativeEvent)
      if (accelerator) {
        // Validate if validator provided
        if (onValidate && !onValidate(accelerator)) {
          // Invalid shortcut - show feedback
          setDisplayValue('Invalid shortcut')
          setTimeout(() => {
            setDisplayValue(formatAcceleratorDisplay(value))
          }, 1000)
          return
        }

        onChange(accelerator)
        setDisplayValue(formatAcceleratorDisplay(accelerator))
        setIsRecording(false)
      }
    },
    [isRecording, onChange, onValidate, value],
  )

  const handleFocus = useCallback(() => {
    setIsRecording(true)
    setDisplayValue('Press keys...')
  }, [])

  const handleBlur = useCallback(() => {
    setIsRecording(false)
    setDisplayValue(formatAcceleratorDisplay(value))
  }, [value])

  const handleClear = useCallback(() => {
    onChange('')
    setDisplayValue('')
    inputRef.current?.focus()
  }, [onChange])

  return (
    <div className={cn('flex gap-2', className)}>
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          readOnly
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'font-mono text-center cursor-pointer',
            isRecording && 'ring-2 ring-blue-500 ring-offset-2',
          )}
        />
        {isRecording && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="animate-pulse text-muted-foreground text-sm">
              Recording...
            </span>
          </div>
        )}
      </div>
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="shrink-0"
        >
          Clear
        </Button>
      )}
    </div>
  )
}
