import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Axxiom Terms of Service - The legal agreement governing your use of our platform and services.',
  openGraph: {
    title: 'Terms of Service | Axxiom',
    description: 'The legal agreement governing your use of our platform.',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you and Axxiom Technologies, Inc.
            ("Axxiom," "we," "us," or "our") governing your access to and use of our AI-powered commercial real estate
            valuation platform and related services (collectively, the "Services").
          </p>

          <p>
            <strong>PLEASE READ THESE TERMS CAREFULLY. BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE
            TERMS. IF YOU DO NOT AGREE, DO NOT USE OUR SERVICES.</strong>
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, accessing, or using our Services, you represent that you:
          </p>
          <ul>
            <li>Are at least 18 years of age</li>
            <li>Have the legal authority to enter into these Terms</li>
            <li>If acting on behalf of an organization, have authority to bind that organization</li>
            <li>Are not prohibited from using the Services under applicable law</li>
          </ul>

          <h2>2. Description of Services</h2>
          <p>
            Axxiom provides an AI-powered platform for commercial real estate valuation, analysis, and decision-making.
            Our Services include, but are not limited to:
          </p>
          <ul>
            <li>AI-driven property valuation using multiple approaches</li>
            <li>Market analysis and predictive analytics</li>
            <li>Document processing and data extraction</li>
            <li>Property image analysis and condition assessment</li>
            <li>Portfolio management and reporting tools</li>
            <li>API access for integration with other systems</li>
          </ul>

          <h2>3. Account Registration</h2>

          <h3>3.1 Account Creation</h3>
          <p>
            To use our Services, you must create an account with accurate, complete, and current information.
            You are responsible for maintaining the confidentiality of your account credentials.
          </p>

          <h3>3.2 Account Security</h3>
          <p>
            You are responsible for all activities under your account. You must immediately notify us of any
            unauthorized use at <a href="mailto:security@axxiom.io">security@axxiom.io</a>.
          </p>

          <h3>3.3 Account Termination</h3>
          <p>
            We may suspend or terminate your account if you violate these Terms or engage in fraudulent,
            abusive, or illegal activity.
          </p>

          <h2>4. Subscription Plans and Payment</h2>

          <h3>4.1 Subscription Tiers</h3>
          <p>
            We offer various subscription plans with different features and usage limits. Details are available
            on our <Link href="/pricing">pricing page</Link>.
          </p>

          <h3>4.2 Fees and Billing</h3>
          <ul>
            <li>Fees are charged in advance on a monthly or annual basis</li>
            <li>All fees are non-refundable except as required by law</li>
            <li>We may change fees with 30 days' notice</li>
            <li>You are responsible for all applicable taxes</li>
          </ul>

          <h3>4.3 Free Trials</h3>
          <p>
            Free trials may be offered at our discretion. At the end of a trial, you will be charged unless you cancel.
          </p>

          <h3>4.4 Cancellation</h3>
          <p>
            You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
            No refunds are provided for partial periods.
          </p>

          <h2>5. Acceptable Use</h2>

          <h3>5.1 Permitted Use</h3>
          <p>
            You may use our Services only for lawful purposes related to commercial real estate valuation,
            analysis, and decision-making.
          </p>

          <h3>5.2 Prohibited Conduct</h3>
          <p>You may not:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code or interfere with our systems</li>
            <li>Attempt to gain unauthorized access to our Services</li>
            <li>Use the Services to discriminate against protected classes</li>
            <li>Reverse engineer, decompile, or disassemble our software</li>
            <li>Resell or redistribute our Services without authorization</li>
            <li>Use automated means to access our Services (except via our API)</li>
            <li>Misrepresent AI-generated outputs as human-created appraisals</li>
            <li>Use our Services in a way that could harm our reputation</li>
          </ul>
          <p>
            For complete details, see our <Link href="/legal/acceptable-use">Acceptable Use Policy</Link>.
          </p>

          <h2>6. Intellectual Property</h2>

          <h3>6.1 Our IP</h3>
          <p>
            Axxiom and its licensors own all intellectual property rights in the Services, including software,
            algorithms, models, designs, and documentation. These Terms grant you a limited license to use the
            Services, not ownership of any IP.
          </p>

          <h3>6.2 Your Content</h3>
          <p>
            You retain ownership of content you upload ("Your Content"). You grant us a worldwide, non-exclusive
            license to use Your Content as necessary to provide the Services. This includes using anonymized data
            to improve our AI models.
          </p>

          <h3>6.3 Feedback</h3>
          <p>
            If you provide feedback or suggestions, we may use them without obligation to you.
          </p>

          <h2>7. AI-Generated Content</h2>

          <h3>7.1 Nature of AI Outputs</h3>
          <p>
            Our AI-generated valuations and analyses are estimates based on available data and algorithms.
            They are not certified appraisals and should not be used as the sole basis for investment decisions.
          </p>

          <h3>7.2 Professional Judgment</h3>
          <p>
            AI outputs should be reviewed by qualified professionals. We recommend consulting with licensed
            appraisers, attorneys, and financial advisors for significant decisions.
          </p>

          <h3>7.3 No Guarantee</h3>
          <p>
            We do not guarantee the accuracy, completeness, or suitability of AI-generated content for any purpose.
            Market conditions and property values can change rapidly.
          </p>

          <h2>8. Disclaimer of Warranties</h2>
          <p>
            <strong>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</strong>
          </p>
          <p>We do not warrant that:</p>
          <ul>
            <li>The Services will be uninterrupted or error-free</li>
            <li>Defects will be corrected</li>
            <li>The Services are free of viruses or harmful components</li>
            <li>AI-generated outputs will be accurate or reliable</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, AXXIOM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM
            YOUR USE OF THE SERVICES.</strong>
          </p>
          <p>
            <strong>OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICES SHALL
            NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</strong>
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Axxiom and its officers, directors, employees,
            and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees)
            arising from:
          </p>
          <ul>
            <li>Your use of the Services</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Your Content</li>
          </ul>

          <h2>11. Confidentiality</h2>
          <p>
            Each party agrees to keep confidential any non-public information disclosed by the other party.
            This obligation survives termination of these Terms for 3 years.
          </p>

          <h2>12. Third-Party Services</h2>
          <p>
            Our Services may integrate with third-party services (e.g., data providers, mapping services).
            Your use of third-party services is subject to their terms and policies. We are not responsible
            for third-party services.
          </p>

          <h2>13. Modifications</h2>
          <p>
            We may modify these Terms at any time. We will provide notice of material changes through the
            Services or by email. Your continued use after changes constitutes acceptance.
          </p>

          <h2>14. Termination</h2>
          <p>
            Either party may terminate these Terms at any time. Upon termination:
          </p>
          <ul>
            <li>Your access to the Services will cease</li>
            <li>You must pay any outstanding fees</li>
            <li>You may request export of Your Content for 30 days</li>
            <li>Provisions that should survive will remain in effect</li>
          </ul>

          <h2>15. Dispute Resolution</h2>

          <h3>15.1 Governing Law</h3>
          <p>
            These Terms are governed by the laws of the State of California, without regard to conflict of law principles.
          </p>

          <h3>15.2 Arbitration</h3>
          <p>
            Any disputes shall be resolved through binding arbitration under the AAA Commercial Arbitration Rules
            in San Francisco, California. You waive the right to participate in class actions.
          </p>

          <h3>15.3 Exceptions</h3>
          <p>
            Either party may seek injunctive relief in court for IP infringement or unauthorized access.
          </p>

          <h2>16. General Provisions</h2>
          <ul>
            <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between the parties.</li>
            <li><strong>Severability:</strong> If any provision is unenforceable, the remainder stays in effect.</li>
            <li><strong>Waiver:</strong> Failure to enforce a right does not waive that right.</li>
            <li><strong>Assignment:</strong> You may not assign these Terms without our consent.</li>
            <li><strong>Force Majeure:</strong> Neither party is liable for delays due to circumstances beyond control.</li>
            <li><strong>Notices:</strong> We may send notices via email or through the Services.</li>
          </ul>

          <h2>17. Contact Us</h2>
          <p>For questions about these Terms, contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:legal@axxiom.io">legal@axxiom.io</a></li>
            <li><strong>Mail:</strong> Axxiom Technologies, Inc., Attn: Legal Department, 100 Market Street, Suite 500, San Francisco, CA 94105</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
