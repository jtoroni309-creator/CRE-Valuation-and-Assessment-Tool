import { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Eye,
  Server,
  Key,
  Users,
  FileText,
  CheckCircle,
  Globe,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security',
  description: 'Axxiom Security - Learn about our comprehensive security measures, certifications, and commitment to protecting your data.',
  openGraph: {
    title: 'Security | Axxiom',
    description: 'Our commitment to protecting your data.',
  },
};

export default function SecurityPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-primary-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Security</h1>
          <p className="text-gray-400">Last updated: November 30, 2024</p>
        </div>

        <div className="prose-dark">
          <p>
            At Axxiom, security is fundamental to everything we do. We understand that you trust us with sensitive
            property and financial data, and we take that responsibility seriously. This page outlines our
            comprehensive approach to security.
          </p>

          <h2>1. Certifications and Compliance</h2>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">SOC 2 Type II</h4>
                  <p className="text-gray-400 text-sm">Audited annually</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">ISO 27001</h4>
                  <p className="text-gray-400 text-sm">Certified ISMS</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">GDPR Compliant</h4>
                  <p className="text-gray-400 text-sm">EU data protection</p>
                </div>
              </div>
            </div>
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">CCPA Compliant</h4>
                  <p className="text-gray-400 text-sm">California privacy</p>
                </div>
              </div>
            </div>
          </div>

          <h2>2. Infrastructure Security</h2>

          <h3>2.1 Cloud Infrastructure</h3>
          <p>
            Our platform runs on Google Cloud Platform (GCP), which maintains the highest levels of security:
          </p>
          <ul>
            <li>Data centers with 24/7 physical security, biometric access, and video surveillance</li>
            <li>Redundant power, cooling, and network connectivity</li>
            <li>Regular third-party security audits</li>
            <li>Compliance with SOC 1/2/3, ISO 27001, PCI DSS, and more</li>
          </ul>

          <h3>2.2 Network Security</h3>
          <ul>
            <li>Web Application Firewall (WAF) protection</li>
            <li>DDoS protection and mitigation</li>
            <li>Network segmentation and VPC isolation</li>
            <li>Intrusion detection and prevention systems</li>
            <li>Regular vulnerability scanning and penetration testing</li>
          </ul>

          <h2>3. Data Encryption</h2>

          <h3>3.1 In Transit</h3>
          <ul>
            <li>TLS 1.3 for all data transmission</li>
            <li>HTTPS enforced across all endpoints</li>
            <li>Certificate transparency monitoring</li>
            <li>HSTS preloading enabled</li>
          </ul>

          <h3>3.2 At Rest</h3>
          <ul>
            <li>AES-256 encryption for all stored data</li>
            <li>Customer-managed encryption keys available (Enterprise)</li>
            <li>Encrypted backups with geographic redundancy</li>
            <li>Secure key management using Cloud KMS</li>
          </ul>

          <h2>4. Access Control</h2>

          <h3>4.1 Authentication</h3>
          <ul>
            <li>Multi-factor authentication (MFA) available and recommended</li>
            <li>SSO integration (SAML, OIDC) for Enterprise customers</li>
            <li>Strong password requirements enforced</li>
            <li>Session management with automatic timeout</li>
            <li>Brute force protection and account lockout</li>
          </ul>

          <h3>4.2 Authorization</h3>
          <ul>
            <li>Role-based access control (RBAC)</li>
            <li>Principle of least privilege</li>
            <li>Granular permissions per feature and data</li>
            <li>API key management with scoped access</li>
          </ul>

          <h3>4.3 Employee Access</h3>
          <ul>
            <li>Background checks for all employees</li>
            <li>Security training and awareness programs</li>
            <li>Just-in-time access for production systems</li>
            <li>Access logging and monitoring</li>
            <li>Regular access reviews</li>
          </ul>

          <h2>5. Application Security</h2>

          <h3>5.1 Secure Development</h3>
          <ul>
            <li>Secure Software Development Lifecycle (SSDLC)</li>
            <li>Code reviews required for all changes</li>
            <li>Static and dynamic application security testing (SAST/DAST)</li>
            <li>Dependency vulnerability scanning</li>
            <li>Regular security training for developers</li>
          </ul>

          <h3>5.2 Testing</h3>
          <ul>
            <li>Annual third-party penetration testing</li>
            <li>Continuous automated security scanning</li>
            <li>Bug bounty program for responsible disclosure</li>
            <li>Regular security assessments and audits</li>
          </ul>

          <h2>6. Data Protection</h2>

          <h3>6.1 Data Handling</h3>
          <ul>
            <li>Data classification and handling procedures</li>
            <li>Data minimization and purpose limitation</li>
            <li>Automatic data retention and deletion</li>
            <li>Secure data disposal procedures</li>
          </ul>

          <h3>6.2 Privacy by Design</h3>
          <ul>
            <li>Privacy impact assessments for new features</li>
            <li>Data anonymization for analytics and AI training</li>
            <li>Customer data isolation in multi-tenant environment</li>
            <li>Configurable data retention policies</li>
          </ul>

          <h2>7. Incident Response</h2>

          <h3>7.1 Detection and Response</h3>
          <ul>
            <li>24/7 security monitoring and alerting</li>
            <li>Security Information and Event Management (SIEM)</li>
            <li>Documented incident response procedures</li>
            <li>Incident response team on-call</li>
          </ul>

          <h3>7.2 Notification</h3>
          <ul>
            <li>Breach notification within 72 hours as required by law</li>
            <li>Detailed incident reports provided to affected customers</li>
            <li>Root cause analysis and remediation plans</li>
          </ul>

          <h2>8. Business Continuity</h2>

          <h3>8.1 Availability</h3>
          <ul>
            <li>99.99% uptime SLA for Enterprise customers</li>
            <li>Multi-region deployment for high availability</li>
            <li>Automatic failover and load balancing</li>
            <li>Real-time system status at <a href="https://status.axxiom.io">status.axxiom.io</a></li>
          </ul>

          <h3>8.2 Disaster Recovery</h3>
          <ul>
            <li>Regular backup testing and validation</li>
            <li>Geographic backup replication</li>
            <li>Documented disaster recovery procedures</li>
            <li>Recovery time objective (RTO): 4 hours</li>
            <li>Recovery point objective (RPO): 1 hour</li>
          </ul>

          <h2>9. Vendor Security</h2>
          <ul>
            <li>Security assessments for all vendors</li>
            <li>Contractual security requirements</li>
            <li>Regular vendor reviews and monitoring</li>
            <li>Limited data sharing with vendors</li>
          </ul>

          <h2>10. Security Resources</h2>
          <ul>
            <li><strong>Security Whitepaper:</strong> Available upon request</li>
            <li><strong>SOC 2 Report:</strong> Available under NDA</li>
            <li><strong>Penetration Test Summary:</strong> Available upon request</li>
            <li><strong>Security Questionnaires:</strong> We support SIG, CAIQ, and custom formats</li>
          </ul>

          <h2>11. Reporting Security Issues</h2>
          <p>
            If you discover a security vulnerability, please report it responsibly:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:security@axxiom.io">security@axxiom.io</a></li>
            <li><strong>Bug Bounty:</strong> <a href="https://hackerone.com/axxiom">hackerone.com/axxiom</a></li>
          </ul>
          <p>
            We appreciate responsible disclosure and will acknowledge valid reports promptly.
          </p>

          <h2>Contact</h2>
          <p>For security-related inquiries:</p>
          <ul>
            <li><strong>Security Team:</strong> <a href="mailto:security@axxiom.io">security@axxiom.io</a></li>
            <li><strong>Compliance:</strong> <a href="mailto:compliance@axxiom.io">compliance@axxiom.io</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
