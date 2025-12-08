import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - Signage',
  description:
    'Terms of Service for Signage - A free, open-source macOS screensaver',
}

export default function TermsPage() {
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

        <h1 className="text-4xl font-light mb-8">Terms of Service</h1>

        <div className="prose prose-invert prose-gray max-w-none">
          <p className="text-gray-400 mb-8">
            <strong>Effective Date:</strong> December 2024
            <br />
            <strong>Last Updated:</strong> December 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              By downloading, installing, or using Signage, you agree to these
              Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">2. License</h2>
            <p className="text-gray-300 leading-relaxed">
              Signage is free, open-source software licensed under the MIT
              License. You are granted permission to use, copy, modify, merge,
              publish, distribute, sublicense, and/or sell copies of the
              Software, subject to the conditions of the MIT License.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              3. Provided &quot;AS IS&quot;
            </h2>
            <p className="text-gray-300 leading-relaxed font-mono text-sm bg-gray-900/50 p-4 rounded-lg">
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF
              ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
              AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              4. User Responsibilities
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>
                Ensuring your system meets the requirements to run Signage
              </li>
              <li>Using the software in compliance with applicable laws</li>
              <li>Any modifications you make to the open-source code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              5. No Data Collection
            </h2>
            <p className="text-gray-300 leading-relaxed">
              As stated in our{' '}
              <Link
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Privacy Policy
              </Link>
              , Signage does not collect, store, or transmit any user data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              6. macOS Only
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Signage is designed exclusively for macOS. We make no warranties
              about compatibility with other operating systems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              7. Modifications
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may modify these Terms at any time. Continued use of Signage
              after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              8. Open Source Contribution
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Contributions to the Signage project are welcome and governed by
              the MIT License and standard open-source contribution practices.
              Visit our{' '}
              <a
                href="https://github.com/laststance/signage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                GitHub repository
              </a>{' '}
              to contribute.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">
              9. Termination
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You may stop using Signage at any time by uninstalling the
              application from your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 text-white">10. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              Questions about these Terms? Contact us at{' '}
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
