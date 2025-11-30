import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GDPR Notice',
  description: 'Axxiom GDPR Notice - Information for users in the European Economic Area about their privacy rights.',
  openGraph: {
    title: 'GDPR Notice | Axxiom',
    description: 'Privacy rights for users in the European Economic Area.',
  },
};

export default function GDPRPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">GDPR Notice</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            This GDPR Notice supplements our <Link href="/legal/privacy-policy">Privacy Policy</Link> and
            provides additional information for individuals in the European Economic Area (EEA), United Kingdom,
            and Switzerland about how Axxiom Technologies, Inc. processes personal data in compliance with the
            General Data Protection Regulation (GDPR).
          </p>

          <h2>1. Data Controller</h2>
          <p>
            Axxiom Technologies, Inc. is the data controller for personal data collected through our Services.
          </p>
          <ul>
            <li><strong>Address:</strong> 100 Market Street, Suite 500, San Francisco, CA 94105, USA</li>
            <li><strong>Email:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
            <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@axxiom.io">dpo@axxiom.io</a></li>
          </ul>

          <h2>2. EU Representative</h2>
          <p>
            Our EU representative for GDPR purposes is:
          </p>
          <ul>
            <li><strong>Name:</strong> Axxiom EU Data Representative</li>
            <li><strong>Address:</strong> 25 Old Broad Street, London EC2N 1HN, United Kingdom</li>
            <li><strong>Email:</strong> <a href="mailto:eu-privacy@axxiom.io">eu-privacy@axxiom.io</a></li>
          </ul>

          <h2>3. Legal Bases for Processing</h2>
          <p>We process personal data based on the following legal grounds:</p>

          <table>
            <thead>
              <tr>
                <th>Processing Activity</th>
                <th>Legal Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Providing our Services</td>
                <td>Performance of contract (Article 6(1)(b))</td>
              </tr>
              <tr>
                <td>Account management</td>
                <td>Performance of contract (Article 6(1)(b))</td>
              </tr>
              <tr>
                <td>Billing and payments</td>
                <td>Performance of contract (Article 6(1)(b))</td>
              </tr>
              <tr>
                <td>Customer support</td>
                <td>Performance of contract (Article 6(1)(b))</td>
              </tr>
              <tr>
                <td>AI model improvement</td>
                <td>Legitimate interests (Article 6(1)(f))</td>
              </tr>
              <tr>
                <td>Security monitoring</td>
                <td>Legitimate interests (Article 6(1)(f))</td>
              </tr>
              <tr>
                <td>Marketing communications</td>
                <td>Consent (Article 6(1)(a))</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Legitimate interests (Article 6(1)(f))</td>
              </tr>
              <tr>
                <td>Legal compliance</td>
                <td>Legal obligation (Article 6(1)(c))</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Your Rights Under GDPR</h2>
          <p>Under the GDPR, you have the following rights:</p>

          <h3>4.1 Right of Access (Article 15)</h3>
          <p>
            You can request a copy of the personal data we hold about you, along with information about
            how we process it.
          </p>

          <h3>4.2 Right to Rectification (Article 16)</h3>
          <p>
            You can request correction of inaccurate personal data or completion of incomplete data.
          </p>

          <h3>4.3 Right to Erasure (Article 17)</h3>
          <p>
            You can request deletion of your personal data in certain circumstances, such as when:
          </p>
          <ul>
            <li>The data is no longer necessary for its original purpose</li>
            <li>You withdraw consent (where processing was based on consent)</li>
            <li>You object to processing and there are no overriding legitimate grounds</li>
            <li>The data has been unlawfully processed</li>
          </ul>

          <h3>4.4 Right to Restriction (Article 18)</h3>
          <p>
            You can request that we restrict processing of your data while we verify its accuracy,
            consider your objection, or if processing is unlawful but you don't want deletion.
          </p>

          <h3>4.5 Right to Data Portability (Article 20)</h3>
          <p>
            You can request your personal data in a structured, commonly used, machine-readable format
            and have it transmitted to another controller.
          </p>

          <h3>4.6 Right to Object (Article 21)</h3>
          <p>
            You can object to processing based on legitimate interests, including profiling.
            We will stop processing unless we demonstrate compelling legitimate grounds.
          </p>

          <h3>4.7 Right to Withdraw Consent (Article 7)</h3>
          <p>
            Where processing is based on consent, you can withdraw that consent at any time.
            Withdrawal does not affect the lawfulness of prior processing.
          </p>

          <h3>4.8 Right Not to Be Subject to Automated Decision-Making (Article 22)</h3>
          <p>
            You have the right not to be subject to decisions based solely on automated processing
            that produce legal or similarly significant effects. Our AI valuations are designed as
            decision support tools, not automated decision-making systems.
          </p>

          <h2>5. Exercising Your Rights</h2>
          <p>To exercise any of these rights:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
            <li><strong>Online:</strong> Through your account settings</li>
            <li><strong>Mail:</strong> Axxiom Technologies, Inc., Attn: Privacy Team, 100 Market Street, Suite 500, San Francisco, CA 94105</li>
          </ul>
          <p>
            We will respond within 30 days. We may ask for identity verification before processing requests.
            Requests are free unless manifestly unfounded or excessive.
          </p>

          <h2>6. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in the United States. We use the following
            safeguards for international transfers:
          </p>
          <ul>
            <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contract terms ensuring adequate protection</li>
            <li><strong>Supplementary Measures:</strong> Additional technical and organizational safeguards</li>
            <li><strong>Transfer Impact Assessments:</strong> Evaluation of recipient country laws</li>
          </ul>
          <p>
            You can request a copy of the SCCs by contacting <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a>.
          </p>

          <h2>7. Data Retention</h2>
          <p>We retain personal data for:</p>
          <ul>
            <li><strong>Active accounts:</strong> Duration of the account relationship plus 3 years</li>
            <li><strong>Financial records:</strong> 7 years (legal requirement)</li>
            <li><strong>Marketing preferences:</strong> Until you unsubscribe</li>
            <li><strong>Security logs:</strong> 1 year</li>
          </ul>
          <p>After retention periods expire, data is securely deleted or anonymized.</p>

          <h2>8. Data Protection Impact Assessments</h2>
          <p>
            We conduct Data Protection Impact Assessments (DPIAs) for processing activities that pose
            high risks to individuals, including our AI valuation systems.
          </p>

          <h2>9. Supervisory Authority</h2>
          <p>
            You have the right to lodge a complaint with your local data protection authority:
          </p>
          <ul>
            <li><strong>Ireland:</strong> Data Protection Commission (our lead supervisory authority)</li>
            <li><strong>UK:</strong> Information Commissioner's Office (ICO)</li>
            <li>Or your local EU/EEA supervisory authority</li>
          </ul>
          <p>
            However, we encourage you to contact us first so we can address your concerns.
          </p>

          <h2>10. Contact Us</h2>
          <p>For GDPR-related inquiries:</p>
          <ul>
            <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@axxiom.io">dpo@axxiom.io</a></li>
            <li><strong>Privacy Team:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
