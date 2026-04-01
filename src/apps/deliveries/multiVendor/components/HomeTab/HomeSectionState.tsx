import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Tone = 'empty' | 'error';

type Props = {
  message?: string;
  tone?: Tone;
  title?: string;
};

export default function HomeSectionState({
  message,
  tone = 'empty',
  title,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const isError = tone === 'error';
  const resolvedTitle = title ?? (isError
    ? t('multi_vendor_home_section_error_title')
    : t('multi_vendor_home_section_empty_title'));
  const resolvedMessage = message ?? (isError
    ? t('multi_vendor_home_section_error_message')
    : t('multi_vendor_home_section_empty_message'));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isError ? 'rgba(239, 68, 68, 0.06)' : colors.backgroundTertiary,
          borderColor: isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(17, 24, 39, 0.06)',
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : colors.surface,
          },
        ]}
      >
        <Icon
          type="Feather"
          name={isError ? 'alert-circle' : 'package'}
          size={16}
          color={isError ? colors.danger : colors.iconMuted}
        />
      </View>

      <View style={styles.textContent}>
        <Text
          weight="semiBold"
          style={{
            color: isError ? colors.danger : colors.text,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {resolvedTitle}
        </Text>
        <Text
          style={{
            color: isError ? colors.danger : colors.mutedText,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {resolvedMessage}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  textContent: {
    flex: 1,
    gap: 2,
  },
});
