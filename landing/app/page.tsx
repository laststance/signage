'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-10 animate-pulse"
              style={{
                width: Math.random() * 4 + 1 + 'px',
                height: Math.random() * 4 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
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
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#download" className="text-gray-300 hover:text-white transition-colors">Download</a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="min-h-screen flex items-center justify-center text-center">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-6xl sm:text-8xl font-light mb-8 leading-tight">
                  <span className="inline-block">Digital</span>
                  <br />
                  <span className="inline-block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent animate-pulse">
                    Serenity
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
                  Transform your screen into a serene digital sanctuary
                </p>
                
                <p className="text-lg sm:text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
                  Cool down your brain with our minimalist screen saver • Available for macOS and Windows
                </p>

                {/* Download Buttons */}
                <div id="download" className="space-y-8">
                  {/* macOS Downloads */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-300 text-center">Download for macOS</h3>
                    <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
                      <a href="https://github.com/laststance/signage/releases/download/v1.0.0/Signage-1.0.0-arm64-mac.zip" className="group relative overflow-hidden bg-white text-black px-6 py-4 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 w-full sm:w-auto inline-block">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          <div className="text-left">
                            <div className="font-semibold">Apple Silicon</div>
                            <div className="text-xs opacity-80">M1, M2, M3 Macs</div>
                          </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </a>
                      
                      <a href="https://github.com/laststance/signage/releases/download/v1.0.0/Signage-1.0.0-mac.zip" className="group relative overflow-hidden bg-gray-200 text-black px-6 py-4 rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-300 hover:scale-105 w-full sm:w-auto inline-block">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                          <div className="text-left">
                            <div className="font-semibold">Intel</div>
                            <div className="text-xs opacity-80">Intel-based Macs</div>
                          </div>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </a>
                    </div>
                  </div>

                  {/* Windows Download */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-300 text-center">Download for Windows</h3>
                    <div className="flex justify-center">
                      <a href="https://github.com/laststance/signage/releases/download/v1.0.0/signage-1.0.0-setup.exe" className="group relative overflow-hidden bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium border border-gray-600 transition-all duration-300 hover:bg-gray-700 hover:scale-105 w-full sm:w-auto inline-block">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v18l-6-1.5V3l6 1.5zM11 12V6.75l6-1.32v6.48L11 12zm0 7.25V13.5l6 1.32v5.25L11 19.25z"/>
                          </svg>
                          Windows Installer
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20">
              <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center p-8 bg-gray-900/30 rounded-2xl backdrop-blur-sm border border-gray-800">
                  <div className="text-4xl mb-4">🧘</div>
                  <h3 className="text-xl font-semibold mb-4">Mind Serenity</h3>
                  <p className="text-gray-400">Designed to reduce screen fatigue and promote mental relaxation during breaks</p>
                </div>
                
                <div className="text-center p-8 bg-gray-900/30 rounded-2xl backdrop-blur-sm border border-gray-800">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold mb-4">Minimalist Beauty</h3>
                  <p className="text-gray-400">Clean, elegant interface that transforms your screen into a peaceful sanctuary</p>
                </div>
                
                <div className="text-center p-8 bg-gray-900/30 rounded-2xl backdrop-blur-sm border border-gray-800">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold mb-4">Lightweight</h3>
                  <p className="text-gray-400">Efficient performance with minimal system resources for seamless operation</p>
                </div>
              </div>
            </div>

            {/* App Preview Section */}
            <div className="py-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-light mb-6">
                  <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    Experience
                  </span>
                  <br />
                  Pure Tranquility
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Your screen becomes a canvas of calm, helping you disconnect and recharge
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
                        <p className="text-gray-400 text-sm font-light">Digital Serenity in Action</p>
                        <p className="text-gray-600 text-xs mt-1">Pure black interface • Interactive fluid dynamics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-light mb-8">
                Ready to find your
                <br />
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  Digital Serenity?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Download Signage today and transform your screen time into moments of peace
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="https://github.com/laststance/signage/releases/latest" className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105 w-full sm:w-auto inline-block">
                  <span className="relative z-10">Get Started - It's Free</span>
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
              © 2024 Signage. Designed for digital serenity.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}