# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Signage is an Electron desktop application featuring an interactive WebGL fluid dynamics screensaver. Built with React 19, TypeScript, Vite, and TailwindCSS, it runs exclusively on macOS.

## Development Commands

```bash
# Development
pnpm dev           # Start dev server with hot reload
pnpm typecheck     # Run TypeScript type checking
pnpm lint          # Lint and auto-fix code issues
pnpm format        # Format code with Prettier

# Building (macOS only)
APPLE_KEYCHAIN_PROFILE=signage-notarize pnpm build:mac         # Build signed & notarized (x64 and arm64)
APPLE_KEYCHAIN_PROFILE=signage-notarize pnpm build:mac:intel   # Build signed & notarized (Intel only)
APPLE_KEYCHAIN_PROFILE=signage-notarize pnpm build:mac:apple   # Build signed & notarized (Apple Silicon only)
pnpm build:unpack                                               # Build unpacked (no signing)
```

**Node Version**: 22.16.0 (managed by Volta)
**Package Manager**: pnpm (preferred)

## Architecture Overview

### Multi-Process Architecture

Electron applications run in separate processes:

1. **Main Process** ([lib/main/main.ts](lib/main/main.ts))
   - Controls application lifecycle
   - Creates browser windows
   - Handles native OS APIs and file system access
   - Manages application menu ([lib/main/menu.ts](lib/main/menu.ts))

2. **Renderer Process** ([app/renderer.tsx](app/renderer.tsx))
   - Runs the React application
   - Limited access to Node.js APIs for security
   - Communicates with main process via IPC

3. **Preload Scripts** ([lib/preload/preload.ts](lib/preload/preload.ts))
   - Secure bridge between main and renderer
   - Exposes controlled API to renderer ([lib/preload/api.ts](lib/preload/api.ts))

### IPC Communication Pattern

The application uses a secure IPC system defined in preload scripts:

```typescript
// Renderer → Main (one-way)
window.api.send('channel-name', ...args)

// Main → Renderer (listener)
window.api.receive('channel-name', (data) => {
  console.log(data)
})

// Renderer ↔ Main (request-response)
const result = await window.api.invoke('channel-name', ...args)
```

IPC handlers are registered in [lib/window/ipcEvents.ts](lib/window/ipcEvents.ts) using the `registerWindowIPC()` function.

### Visual Mode System

A key architectural feature is the visual mode toggle:

- **Default Mode**: User-controlled interaction (mouse/touch)
- **Auto Mode**: Automated random fluid movements

**Flow**:

1. Menu selection in [lib/main/menu.ts](lib/main/menu.ts) (`setVisualMode()`)
2. State stored in main process (`isAutoMode` variable)
3. IPC event `visual-mode-changed` sent to renderer
4. [app/components/ui/splash-cursor.tsx](app/components/ui/splash-cursor.tsx) listens and adjusts behavior
5. Auto mode generates random movements via `generateRandomMovement()`

This pattern demonstrates main-to-renderer state synchronization.

## Path Aliases

Configured in [electron.vite.config.ts](electron.vite.config.ts):

- `@/app` → `./app` (renderer code)
- `@/lib` → `./lib` (main/preload code)
- `@/resources` → `./resources` (build assets)

## Build Configuration

### TypeScript Configurations

Three separate configs for different contexts:

- **[tsconfig.json](tsconfig.json)**: Main configuration
- **[tsconfig.web.json](tsconfig.web.json)**: Renderer process (web environment)
- **[tsconfig.node.json](tsconfig.node.json)**: Main process (Node.js environment)

### Electron Vite Configuration

[electron.vite.config.ts](electron.vite.config.ts) defines three separate build targets:

- **main**: Entry `lib/main/main.ts` → Output `out/main/main.js`
- **preload**: Entry `lib/preload/preload.ts` → Output `out/preload/preload.js`
- **renderer**: Root `./app`, Entry `app/index.html` → Output `out/renderer/`

### Platform-Specific Window Handling

[lib/main/app.ts](lib/main/app.ts) provides macOS-specific window configuration:

- Frameless window with `titleBarStyle: 'hiddenInset'` for native macOS look
- Menu toggle via Option (⌥) key

## Key Components

### SplashCursor (WebGL Fluid Simulation)

[app/components/ui/splash-cursor.tsx](app/components/ui/splash-cursor.tsx) is a complex WebGL-based fluid dynamics system:

- Implements Navier-Stokes equations for fluid simulation
- Dual-mode operation (user-controlled vs auto)
- Uses multiple shader programs (splat, advection, divergence, pressure, etc.)
- Listens to `visual-mode-changed` IPC event for mode switching
- Auto mode generates random movements at 100-500ms intervals

### Custom Window System

[lib/window/](lib/window/) directory contains:

- **[titlebarMenus.ts](lib/window/titlebarMenus.ts)**: Menu structure definition
- **[ipcEvents.ts](lib/window/ipcEvents.ts)**: IPC handler registration
- **[components/Titlebar.tsx](lib/window/components/Titlebar.tsx)**: Custom titlebar UI
- Menu includes window controls, edit operations, and visual mode toggle

## Styling & UI

- **TailwindCSS v4** with Vite plugin
- **shadcn/ui**: Component library ([components.json](components.json))
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **Class Variance Authority**: Component variants

Styles located in [app/styles/](app/styles/):

- [tailwind.css](app/styles/tailwind.css): TailwindCSS directives
- [app.css](app/styles/app.css): Application-specific styles

## Security Considerations

- Context isolation enabled by default
- Node integration disabled in renderer
- Preload scripts provide controlled API exposure
- Sandbox mode disabled ([lib/main/app.ts](lib/main/app.ts)) - required for Electron functionality

## Release Procedure

When releasing a new version, follow these steps in order:

### Prerequisites

- [ ] All feature/fix commits completed and pushed
- [ ] TypeScript passes: `pnpm typecheck`
- [ ] Lint passes: `pnpm lint`
- [ ] Working tree is clean: `git status`

### 1. Bump Version

Edit `package.json` and increment the version:

- **Patch**: Bug fixes (1.3.0 → 1.3.1)
- **Minor**: New features (1.3.0 → 1.4.0)
- **Major**: Breaking changes (1.3.0 → 2.0.0)

```bash
# Commit the version bump
git add package.json
git commit -m "chore: bump version to X.Y.Z"
git push origin main
```

### 2. Build Signed & Notarized DMG

```bash
# Build for both Intel and Apple Silicon (signed & notarized)
APPLE_KEYCHAIN_PROFILE=signage-notarize pnpm build:mac
```

**Note**: If the build fails due to network timeout, retry with architecture-specific commands:

```bash
# Apple Silicon only
APPLE_KEYCHAIN_PROFILE=signage-notarize pnpm build:mac:apple

# Intel only
APPLE_KEYCHAIN_PROFILE=signage-notarize pnpm build:mac:intel
```

Build outputs in `dist/`:

| File                          | Description       |
| ----------------------------- | ----------------- |
| `signage-X.Y.Z-arm64.dmg`     | Apple Silicon DMG |
| `signage-X.Y.Z-x64.dmg`       | Intel DMG         |
| `Signage-X.Y.Z-arm64-mac.zip` | Apple Silicon ZIP |
| `Signage-X.Y.Z-mac.zip`       | Intel ZIP         |

### 3. Create GitHub Release

```bash
gh release create vX.Y.Z \
  --title "vX.Y.Z" \
  --notes "$(cat <<'EOF'
## What's New in vX.Y.Z

### New Features / Bug Fixes
- Description of changes

### Downloads
- **Apple Silicon (M1/M2/M3/M4)**: signage-X.Y.Z-arm64.dmg
- **Intel Macs**: signage-X.Y.Z-x64.dmg
EOF
)" \
  dist/signage-X.Y.Z-arm64.dmg \
  dist/signage-X.Y.Z-x64.dmg \
  dist/Signage-X.Y.Z-arm64-mac.zip \
  dist/Signage-X.Y.Z-mac.zip
```

### 4. Update Landing Page Download Links

Edit [landing/app/page.tsx](landing/app/page.tsx) lines ~131 and ~153:

```tsx
// Apple Silicon link (~line 131)
href =
  'https://github.com/laststance/signage/releases/download/vX.Y.Z/signage-X.Y.Z-arm64.dmg'

// Intel link (~line 153)
href =
  'https://github.com/laststance/signage/releases/download/vX.Y.Z/signage-X.Y.Z-x64.dmg'
```

### 5. Commit and Push Landing Page

```bash
git add landing/app/page.tsx
git commit -m "docs: update download links to vX.Y.Z"
git push origin main
```

Landing page auto-deploys via Vercel on push to main branch.

### Post-Release Verification

- [ ] GitHub Release page shows all 4 assets
- [ ] Landing page links download correct version
- [ ] DMG installs and runs correctly on Apple Silicon
- [ ] DMG installs and runs correctly on Intel Mac
