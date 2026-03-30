import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onPressHelpful?: (isHelpful: boolean) => void;
};

export default function SupportFaqHelpfulActions({ onPressHelpful }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <Text
        color={colors.mutedText}
        weight="medium"
        style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
      >
        {t('support_faq_feedback_prompt')}
      </Text>

      <View style={styles.actions}>
        <Button
          label={t('support_faq_feedback_yes')}
          variant="secondary"
          onPress={() => onPressHelpful?.(true)}
          style={styles.button}
        />
        <Button
          label={t('support_faq_feedback_no')}
          variant="secondary"
          onPress={() => onPressHelpful?.(false)}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    minHeight: 32,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
    width: '100%',
  },
});
