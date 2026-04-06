import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CheckoutOrderType } from '../../api/orderServiceTypes';

type Props = {
  activeMode: CheckoutOrderType;
  isDeliveryEnabled: boolean;
  isPickupEnabled: boolean;
  onModeChange: (mode: CheckoutOrderType) => void;
};

export default function CheckoutModeTabs({
  activeMode,
  isDeliveryEnabled,
  isPickupEnabled,
  onModeChange,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundTertiary }]}>
      <Pressable
        accessibilityRole="button"
        disabled={!isDeliveryEnabled}
        onPress={() => onModeChange('delivery')}
        style={[
          styles.tab,
          activeMode === 'delivery' && styles.activeTab,
          { opacity: isDeliveryEnabled ? 1 : 0.45 },
          activeMode === 'delivery'
            ? { backgroundColor: colors.surface, shadowColor: colors.shadowColor }
            : null,
        ]}
      >
        <Text
          weight="medium"
          style={{
            color: activeMode === 'delivery' ? colors.text : colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('checkout_fulfillment_delivery')}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={!isPickupEnabled}
        onPress={() => onModeChange('pickup')}
        style={[
          styles.tab,
          activeMode === 'pickup' && styles.activeTab,
          { opacity: isPickupEnabled ? 1 : 0.45 },
          activeMode === 'pickup'
            ? { backgroundColor: colors.surface, shadowColor: colors.shadowColor }
            : null,
        ]}
      >
        <Text
          weight="medium"
          style={{
            color: activeMode === 'pickup' ? colors.text : colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('checkout_fulfillment_pickup')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
