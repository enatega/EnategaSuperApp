import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalScreenContainer from '../../components/settings/LegalScreenContainer';
import LegalCard from '../../components/settings/LegalCard';
import LegalSection from '../../components/settings/LegalSection';
import LegalParagraph from '../../components/settings/LegalParagraph';
import LegalListItem from '../../components/settings/LegalListItem';

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation('rideSharing');

  return (
    <LegalScreenContainer title={t('settings_terms_conditions')}>
      <LegalCard title="Terms of use" lastUpdated="last updated 2 months ago">
        <LegalParagraph>
          These Terms of Use ("Terms") govern your access to and use of LO Drive. By creating an account or using the app, you agree to follow these Terms. If you do not agree, please do not use LO Drive.
        </LegalParagraph>

        <LegalSection title="Use of Service" />
        <LegalParagraph>
          LO Drive provides secure storage and file management services. You may use the app for personal or business purposes as long as you follow these Terms and all applicable laws. You must keep your login credentials safe and are responsible for all activities under your account.
        </LegalParagraph>
        <LegalParagraph>
          You may not misuse LO Drive by attempting to hack, disrupt, copy, or resell our services. Any attempt to bypass security, overload servers, or use the service for illegal activity is strictly prohibited.
        </LegalParagraph>

        <LegalSection title="User Content" />
        <LegalParagraph>
          You remain the owner of the files, documents, and content you upload to LO Drive. By uploading, you grant us a limited right to store, process, and transmit that content solely for the purpose of providing the service.
        </LegalParagraph>
        <LegalParagraph>
          You are responsible for ensuring that your content is legal and does not violate intellectual property rights, privacy rights, or any applicable law. LO Drive does not actively monitor user content but reserves the right to remove or disable access to content that appears unlawful or harmful.
        </LegalParagraph>

        <LegalSection title="Service Availability and Updates" />
        <LegalParagraph>
          We aim to keep LO Drive reliable and available at all times, but we cannot guarantee uninterrupted service. Occasional downtime may occur due to maintenance, updates, or technical issues.
        </LegalParagraph>
        <LegalParagraph>
          We may provide updates or new features to improve functionality. Some updates may be required for continued use of the app, and these Terms apply to all updated versions unless stated otherwise.
        </LegalParagraph>

        <LegalSection title="Limitation of Liability" />
        <LegalParagraph>
          LO Drive is provided "as is" and "as available." While we work to protect your files and data, we cannot guarantee absolute security or uninterrupted access. To the maximum extent allowed by the laws of Qatar, LO Drive will not be responsible for indirect or consequential damages, such as lost data, lost profits, or business interruptions.
        </LegalParagraph>

        <LegalSection title="Governing Law" />
        <LegalParagraph>
          These Terms are governed by the laws of Qatar. Any dispute arising from the use of LO Drive will be handled exclusively in the courts of Qatar.
        </LegalParagraph>

        <LegalSection title="Contact Us" />
        <LegalParagraph>
          If you have questions about these Terms, please contact us:
        </LegalParagraph>
        <LegalListItem>• Email: contact@lodrive.com</LegalListItem>
        <LegalListItem>• Address: Doha, Qatar</LegalListItem>
      </LegalCard>
    </LegalScreenContainer>
  );
}
