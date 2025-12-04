import { defineConfig } from 'eslint/config'
import tsPrefixer from 'eslint-config-ts-prefixer'

export default defineConfig([
  ...tsPrefixer,
  {
    ignores: [
      'node_modules',
      'dist',
      'out',
      '.gitignore',
      'landing/**',
      'electron.vite.config.ts',
      'eslint.config.js',
    ],
  },
  {
    rules: {
      // Allow == null for checking both null and undefined
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
])
