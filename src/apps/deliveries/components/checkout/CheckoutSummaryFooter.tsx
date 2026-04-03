import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type {
  CheckoutOrderType,
  CheckoutPreviewPricing,
} from '../../api/orderServiceTypes';
import CheckoutSummaryDetails from './CheckoutSummaryDetails';

type Props = {
  isDisabled: boolean;
  isLoading?: boolean;
  onPlaceOrderPress: () => void;
  orderType: CheckoutOrderType;
  pricing: CheckoutPreviewPricing | null;
  totalLabel: string;
};

export default function CheckoutSummaryFooter({
  isDisabled,
  isLoading = false,
  onPlaceOrderPress,
  orderType,
  pricing,
  totalLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleToggleExpanded = React.useCallback(() => {
    if (!pricing) {
      return;
    }

    setIsExpanded((current) => !current);
  }, [pricing]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded, disabled: !pricing }}
        disabled={!pricing}
        onPress={handleToggleExpanded}
        style={styles.summaryRow}
      >
        <View style={styles.summaryTitle}>
          <Text
            weight="extraBold"
            style={{
              color: colors.text,
              fontSize: typography.size.h5,
              lineHeight: typography.lineHeight.h5,
            }}
          >
            {t('checkout_summary_title')}
          </Text>
          <Ionicons
            color={colors.text}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
          />
        </View>

        <Text
          weight="semiBold"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {totalLabel}
        </Text>
      </Pressable>

      <Text
        style={{
          color: colors.mutedText,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {t('checkout_summary_hint')}
      </Text>

      {isExpanded && pricing ? (
        <CheckoutSummaryDetails
          orderType={orderType}
          pricing={pricing}
          totalLabel={totalLabel}
        />
      ) : null}

      <Button
        label={t('checkout_place_order')}
        disabled={isDisabled}
        isLoading={isLoading}
        onPress={onPlaceOrderPress}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  container: {
    borderTopWidth: 1,
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  summaryTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
