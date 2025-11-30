import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Processing Agreement',
  description: 'Axxiom Data Processing Agreement (DPA) - Terms governing our processing of personal data on your behalf.',
  openGraph: {
    title: 'Data Processing Agreement | Axxiom',
    description: 'Terms governing our processing of personal data.',
  },
};

export default function DataProcessingPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Data Processing Agreement</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            This Data Processing Agreement ("DPA") forms part of the <Link href="/legal/terms-of-service">Terms of Service</Link> between
            Axxiom Technologies, Inc. ("Axxiom," "Processor," "we") and you ("Customer," "Controller") for
            the Axxiom platform and services.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person.</li>
            <li><strong>"Processing"</strong> means any operation performed on Personal Data.</li>
            <li><strong>"Data Subject"</strong> means the individual to whom Personal Data relates.</li>
            <li><strong>"Sub-processor"</strong> means a third party engaged by Axxiom to process Personal Data.</li>
            <li><strong>"Data Protection Laws"</strong> means GDPR, CCPA, and other applicable privacy regulations.</li>
          </ul>

          <h2>2. Scope and Roles</h2>

          <h3>2.1 Customer as Controller</h3>
          <p>
            The Customer acts as the data controller for Personal Data uploaded to or processed through the Services.
            Customer determines the purposes and means of processing.
          </p>

          <h3>2.2 Axxiom as Processor</h3>
          <p>
            Axxiom acts as a data processor, processing Personal Data only on behalf of and under the instructions
            of the Customer, except where required by law.
          </p>

          <h2>3. Processing Details</h2>

          <h3>3.1 Subject Matter</h3>
          <p>
            Processing of Personal Data necessary to provide AI-powered commercial real estate valuation and
            analysis services.
          </p>

          <h3>3.2 Duration</h3>
          <p>
            Processing will continue for the term of the Service Agreement plus any retention period required by law.
          </p>

          <h3>3.3 Nature and Purpose</h3>
          <ul>
            <li>Property valuation and analysis</li>
            <li>Document processing and data extraction</li>
            <li>Report generation and delivery</li>
            <li>AI model training using anonymized data</li>
          </ul>

          <h3>3.4 Types of Personal Data</h3>
          <ul>
            <li>Property owner/tenant names and contact information</li>
            <li>Property addresses and characteristics</li>
            <li>Financial information (rent rolls, income statements)</li>
            <li>Transaction and contract details</li>
          </ul>

          <h3>3.5 Categories of Data Subjects</h3>
          <ul>
            <li>Property owners and investors</li>
            <li>Tenants and lessees</li>
            <li>Customer employees and representatives</li>
          </ul>

          <h2>4. Customer Obligations</h2>
          <p>Customer agrees to:</p>
          <ul>
            <li>Ensure lawful basis for processing Personal Data</li>
            <li>Provide transparent privacy notices to Data Subjects</li>
            <li>Obtain necessary consents where required</li>
            <li>Ensure accuracy of Personal Data provided</li>
            <li>Comply with all applicable Data Protection Laws</li>
            <li>Provide lawful processing instructions to Axxiom</li>
          </ul>

          <h2>5. Axxiom Obligations</h2>
          <p>Axxiom agrees to:</p>

          <h3>5.1 Processing Instructions</h3>
          <ul>
            <li>Process Personal Data only on documented Customer instructions</li>
            <li>Inform Customer if instructions violate Data Protection Laws</li>
            <li>Not process Personal Data for our own purposes except as permitted</li>
          </ul>

          <h3>5.2 Confidentiality</h3>
          <ul>
            <li>Ensure personnel processing Personal Data are bound by confidentiality</li>
            <li>Limit access to personnel who need it for service delivery</li>
          </ul>

          <h3>5.3 Security</h3>
          <ul>
            <li>Implement appropriate technical and organizational security measures</li>
            <li>Maintain SOC 2 Type II certification</li>
            <li>Encrypt data in transit and at rest</li>
            <li>Implement access controls and logging</li>
            <li>Conduct regular security assessments</li>
          </ul>

          <h3>5.4 Sub-processors</h3>
          <ul>
            <li>Use only approved Sub-processors (listed in Annex A)</li>
            <li>Impose equivalent data protection obligations on Sub-processors</li>
            <li>Notify Customer of new Sub-processors with 30 days' notice</li>
            <li>Remain liable for Sub-processor compliance</li>
          </ul>

          <h3>5.5 Data Subject Rights</h3>
          <ul>
            <li>Assist Customer in responding to Data Subject requests</li>
            <li>Forward any requests received directly to Customer</li>
            <li>Provide tools for Customer to respond to requests where possible</li>
          </ul>

          <h3>5.6 Data Breach Notification</h3>
          <ul>
            <li>Notify Customer within 72 hours of discovering a Personal Data breach</li>
            <li>Provide information needed for Customer to comply with breach notification obligations</li>
            <li>Cooperate with Customer's investigation and remediation</li>
          </ul>

          <h3>5.7 Audits</h3>
          <ul>
            <li>Make available information needed to demonstrate compliance</li>
            <li>Allow and contribute to audits and inspections</li>
            <li>Provide SOC 2 reports and other certifications upon request</li>
          </ul>

          <h3>5.8 Data Deletion</h3>
          <ul>
            <li>Delete or return Personal Data upon termination at Customer's choice</li>
            <li>Delete existing copies unless retention is required by law</li>
            <li>Provide certification of deletion upon request</li>
          </ul>

          <h2>6. International Transfers</h2>

          <h3>6.1 Transfer Mechanisms</h3>
          <p>
            For transfers of Personal Data outside the EEA, UK, or Switzerland, Axxiom will use:
          </p>
          <ul>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>UK International Data Transfer Agreement where applicable</li>
            <li>Other lawful transfer mechanisms as appropriate</li>
          </ul>

          <h3>6.2 Supplementary Measures</h3>
          <p>
            Axxiom implements supplementary technical and organizational measures including:
          </p>
          <ul>
            <li>Strong encryption (TLS 1.3, AES-256)</li>
            <li>Access controls and authentication</li>
            <li>Data minimization and pseudonymization</li>
            <li>Security monitoring and incident response</li>
          </ul>

          <h2>7. CCPA Provisions</h2>
          <p>For Personal Information subject to the CCPA:</p>
          <ul>
            <li>Axxiom is a "Service Provider" under the CCPA</li>
            <li>Axxiom will not sell Personal Information</li>
            <li>Axxiom will not retain, use, or disclose Personal Information except as permitted</li>
            <li>Axxiom will comply with CCPA requirements and assist with consumer requests</li>
          </ul>

          <h2>8. Liability</h2>
          <p>
            Each party's liability under this DPA is subject to the limitations in the Service Agreement.
            Nothing in this DPA limits liability for breaches of Data Protection Laws.
          </p>

          <h2>9. Term and Termination</h2>
          <p>
            This DPA remains in effect for the duration of the Service Agreement. Certain obligations
            survive termination as specified herein.
          </p>

          <h2>Annex A: Approved Sub-processors</h2>
          <table>
            <thead>
              <tr>
                <th>Sub-processor</th>
                <th>Purpose</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Google Cloud Platform</td>
                <td>Cloud infrastructure</td>
                <td>USA (with EU region options)</td>
              </tr>
              <tr>
                <td>Stripe</td>
                <td>Payment processing</td>
                <td>USA</td>
              </tr>
              <tr>
                <td>SendGrid</td>
                <td>Email delivery</td>
                <td>USA</td>
              </tr>
              <tr>
                <td>Intercom</td>
                <td>Customer support</td>
                <td>USA</td>
              </tr>
              <tr>
                <td>MongoDB Atlas</td>
                <td>Database services</td>
                <td>USA (with EU region options)</td>
              </tr>
            </tbody>
          </table>

          <h2>Contact</h2>
          <p>For DPA-related inquiries:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:dpa@axxiom.io">dpa@axxiom.io</a></li>
            <li><strong>DPO:</strong> <a href="mailto:dpo@axxiom.io">dpo@axxiom.io</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
