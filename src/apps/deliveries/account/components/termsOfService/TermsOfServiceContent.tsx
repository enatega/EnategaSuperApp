import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';

export default function TermsOfServiceContent() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.container}>
      <Text variant="title" weight="bold">{t('tos_title')}</Text>
      <Text variant="caption" color={colors.mutedText} style={styles.lastUpdated}>
        {t('tos_last_updated')}
      </Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_intro')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tos_section_usage_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_section_usage_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tos_section_orders_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_section_orders_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tos_section_payment_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_section_payment_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tos_section_delivery_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_section_delivery_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tos_section_support_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_section_support_body')}</Text>

      <Text variant="body" weight="bold" style={styles.heading}>{t('tos_section_contact_title')}</Text>
      <Text variant="body" color={colors.text} style={styles.paragraph}>{t('tos_section_contact_body')}</Text>
      <Text variant="body" color={colors.text}>{`• ${t('tos_contact_email')}`}</Text>
      <Text variant="body" color={colors.text} style={styles.contactLine}>{`• ${t('tos_contact_address')}`}</Text>
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
