# Project Configuration - Digital Signage Application

## Project Goal
Build a modern, high-performance digital signage application using Electron, React, and TypeScript. The application should display dynamic content for digital displays with smooth animations, real-time updates, and cross-platform compatibility.

## Tech Stack

### Core Technologies
- **Runtime**: Electron 35.x with Node.js 22.16.0
- **Frontend**: React 19.x with TypeScript 5.8+
- **Build Tool**: Vite 6.x with electron-vite 3.x
- **Styling**: TailwindCSS 4.x
- **Animation**: Framer Motion 12.x
- **Icons**: Lucide React

### Development Tools
- **Linting**: ESLint 9.x with @electron-toolkit/eslint-config-ts
- **Formatting**: Prettier 3.x
- **Package Manager**: pnpm (with volta for Node version management)

### Key Dependencies
- `@electron-toolkit/preload` and `@electron-toolkit/utils` for Electron utilities
- `class-variance-authority` and `clsx` for conditional styling
- `tailwind-merge` for TailwindCSS class merging
- `tw-animate-css` for extended animations

## Project Structure
```
signage/
├── app/                    # React application source
│   ├── assets/            # Static assets
│   ├── components/        # React components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility libraries
│   └── styles/           # CSS and styling files
├── lib/                   # Electron source
│   ├── main/             # Main process
│   ├── preload/          # Preload scripts
│   ├── welcome/          # Welcome screen logic
│   └── window/           # Window management
├── resources/            # Build resources
└── cursorkleosr/        # AI workflow configuration
```

## Critical Patterns & Conventions

### Code Style
- Use TypeScript strict mode for all new code
- Follow React 19 patterns (no legacy class components)
- Use functional components with hooks
- Implement proper error boundaries

### Styling Conventions
- Use TailwindCSS utility classes as primary styling method
- Use `clsx` and `class-variance-authority` for conditional classes
- Prefer `tailwind-merge` for complex class combinations
- Use Framer Motion for animations requiring JavaScript control

### Electron Best Practices
- Maintain clear separation between main, renderer, and preload processes
- Use context isolation for security
- Implement proper IPC communication patterns
- Follow Electron security guidelines

### Performance Requirements
- Target 60fps for all animations
- Optimize for continuous display operation
- Implement proper memory management for long-running sessions
- Use requestIdleCallback for non-critical operations

### Development Workflow
- Use `pnpm dev` for development with hot reload
- Run `pnpm lint` and `pnpm format` before commits
- Test on target platforms using build scripts
- Follow semantic versioning

## Key Limitations & Considerations
- Must work reliably in kiosk/fullscreen mode
- Should handle network connectivity issues gracefully
- Must support automatic startup and recovery
- Content updates should not require app restart
- Memory usage must remain stable during extended operation

## File Extensions & Imports
- Use `.tsx` for React components
- Use `.ts` for TypeScript utilities
- Use relative imports for local modules
- Use absolute imports for app-level modules via path mapping

## Build & Deployment
- Cross-platform builds: Windows, macOS, Linux
- Electron Builder for packaging
- Auto-updater capability for production deployments 