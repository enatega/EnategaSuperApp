import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalScreenContainer from '../../components/settings/LegalScreenContainer';
import LegalCard from '../../components/settings/LegalCard';
import LegalSection from '../../components/settings/LegalSection';
import LegalParagraph from '../../components/settings/LegalParagraph';
import LegalListItem from '../../components/settings/LegalListItem';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation('rideSharing');

  return (
    <LegalScreenContainer title={t('settings_privacy')}>
      <LegalCard title="Privacy policy" lastUpdated="last updated 2 months ago">
        <LegalParagraph>
          At LO Drive, your privacy and trust are our top priority. This Privacy Policy explains how we handle your information when you use our app. By using LO Drive, you agree to the practices described below.
        </LegalParagraph>

        <LegalSection title="Information We Collect" />
        <LegalParagraph>
          When you use LO Drive, we may collect the following types of information:
        </LegalParagraph>
        <LegalListItem>1. Account Information - When you create an account, we collect your name, email address, password, and any other details you provide during registration.</LegalListItem>
        <LegalListItem>2. Files & Content - The documents, photos, videos, and other files you upload, store, or share through LO Drive.</LegalListItem>
        <LegalListItem>3. Device & Technical Data — Device type, operating system, app version, IP address, log files, and usage Statistics that help us improve our services.</LegalListItem>
        <LegalListItem>4. Support & Communication — Any messages, feedback, or support requests you send to us.</LegalListItem>
        <LegalListItem>5. Optional Information — Preferences or settings you adjust within the app.</LegalListItem>

        <LegalSection title="How We Use Your Information" />
        <LegalParagraph>
          We use your information for purposes including, but not limited to:
        </LegalParagraph>
        <LegalListItem>• Service Delivery: To provide secure file storage, sharing, and related features.</LegalListItem>
        <LegalListItem>• Account Management: To authenticate users, manage accounts, and provide customer support.</LegalListItem>
        <LegalListItem>• Improvement & Personalization: To understand how LO Drive is used and enhance user experience.</LegalListItem>
        <LegalListItem>• Security & Safety: To prevent fraud, unauthorized access, and abuse of our platform.</LegalListItem>
        <LegalListItem>• Legal Compliance: To comply with applicable laws and regulations.</LegalListItem>
        <LegalListItem>• Communication: To send you service-related updates, notifications, or responses to your inquiries.</LegalListItem>

        <LegalSection title="How We Share Your Information" />
        <LegalParagraph>
          We respect your privacy and do not sell your personal data. We may share your information only in the following cases:
        </LegalParagraph>
        <LegalListItem>• With Your Consent: When you choose to share files or invite collaborators.</LegalListItem>
        <LegalListItem>• Service Providers: With trusted third parties that provide hosting, storage, analytics, or customer support.</LegalListItem>
        <LegalListItem>• Legal Requirements: If required by law, regulation, or valid legal process.</LegalListItem>
        <LegalListItem>• Protection: When necessary to protect the rights, safety, or property of LO Drive, our users, or the public.</LegalListItem>

        <LegalSection title="Data Security" />
        <LegalParagraph>
          We use industry-standard measures such as encryption, secure servers, and access controls to protect your data. While we take all reasonable steps to secure your information, no method of transmission or storage is completely secure. We encourage you to also use strong passwords and maintain your own device security.
        </LegalParagraph>

        <LegalSection title="Your Rights" />
        <LegalParagraph>
          Depending on your location, you may have the following rights:
        </LegalParagraph>
        <LegalListItem>• Access: Request a copy of your personal data.</LegalListItem>
        <LegalListItem>• Correction: Request updates or corrections to inaccurate information.</LegalListItem>
        <LegalListItem>• Deletion: Request permanent deletion of your files and account.</LegalListItem>
        <LegalListItem>• Restriction: Limit certain processing of your data.</LegalListItem>
        <LegalListItem>• Portability: Request your data in a portable format.</LegalListItem>
        <LegalListItem>• Opt-Out: Unsubscribe from marketing communications.</LegalListItem>

        <LegalSection title="Changes to This Privacy Policy" />
        <LegalParagraph>
          We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the app, by email, or by posting a notice on our website prior to the changes taking effect. Please review this Policy regularly to stay informed.
        </LegalParagraph>

        <LegalSection title="Contact Us" />
        <LegalParagraph>
          If you have any questions, concerns, or requests regarding this Privacy Policy, you can contact us at:
        </LegalParagraph>
        <LegalListItem>• Email: contact@lodrive.com</LegalListItem>
      </LegalCard>
    </LegalScreenContainer>
  );
}
