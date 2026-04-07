import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';

export default function TermsOfUseContent() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
      <Text variant="title" weight="bold">{t('tou_title')}</Text>
      <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
        {t('tou_last_updated')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_intro')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_guidelines_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_guidelines_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_etiquette_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_etiquette_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_payment_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_payment_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_cancellation_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_cancellation_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_feedback_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_feedback_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_promotions_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_promotions_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tou_section_contact_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tou_section_contact_body')}</Text>
      <Text variant="body" color={colors.text}>{`• ${t('tou_contact_email')}`}</Text>
      <Text variant="body" color={colors.text} style={styles.contactLine}>{`• ${t('tou_contact_address')}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contactLine: { marginTop: 4 },
  container: { padding: 16 },
  heading: { marginBottom: 6, marginTop: 20 },
  lastUpdated: { marginBottom: 12, marginTop: 4 },
  paragraph: { lineHeight: 22 },
});
