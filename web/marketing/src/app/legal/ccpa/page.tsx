import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CCPA Notice',
  description: 'Axxiom CCPA Notice - Privacy rights for California residents under the California Consumer Privacy Act.',
  openGraph: {
    title: 'CCPA Notice | Axxiom',
    description: 'Privacy rights for California residents.',
  },
};

export default function CCPAPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">California Privacy Notice (CCPA/CPRA)</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            This California Privacy Notice supplements our <Link href="/legal/privacy-policy">Privacy Policy</Link> and
            provides additional information for California residents as required by the California Consumer Privacy
            Act (CCPA), as amended by the California Privacy Rights Act (CPRA).
          </p>

          <h2>1. Categories of Personal Information</h2>
          <p>
            In the past 12 months, we have collected the following categories of personal information:
          </p>

          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Collected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A. Identifiers</td>
                <td>Name, email, IP address, account ID</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>B. Personal Records</td>
                <td>Name, address, phone number, financial info</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>C. Protected Classifications</td>
                <td>Age range (for account verification)</td>
                <td>Limited</td>
              </tr>
              <tr>
                <td>D. Commercial Information</td>
                <td>Property data, transaction history, subscriptions</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>E. Biometric Information</td>
                <td>N/A</td>
                <td>No</td>
              </tr>
              <tr>
                <td>F. Internet Activity</td>
                <td>Browsing history, search queries, interactions</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>G. Geolocation</td>
                <td>General location from IP address</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>H. Sensory Data</td>
                <td>Property images you upload</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>I. Professional Info</td>
                <td>Job title, company, industry</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>J. Education Info</td>
                <td>N/A</td>
                <td>No</td>
              </tr>
              <tr>
                <td>K. Inferences</td>
                <td>User preferences, behavior patterns</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>L. Sensitive Personal Info</td>
                <td>Account login credentials</td>
                <td>Limited</td>
              </tr>
            </tbody>
          </table>

          <h2>2. Sources of Personal Information</h2>
          <p>We collect personal information from:</p>
          <ul>
            <li><strong>You:</strong> Information you provide directly</li>
            <li><strong>Automatic Collection:</strong> Device and usage information</li>
            <li><strong>Service Providers:</strong> Identity verification, analytics</li>
            <li><strong>Data Providers:</strong> Property data sources (CoStar, ATTOM)</li>
            <li><strong>Public Records:</strong> Property and transaction records</li>
          </ul>

          <h2>3. Purposes for Collection and Use</h2>
          <p>We use personal information for the following business purposes:</p>
          <ul>
            <li>Providing, maintaining, and improving our Services</li>
            <li>Processing transactions and managing your account</li>
            <li>Generating property valuations and analytics</li>
            <li>Customer support and communication</li>
            <li>Security, fraud prevention, and legal compliance</li>
            <li>Research and development of AI models</li>
            <li>Marketing and advertising (with consent)</li>
            <li>Analytics and service improvement</li>
          </ul>

          <h2>4. Disclosure of Personal Information</h2>
          <p>
            In the past 12 months, we have disclosed personal information to the following categories of recipients:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Cloud hosting, payment processing, analytics, customer support</li>
            <li><strong>Business Partners:</strong> With your consent for complementary services</li>
            <li><strong>Legal/Compliance:</strong> Law enforcement, regulators, legal counsel</li>
            <li><strong>Corporate Transactions:</strong> In connection with mergers or acquisitions</li>
          </ul>

          <h2>5. Sales and Sharing of Personal Information</h2>
          <p>
            <strong>We do not sell personal information</strong> as defined by the CCPA/CPRA.
          </p>
          <p>
            We may share personal information for cross-context behavioral advertising with:
          </p>
          <ul>
            <li>Advertising networks (Google, LinkedIn, Facebook)</li>
            <li>Analytics providers</li>
          </ul>
          <p>
            You can opt out of this sharing by clicking "Do Not Share My Personal Information" in our footer
            or by enabling the Global Privacy Control (GPC) in your browser.
          </p>

          <h2>6. Your California Privacy Rights</h2>
          <p>As a California resident, you have the following rights:</p>

          <h3>6.1 Right to Know</h3>
          <p>You can request disclosure of:</p>
          <ul>
            <li>Categories of personal information collected</li>
            <li>Sources of personal information</li>
            <li>Business purposes for collection</li>
            <li>Categories of third parties with whom we share</li>
            <li>Specific pieces of personal information collected</li>
          </ul>

          <h3>6.2 Right to Delete</h3>
          <p>
            You can request deletion of your personal information, subject to certain exceptions
            (e.g., completing transactions, security, legal compliance).
          </p>

          <h3>6.3 Right to Correct</h3>
          <p>You can request correction of inaccurate personal information.</p>

          <h3>6.4 Right to Opt-Out</h3>
          <p>You can opt out of:</p>
          <ul>
            <li>Sharing of personal information for cross-context behavioral advertising</li>
            <li>Processing of sensitive personal information (beyond what's necessary)</li>
          </ul>

          <h3>6.5 Right to Limit</h3>
          <p>You can limit our use of sensitive personal information to what's necessary for the Services.</p>

          <h3>6.6 Right to Non-Discrimination</h3>
          <p>
            We will not discriminate against you for exercising your privacy rights. You will not receive
            different pricing or quality of service.
          </p>

          <h2>7. Exercising Your Rights</h2>
          <p>To submit a request:</p>
          <ul>
            <li><strong>Online:</strong> <a href="https://axxiom.io/privacy/request">axxiom.io/privacy/request</a></li>
            <li><strong>Email:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
            <li><strong>Phone:</strong> 1-800-XXX-XXXX</li>
          </ul>
          <p>
            We will verify your identity before processing requests. You may designate an authorized agent
            to submit requests on your behalf with proper authorization.
          </p>
          <p>Response times:</p>
          <ul>
            <li>Acknowledgment within 10 business days</li>
            <li>Substantive response within 45 calendar days</li>
            <li>Extension of up to 45 additional days if needed (with notice)</li>
          </ul>

          <h2>8. Retention</h2>
          <p>
            We retain personal information for as long as necessary for the purposes described in this notice,
            unless a longer retention period is required by law.
          </p>

          <h2>9. Metrics</h2>
          <p>
            We will publish annual metrics on consumer requests received and processed, as required by the CCPA.
          </p>

          <h2>10. Financial Incentives</h2>
          <p>
            We do not offer financial incentives for the collection, sale, or deletion of personal information.
          </p>

          <h2>11. Shine the Light</h2>
          <p>
            California's "Shine the Light" law permits California residents to request information about
            disclosure of personal information to third parties for direct marketing. We do not share
            personal information with third parties for their direct marketing purposes.
          </p>

          <h2>12. Contact Us</h2>
          <p>For California privacy inquiries:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
            <li><strong>Mail:</strong> Axxiom Technologies, Inc., Attn: Privacy - California, 100 Market Street, Suite 500, San Francisco, CA 94105</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
