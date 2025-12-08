import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Signage',
  description:
    'Privacy Policy for Signage - A privacy-respecting macOS screensaver',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl font-light mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-gray max-w-none">
          <p className="text-gray-400 mb-8">
            <strong>Effective Date:</strong> December 2024
            <br />
            <strong>Last Updated:</strong> December 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              Signage is a free, open-source macOS desktop application that
              provides an interactive WebGL fluid dynamics screensaver. We are
              committed to protecting your privacy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              Data Collection
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">
                We collect NO personal data.
              </strong>{' '}
              Signage:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Does not collect any user information</li>
              <li>Does not track your activity</li>
              <li>Does not use analytics or telemetry</li>
              <li>Does not connect to the internet</li>
              <li>Does not share any data with third parties</li>
              <li>Does not use cookies or tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              Local Storage
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The application may store local preferences on your device to
              remember your settings (such as visual mode preferences and
              keyboard shortcuts). This data never leaves your computer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              Third-Party Services
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Signage does not integrate with any third-party services, SDKs, or
              analytics platforms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              Do Not Track (DNT)
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Since Signage performs no tracking of any kind, Do Not Track
              signals are not applicable. Your privacy is protected by default.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              Children&apos;s Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Signage does not knowingly collect any information from anyone,
              including children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">Open Source</h2>
            <p className="text-gray-300 leading-relaxed">
              Signage is open source software licensed under the MIT License.
              You can review the source code at{' '}
              <a
                href="https://github.com/laststance/signage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                github.com/laststance/signage
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              Changes to This Policy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted with a new &quot;Last Updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy, please open an
              issue at{' '}
              <a
                href="https://github.com/laststance/signage/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                GitHub Issues
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
