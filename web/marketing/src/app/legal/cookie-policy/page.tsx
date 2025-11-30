import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Axxiom Cookie Policy - Learn how we use cookies and similar technologies on our platform.',
  openGraph: {
    title: 'Cookie Policy | Axxiom',
    description: 'How we use cookies and similar technologies.',
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            This Cookie Policy explains how Axxiom Technologies, Inc. ("Axxiom," "we," "us," or "our") uses
            cookies and similar tracking technologies when you visit our website and use our Services.
          </p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help websites
            remember your preferences, understand how you use the site, and improve your experience.
          </p>

          <h2>2. Types of Cookies We Use</h2>

          <h3>2.1 Essential Cookies</h3>
          <p>
            These cookies are necessary for our website to function properly. They enable core functionality
            such as security, authentication, and accessibility. You cannot disable these cookies.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Maintains your login session</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Security protection</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>auth_token</td>
                <td>Authentication</td>
                <td>7 days</td>
              </tr>
            </tbody>
          </table>

          <h3>2.2 Performance Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting anonymous
            information about page visits and errors.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics - distinguishes users</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics - distinguishes users</td>
                <td>24 hours</td>
              </tr>
              <tr>
                <td>_gat</td>
                <td>Google Analytics - throttles requests</td>
                <td>1 minute</td>
              </tr>
            </tbody>
          </table>

          <h3>2.3 Functionality Cookies</h3>
          <p>
            These cookies remember your preferences and settings to provide enhanced functionality and personalization.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>preferences</td>
                <td>Stores your display preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>language</td>
                <td>Remembers your language choice</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>timezone</td>
                <td>Stores your timezone</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>2.4 Targeting/Advertising Cookies</h3>
          <p>
            These cookies are used to deliver relevant advertisements and track the effectiveness of marketing campaigns.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_fbp</td>
                <td>Facebook pixel tracking</td>
                <td>3 months</td>
              </tr>
              <tr>
                <td>li_sugr</td>
                <td>LinkedIn advertising</td>
                <td>3 months</td>
              </tr>
              <tr>
                <td>_gcl_au</td>
                <td>Google Ads conversion tracking</td>
                <td>3 months</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Third-Party Cookies</h2>
          <p>
            We use services from third parties that may set their own cookies. These include:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> Web analytics and performance monitoring</li>
            <li><strong>Google Maps:</strong> Property visualization and mapping</li>
            <li><strong>Intercom:</strong> Customer support chat</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>LinkedIn:</strong> Marketing and advertising</li>
            <li><strong>Facebook:</strong> Marketing and advertising</li>
          </ul>
          <p>
            These third parties have their own privacy policies governing their use of cookies.
          </p>

          <h2>4. Managing Cookies</h2>

          <h3>4.1 Cookie Consent</h3>
          <p>
            When you first visit our website, we display a cookie consent banner allowing you to accept or
            customize your cookie preferences. You can change these preferences at any time by clicking
            the "Cookie Settings" link in our footer.
          </p>

          <h3>4.2 Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>View cookies stored on your device</li>
            <li>Delete all or specific cookies</li>
            <li>Block all cookies or cookies from specific sites</li>
            <li>Set preferences for different types of cookies</li>
          </ul>
          <p>
            Note that blocking cookies may affect the functionality of our Services.
          </p>

          <h3>4.3 Browser-Specific Instructions</h3>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h3>4.4 Opt-Out Links</h3>
          <ul>
            <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out</a></li>
            <li><a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener noreferrer">Facebook Opt-Out</a></li>
            <li><a href="https://www.linkedin.com/help/linkedin/answer/62931" target="_blank" rel="noopener noreferrer">LinkedIn Opt-Out</a></li>
            <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Opt-Out</a></li>
          </ul>

          <h2>5. Similar Technologies</h2>
          <p>
            In addition to cookies, we may use similar technologies:
          </p>
          <ul>
            <li><strong>Web Beacons:</strong> Small graphics that track user behavior in emails and web pages</li>
            <li><strong>Local Storage:</strong> Browser storage for application data</li>
            <li><strong>Session Storage:</strong> Temporary storage cleared when you close your browser</li>
            <li><strong>Fingerprinting:</strong> We do NOT use browser fingerprinting</li>
          </ul>

          <h2>6. Do Not Track</h2>
          <p>
            Our website currently does not respond to "Do Not Track" (DNT) browser signals. However, you
            can manage your cookie preferences using the methods described above.
          </p>

          <h2>7. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on this page with
            an updated revision date.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
            <li><strong>Mail:</strong> Axxiom Technologies, Inc., 100 Market Street, Suite 500, San Francisco, CA 94105</li>
          </ul>

          <p className="mt-8">
            <Link href="/legal/privacy-policy" className="text-primary-400 hover:text-primary-300">
              ← Back to Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
