import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description: 'Axxiom Acceptable Use Policy - Guidelines for appropriate use of our platform and services.',
  openGraph: {
    title: 'Acceptable Use Policy | Axxiom',
    description: 'Guidelines for appropriate use of our platform.',
  },
};

export default function AcceptableUsePage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Acceptable Use Policy</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            This Acceptable Use Policy ("AUP") governs your use of Axxiom's AI-powered commercial real estate
            platform and services. This AUP is incorporated into our <Link href="/legal/terms-of-service">Terms of Service</Link>.
          </p>

          <h2>1. Intended Use</h2>
          <p>
            Axxiom is designed for legitimate commercial real estate valuation, analysis, and decision-making.
            Our Services are intended for use by:
          </p>
          <ul>
            <li>Real estate investors and investment firms</li>
            <li>Property appraisers and assessment professionals</li>
            <li>Property managers and asset managers</li>
            <li>Lenders and financial institutions</li>
            <li>Real estate developers</li>
            <li>Government agencies and municipalities</li>
          </ul>

          <h2>2. Prohibited Activities</h2>
          <p>You may not use our Services to:</p>

          <h3>2.1 Illegal Activities</h3>
          <ul>
            <li>Violate any applicable laws, regulations, or government orders</li>
            <li>Engage in money laundering, tax evasion, or financial fraud</li>
            <li>Facilitate discrimination in housing or lending</li>
            <li>Violate fair housing laws or anti-discrimination regulations</li>
            <li>Engage in predatory lending practices</li>
          </ul>

          <h3>2.2 Misrepresentation</h3>
          <ul>
            <li>Present AI-generated estimates as certified appraisals</li>
            <li>Misrepresent the source or nature of valuations</li>
            <li>Forge, falsify, or manipulate property data</li>
            <li>Create fraudulent property listings or representations</li>
            <li>Impersonate licensed appraisers or other professionals</li>
          </ul>

          <h3>2.3 Harmful Content</h3>
          <ul>
            <li>Upload malware, viruses, or malicious code</li>
            <li>Distribute spam or unsolicited communications</li>
            <li>Upload content that infringes intellectual property rights</li>
            <li>Share confidential information without authorization</li>
            <li>Upload personally identifiable information of others without consent</li>
          </ul>

          <h3>2.4 System Abuse</h3>
          <ul>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Overwhelm our systems with excessive requests (DoS attacks)</li>
            <li>Scrape or harvest data beyond authorized API usage</li>
            <li>Reverse engineer, decompile, or disassemble our software</li>
            <li>Circumvent usage limits, authentication, or security measures</li>
            <li>Use automated tools to access the Services except via our API</li>
          </ul>

          <h3>2.5 Competitive Harm</h3>
          <ul>
            <li>Resell or redistribute our Services without authorization</li>
            <li>Create competing products using our data or models</li>
            <li>Use our Services to benchmark against us for competitive purposes</li>
            <li>Share account access with non-authorized users</li>
          </ul>

          <h2>3. AI Model Usage</h2>

          <h3>3.1 Appropriate Use</h3>
          <p>Our AI models are designed for:</p>
          <ul>
            <li>Property valuation estimates</li>
            <li>Market analysis and research</li>
            <li>Investment decision support</li>
            <li>Document processing and data extraction</li>
            <li>Property condition assessment</li>
          </ul>

          <h3>3.2 Limitations</h3>
          <p>You acknowledge that:</p>
          <ul>
            <li>AI outputs are estimates, not certified appraisals</li>
            <li>Results should be reviewed by qualified professionals</li>
            <li>Models may produce inaccurate or biased results</li>
            <li>Past performance does not guarantee future accuracy</li>
          </ul>

          <h3>3.3 Prohibited AI Uses</h3>
          <ul>
            <li>Training competing AI models using our outputs</li>
            <li>Using AI outputs to discriminate against protected classes</li>
            <li>Automating decisions that require human oversight</li>
            <li>Attempting to extract or replicate our model weights</li>
          </ul>

          <h2>4. Data Usage</h2>

          <h3>4.1 Your Data</h3>
          <p>You are responsible for ensuring that:</p>
          <ul>
            <li>You have rights to upload data you submit</li>
            <li>Data does not violate third-party rights</li>
            <li>Personal data is collected and shared lawfully</li>
            <li>Confidential information is properly protected</li>
          </ul>

          <h3>4.2 Third-Party Data</h3>
          <p>When using data from our third-party sources:</p>
          <ul>
            <li>Comply with applicable data provider terms</li>
            <li>Do not redistribute raw data without authorization</li>
            <li>Acknowledge data sources when required</li>
            <li>Report data quality issues to us</li>
          </ul>

          <h2>5. API Usage</h2>
          <p>If you access our API, you must:</p>
          <ul>
            <li>Use valid API credentials</li>
            <li>Respect rate limits and quotas</li>
            <li>Implement proper error handling</li>
            <li>Keep API credentials secure</li>
            <li>Not share API access with unauthorized parties</li>
            <li>Identify your application in request headers</li>
          </ul>

          <h2>6. Reporting Violations</h2>
          <p>
            If you become aware of any violation of this AUP, please report it immediately:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:abuse@axxiom.io">abuse@axxiom.io</a></li>
            <li><strong>Security Issues:</strong> <a href="mailto:security@axxiom.io">security@axxiom.io</a></li>
          </ul>

          <h2>7. Enforcement</h2>
          <p>
            We reserve the right to investigate suspected violations and take appropriate action, including:
          </p>
          <ul>
            <li>Issuing warnings</li>
            <li>Suspending or limiting access</li>
            <li>Terminating accounts</li>
            <li>Reporting to law enforcement</li>
            <li>Pursuing legal remedies</li>
          </ul>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this AUP from time to time. Material changes will be communicated through our
            Services or by email.
          </p>

          <h2>9. Contact</h2>
          <p>Questions about this AUP should be directed to:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:legal@axxiom.io">legal@axxiom.io</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
