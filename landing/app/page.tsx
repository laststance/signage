'use client'

// Pre-computed star positions at module load time (pure, no render-time randomness)
const STAR_COUNT = 50
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  width: Math.random() * 4 + 1,
  height: Math.random() * 4 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  animationDelay: Math.random() * 3,
  animationDuration: Math.random() * 3 + 2,
}))

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full opacity-10 animate-pulse"
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 px-6 sm:px-12">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">
              <span className="text-white">Signage</span>
            </div>
            <div className="hidden sm:flex space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#download"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Download
              </a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="min-h-screen flex items-center justify-center text-center">
              <div className="animate-fade-in-up">
                <h1 className="text-6xl sm:text-8xl font-light mb-8 leading-tight">
                  <span className="inline-block">Pause.</span>
                  <br />
                  <span className="inline-block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-pulse">
                    Breathe.
                  </span>
                  <br />
                  <span className="inline-block">Reset.</span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
                  Give your mind the break it deserves with an intelligent
                  screen saver that promotes mental clarity
                </p>

                <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                  Transform idle screen time into mindful moments • Available
                  for macOS
                </p>

                {/* Try Demo Button */}
                <div className="mb-12">
                  <a
                    href="/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 inline-block"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Try Demo
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </a>
                </div>

                {/* Download Buttons */}
                <div id="download" className="space-y-8">
                  {/* macOS Downloads */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-300 text-center">
                      Download for macOS
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                      <a
                        href="https://github.com/laststance/signage/releases/download/v1.4.3/signage-1.4.3-arm64.dmg"
                        className="group relative overflow-hidden bg-white text-black px-6 py-4 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 w-full sm:w-auto inline-block"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          <div className="text-left">
                            <div className="font-semibold">Apple Silicon</div>
                            <div className="text-xs opacity-80">
                              M1, M2, M3 Macs
                            </div>
                          </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </a>

                      <a
                        href="https://github.com/laststance/signage/releases/download/v1.4.3/signage-1.4.3-x64.dmg"
                        className="group relative overflow-hidden bg-gray-200 text-black px-6 py-4 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-300 hover:scale-105 w-full sm:w-auto inline-block"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          <div className="text-left">
                            <div className="font-semibold">Intel</div>
                            <div className="text-xs opacity-80">
                              Intel-based Macs
                            </div>
                          </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20">
              <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up-delay">
                <div className="text-center p-8 bg-gray-900/30 rounded-2xl backdrop-blur-sm border border-gray-800">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-semibold mb-4">Neural Reset</h3>
                  <p className="text-gray-400">
                    Activates during system idle time to help your brain
                    disconnect and recharge naturally
                  </p>
                </div>

                <div className="text-center p-8 bg-gray-900/30 rounded-2xl backdrop-blur-sm border border-gray-800">
                  <div className="text-4xl mb-4">🌊</div>
                  <h3 className="text-xl font-semibold mb-4">
                    Mindful Moments
                  </h3>
                  <p className="text-gray-400">
                    Transform shutdown screens into brief meditation
                    opportunities for mental clarity
                  </p>
                </div>

                <div className="text-center p-8 bg-gray-900/30 rounded-2xl backdrop-blur-sm border border-gray-800">
                  <div className="text-4xl mb-4">🔋</div>
                  <h3 className="text-xl font-semibold mb-4">
                    Mental Recovery
                  </h3>
                  <p className="text-gray-400">
                    Promotes cognitive restoration by creating intentional
                    breaks from digital stimulation
                  </p>
                </div>
              </div>
            </div>

            {/* App Preview Section */}
            <div className="py-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-light mb-6">
                  <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    Your Brain
                  </span>
                  <br />
                  Deserves a Break
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Let idle moments become opportunities for mental reset and
                  cognitive restoration
                </p>
              </div>

              {/* Placeholder for app screenshot */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-video bg-black rounded-2xl flex items-center justify-center border border-gray-700 overflow-hidden">
                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-black"></div>
                      <div className="relative text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                        </div>
                        <p className="text-gray-400 text-sm font-light">
                          Mental Reset Mode Active
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          Minimal stimulation • Maximum mental recovery
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-light mb-8">
                Ready to give your brain
                <br />
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  the rest it needs?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Install Signage and transform idle screen time into mindful
                recovery moments
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://github.com/laststance/signage/releases/latest"
                  className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 w-full sm:w-auto inline-block"
                >
                  <span className="relative z-10">
                    Start Your Mental Break - Free
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </a>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 sm:px-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-500 mb-4">
              © 2024{' '}
              <a
                href="https://laststance.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                Laststance.io
              </a>
              . Designed for mental wellness through mindful breaks.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <a
                href="/privacy"
                className="hover:text-gray-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="hover:text-gray-400 transition-colors"
              >
                Terms
              </a>
              <a
                href="https://github.com/laststance/signage/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
