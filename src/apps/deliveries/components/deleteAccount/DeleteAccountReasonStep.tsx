import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  selectedReason: string | null;
  onSelectReason: (reason: string) => void;
};

export default function DeleteAccountReasonStep({ selectedReason, onSelectReason }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  const reasons: string[] = [
    t('delete_account_reason_mistake'),
    t('delete_account_reason_no_longer'),
    t('delete_account_reason_no_venues'),
    t('delete_account_reason_other'),
  ];

  return (
    <View style={styles.container}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        {t('delete_account_step_label')}
      </Text>
      <Text variant="title" weight="bold" color={colors.text} style={styles.heading}>
        {t('delete_account_sorry_heading')}
      </Text>
      <Text variant="body" color={colors.mutedText} style={styles.subtext}>
        {t('delete_account_sorry_subtext')}{' '}
        <Text variant="body" color={colors.primary}>
          {t('delete_account_contact_email')}
        </Text>
      </Text>

      <Text variant="subtitle" weight="bold" color={colors.text} style={styles.reasonHeading}>
        {t('delete_account_reason_heading')}
      </Text>
      <Text variant="body" color={colors.mutedText} style={styles.reasonSubtext}>
        {t('delete_account_reason_subtext')}
      </Text>

      <View style={styles.options}>
        {reasons.map((reason) => {
          const isSelected = selectedReason === reason;
          return (
            <Pressable
              key={reason}
              onPress={() => onSelectReason(reason)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={reason}
              style={styles.option}
            >
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                {isSelected && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text variant="body" color={colors.text} style={styles.optionText}>
                {reason}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  heading: {
    marginTop: 4,
  },
  label: {
    marginBottom: 2,
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  optionText: {
    flex: 1,
  },
  options: {
    gap: 4,
    marginTop: 8,
  },
  radio: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioInner: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  reasonHeading: {
    marginTop: 16,
  },
  reasonSubtext: {
    marginBottom: 4,
  },
  subtext: {
    marginTop: 4,
  },
});
