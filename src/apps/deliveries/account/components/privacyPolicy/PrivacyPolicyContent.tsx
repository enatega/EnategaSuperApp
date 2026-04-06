import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';

export default function PrivacyPolicyContent() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
      <Text variant="title" weight="bold">
        {t('privacy_title')}
      </Text>
      <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
        {t('privacy_last_updated')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_intro')}
      </Text>

      <Text variant="body" weight="bold" style={styles.sectionHeading}>
        {t('privacy_section_app_title')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_section_app_body')}
      </Text>

      <Text variant="body" weight="bold" style={styles.sectionHeading}>
        {t('privacy_section_responsibilities_title')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_section_responsibilities_body')}
      </Text>

      <Text variant="body" weight="bold" style={styles.sectionHeading}>
        {t('privacy_section_data_title')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_section_data_body')}
      </Text>

      <Text variant="body" weight="bold" style={styles.sectionHeading}>
        {t('privacy_section_modifications_title')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_section_modifications_body')}
      </Text>

      <Text variant="body" weight="bold" style={styles.sectionHeading}>
        {t('privacy_section_payment_title')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_section_payment_body')}
      </Text>

      <Text variant="body" weight="bold" style={styles.sectionHeading}>
        {t('privacy_section_contact_title')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>
        {t('privacy_section_contact_body')}
      </Text>
      <Text variant="body" color={colors.text}>
        {`• ${t('privacy_contact_email')}`}
      </Text>
      <Text variant="body" color={colors.text} style={styles.contactLine}>
        {`• ${t('privacy_contact_address')}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contactLine: {
    marginTop: 4,
  },
  container: {
    padding: 16,
  },
  lastUpdated: {
    marginBottom: 12,
    marginTop: 4,
  },
  paragraph: {
    lineHeight: 22,
  },
  sectionHeading: {
    marginBottom: 6,
    marginTop: 20,
  },
});
