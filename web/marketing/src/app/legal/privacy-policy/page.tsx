import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Axxiom Privacy Policy - Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy | Axxiom',
    description: 'How we collect, use, and protect your personal information.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            Axxiom Technologies, Inc. ("Axxiom," "we," "us," or "our") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
            use our AI-powered commercial real estate valuation platform and related services (collectively, the "Services").
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title, and password when you create an account.</li>
            <li><strong>Payment Information:</strong> Billing address and payment card details (processed securely by our payment processor).</li>
            <li><strong>Property Data:</strong> Property addresses, financial information, documents, and images you upload for valuation analysis.</li>
            <li><strong>Communications:</strong> Information you provide when contacting our support team or participating in surveys.</li>
            <li><strong>User Content:</strong> Any other content you submit through our Services.</li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <p>When you use our Services, we automatically collect:</p>
          <ul>
            <li><strong>Device Information:</strong> Device type, operating system, browser type, and unique device identifiers.</li>
            <li><strong>Log Data:</strong> IP address, access times, pages viewed, and referring URLs.</li>
            <li><strong>Usage Information:</strong> Features used, actions taken, and time spent on the platform.</li>
            <li><strong>Location Data:</strong> General location based on IP address (we do not collect precise geolocation).</li>
            <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies (see our <Link href="/legal/cookie-policy">Cookie Policy</Link>).</li>
          </ul>

          <h3>1.3 Information from Third Parties</h3>
          <p>We may receive information about you from:</p>
          <ul>
            <li>Property data providers (CoStar, ATTOM, public records)</li>
            <li>Identity verification services</li>
            <li>Marketing partners</li>
            <li>Social media platforms (if you connect your account)</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our Services</li>
            <li>Process transactions and send related information</li>
            <li>Generate property valuations and analytics</li>
            <li>Train and improve our AI models (using aggregated, anonymized data)</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraud and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We may share your information in the following circumstances:</p>

          <h3>3.1 Service Providers</h3>
          <p>
            We share information with third-party vendors who perform services on our behalf, such as cloud hosting
            (Google Cloud Platform), payment processing (Stripe), email delivery (SendGrid), and analytics providers.
            These providers are contractually bound to protect your information.
          </p>

          <h3>3.2 Business Partners</h3>
          <p>
            With your consent, we may share information with business partners who offer complementary services.
          </p>

          <h3>3.3 Legal Requirements</h3>
          <p>We may disclose information if required by law, regulation, legal process, or government request.</p>

          <h3>3.4 Business Transfers</h3>
          <p>
            In connection with a merger, acquisition, or sale of assets, your information may be transferred
            to the acquiring entity.
          </p>

          <h3>3.5 With Your Consent</h3>
          <p>We may share information with your explicit consent.</p>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our Services, comply with legal
            obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete
            or anonymize your personal information within 90 days, except as required by law.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul>
            <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>SOC 2 Type II certified infrastructure</li>
            <li>Regular security audits and penetration testing</li>
            <li>Role-based access controls</li>
            <li>Multi-factor authentication</li>
            <li>24/7 security monitoring</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
          </p>

          <h2>6. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Objection:</strong> Object to certain processing activities</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
            <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p>
            To exercise these rights, contact us at <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a>.
            We will respond within 30 days.
          </p>

          <h2>7. International Data Transfers</h2>
          <p>
            Your information may be transferred to, stored, and processed in the United States or other countries
            where our service providers operate. We use Standard Contractual Clauses and other appropriate safeguards
            for international transfers. For more information, see our <Link href="/legal/data-processing">Data Processing Agreement</Link>.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our Services are not directed to individuals under 18. We do not knowingly collect personal information
            from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our Services may contain links to third-party websites. We are not responsible for the privacy practices
            of these sites. We encourage you to review their privacy policies.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by email
            or through our Services. Your continued use after changes constitutes acceptance of the updated policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@axxiom.io">privacy@axxiom.io</a></li>
            <li><strong>Mail:</strong> Axxiom Technologies, Inc., Attn: Privacy Team, 100 Market Street, Suite 500, San Francisco, CA 94105</li>
            <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@axxiom.io">dpo@axxiom.io</a></li>
          </ul>

          <h2>12. Additional Information for Specific Regions</h2>
          <p>
            For additional information about your rights under specific privacy laws, please see:
          </p>
          <ul>
            <li><Link href="/legal/gdpr">GDPR Notice</Link> (European Economic Area)</li>
            <li><Link href="/legal/ccpa">CCPA Notice</Link> (California Residents)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
