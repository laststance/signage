import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { test } from 'node:test'
import { setImmediate } from 'node:timers/promises'

let scenarioId = 0

/**
 * Loads an isolated window manager for each focus scenario in this test suite.
 * Electron's native policy boundary is mocked so tests can run without a GUI.
 *
 * @param context - Test context that restores the Electron mock after the test.
 * @returns The window manager and controllable native application state.
 */
async function createScenario(context) {
  const app = new EventEmitter()
  const state = { focusedWindow: null, policy: 'regular', changes: [] }
  app.setActivationPolicy = (policy) => {
    state.policy = policy
    state.changes.push(policy)
  }
  context.mock.module('electron', {
    namedExports: {
      app,
      BrowserWindow: { getFocusedWindow: () => state.focusedWindow },
      Menu: { setApplicationMenu: () => {} },
    },
  })
  const manager = await import(
    `../lib/main/windowManager.ts?scenario=${scenarioId++}`
  )
  manager.initializeDockIconVisibility()
  return { app, state, manager }
}

test('focusing Signage restores its application menu with the Dock preference hidden', async (context) => {
  // Arrange
  const { app, state, manager } = await createScenario(context)
  manager.setDockIconVisibility(true)
  assert.equal(state.policy, 'accessory')

  // Act
  state.focusedWindow = { title: 'Signage' }
  app.emit('browser-window-focus')

  // Assert
  assert.equal(state.policy, 'regular')
  assert.equal(manager.isDockHidden(), false)
})

test('enabling Hide App Icon in Settings keeps the Settings menu accessible', async (context) => {
  // Arrange
  const { state, manager } = await createScenario(context)
  state.focusedWindow = { title: 'Settings' }

  // Act
  manager.setDockIconVisibility(true)

  // Assert
  assert.equal(state.policy, 'regular')
  assert.equal(manager.isDockHidden(), false)
})

test('switching from Signage to Settings does not hide the application menu', async (context) => {
  // Arrange
  const { app, state, manager } = await createScenario(context)
  state.focusedWindow = { title: 'Signage' }
  manager.setDockIconVisibility(true)

  // Act
  state.focusedWindow = null
  app.emit('browser-window-blur')
  state.focusedWindow = { title: 'Settings' }
  app.emit('browser-window-focus')
  await setImmediate()

  // Assert
  assert.equal(state.policy, 'regular')
  assert.deepEqual(state.changes, [])
})

test('leaving Signage hides the Dock icon again without clearing the preference', async (context) => {
  // Arrange
  const { app, state, manager } = await createScenario(context)
  state.focusedWindow = { title: 'Settings' }
  manager.setDockIconVisibility(true)

  // Act
  state.focusedWindow = null
  app.emit('browser-window-blur')
  await setImmediate()

  // Assert
  assert.equal(state.policy, 'accessory')
  assert.equal(manager.isDockHidden(), true)
})

test('disabling Hide App Icon keeps Signage in the Dock after losing focus', async (context) => {
  // Arrange
  const { app, state, manager } = await createScenario(context)
  manager.setDockIconVisibility(true)
  manager.setDockIconVisibility(false)

  // Act
  app.emit('browser-window-blur')
  await setImmediate()

  // Assert
  assert.equal(state.policy, 'regular')
  assert.equal(manager.isDockHidden(), false)
})

test('toggling the Dock preference uses the saved intent while the menu is temporarily visible', async (context) => {
  // Arrange
  const { app, state, manager } = await createScenario(context)
  state.focusedWindow = { title: 'Signage' }
  manager.setDockIconVisibility(true)

  // Act
  manager.toggleDockIcon()
  state.focusedWindow = null
  app.emit('browser-window-blur')
  await setImmediate()

  // Assert
  assert.equal(state.policy, 'regular')
  assert.equal(manager.isDockHidden(), false)
})
