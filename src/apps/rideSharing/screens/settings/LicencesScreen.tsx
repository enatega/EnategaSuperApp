import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalScreenContainer from '../../components/settings/LegalScreenContainer';
import LegalCard from '../../components/settings/LegalCard';
import LegalParagraph from '../../components/settings/LegalParagraph';
import LegalListItem from '../../components/settings/LegalListItem';

export default function LicencesScreen() {
  const { t } = useTranslation('rideSharing');

  return (
    <LegalScreenContainer title={t('settings_licences')}>
      <LegalCard title="Licenses" lastUpdated="Effective Date: 23 September 2025">
        <LegalParagraph>
          This License Agreement is a legal contract between you and LO Drive. By downloading or using the app, you agree to these terms.
        </LegalParagraph>

        <LegalParagraph>
          You are granted a limited, non-exclusive, non-transferable license to use LO Drive on your device for personal or internal business purposes. You may not copy, modify, distribute, or sell the app. You also may not attempt to reverse engineer, decompile, or interfere with its operation or security. All rights to the app, including its code, design, logos, and trademarks, remain the property of LO Drive.
        </LegalParagraph>

        <LegalParagraph>
          The content you upload remains yours. LO Drive only stores, processes, and transmits it to provide the service. You are responsible for ensuring that your content is lawful and does not infringe on the rights of others. Sharing your content with others is your choice and responsibility.
        </LegalParagraph>

        <LegalParagraph>
          From time to time we may provide updates or improvements. Some updates may be necessary for the app to function properly. These terms will continue to apply to all future versions unless stated otherwise.
        </LegalParagraph>

        <LegalParagraph>
          If you violate this agreement or misuse the service, your access may be suspended or terminated. Once terminated, you must stop using the app and delete it from your devices.
        </LegalParagraph>

        <LegalParagraph>
          LO Drive is provided on an "as is" basis without warranties of any kind. While we work to keep services reliable and secure, we do not guarantee uninterrupted availability, complete security, or error-free performance. To the maximum extent allowed by Qatari law, we are not responsible for indirect or consequential damages such as lost files, lost profits, or device issues caused by the use of the app.
        </LegalParagraph>

        <LegalParagraph>
          This Agreement is governed by the laws of Qatar. Any disputes will fall under the jurisdiction of the courts of Qatar.
        </LegalParagraph>

        <LegalParagraph>
          For questions regarding this Agreement, contact us at:
        </LegalParagraph>
        <LegalListItem>• Email: contact@lodrive.com</LegalListItem>
        <LegalListItem>• Address: Doha, Qatar</LegalListItem>
      </LegalCard>
    </LegalScreenContainer>
  );
}
