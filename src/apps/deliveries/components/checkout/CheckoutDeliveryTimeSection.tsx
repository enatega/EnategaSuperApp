import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CheckoutDeliveryTimeMode } from './checkoutScheduleUtils';

type Props = {
  isScheduleEnabled: boolean;
  onSchedulePress: () => void;
  onSelectMode: (mode: CheckoutDeliveryTimeMode) => void;
  scheduledLabel?: string | null;
  selectedMode: CheckoutDeliveryTimeMode;
};

export default function CheckoutDeliveryTimeSection({
  isScheduleEnabled,
  onSchedulePress,
  selectedMode,
  scheduledLabel,
  onSelectMode,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.h5,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {t('checkout_delivery_time_title')}
      </Text>

      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected: selectedMode === 'standard' }}
        onPress={() => onSelectMode('standard')}
        style={[
          styles.option,
          {
            backgroundColor: colors.surface,
            borderColor: selectedMode === 'standard' ? colors.blue800 : colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Ionicons
          color={selectedMode === 'standard' ? colors.blue800 : colors.border}
          name={selectedMode === 'standard' ? 'radio-button-on' : 'radio-button-off'}
          size={18}
        />
        <View style={styles.optionText}>
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {t('checkout_delivery_time_standard')}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {t('checkout_delivery_time_standard_eta')}
          </Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected: selectedMode === 'schedule', disabled: !isScheduleEnabled }}
        disabled={!isScheduleEnabled}
        onPress={() => {
          onSelectMode('schedule');
          onSchedulePress();
        }}
        style={[
          styles.option,
          {
            backgroundColor: colors.surface,
            borderColor: selectedMode === 'schedule' ? colors.blue800 : colors.border,
            opacity: isScheduleEnabled ? 1 : 0.5,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Ionicons
          color={selectedMode === 'schedule' ? colors.blue800 : colors.border}
          name={selectedMode === 'schedule' ? 'radio-button-on' : 'radio-button-off'}
          size={18}
        />
        <View style={styles.optionText}>
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {t('checkout_delivery_time_schedule')}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {selectedMode === 'schedule' && scheduledLabel
              ? scheduledLabel
              : t('checkout_delivery_time_schedule_hint')}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: 'flex-start',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
