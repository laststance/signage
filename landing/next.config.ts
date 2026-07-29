import type { NextConfig } from 'next'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const landingRootDirectory = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this independently locked landing-page project.
  turbopack: {
    root: landingRootDirectory,
  },
}

export default nextConfig
