import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  email: string;
};

export default function DeleteAccountEmailStep({ email }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  return (
    <View style={styles.container}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        {t('delete_account_step_label')}
      </Text>
      <Text variant="title" weight="bold" color={colors.text} style={styles.heading}>
        {t('delete_account_final_heading')}
      </Text>
      <Text variant="body" color={colors.mutedText} style={styles.description}>
        {t('delete_account_final_description')}
      </Text>

      <Text variant="body" weight="medium" color={colors.text} style={styles.emailLabel}>
        {t('delete_account_email_label')}
      </Text>
      <View style={[styles.emailBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text variant="body" color={colors.mutedText}>
          {email || t('delete_account_email_placeholder')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  description: {
    marginBottom: 16,
    marginTop: 4,
  },
  emailBox: {
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  emailLabel: {
    marginTop: 4,
  },
  heading: {
    marginTop: 4,
  },
  label: {
    marginBottom: 2,
  },
});
