import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CheckoutPaymentMethod } from '../../api/orderServiceTypes';
import CheckoutHeader from './CheckoutHeader';
import {
  getCheckoutPaymentMethodSubtitle,
  getCheckoutPaymentMethodTitle,
} from './checkoutPaymentUtils';

type Props = {
  isCardEnabled: boolean;
  isCashEnabled: boolean;
  onBackPress: () => void;
  onConfirm: (paymentMethod: CheckoutPaymentMethod) => void;
  selectedMethod: CheckoutPaymentMethod;
};

type PaymentOptionCardProps = {
  description: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  isDisabled: boolean;
  isSelected: boolean;
  onPress: () => void;
  title: string;
};

function PaymentOptionCard({
  description,
  iconName,
  isDisabled,
  isSelected,
  onPress,
  title,
}: PaymentOptionCardProps) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.optionCard,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          opacity: isDisabled ? 0.45 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.optionIcon,
          {
            backgroundColor: isSelected ? colors.blue50 : colors.surfaceSoft,
          },
        ]}
      >
        <Ionicons color={colors.text} name={iconName} size={20} />
      </View>

      <View style={styles.optionText}>
        <Text
          weight="semiBold"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {description}
        </Text>
      </View>

      <Ionicons
        color={isSelected ? colors.primary : colors.iconDisabled}
        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
        size={20}
      />
    </Pressable>
  );
}

export default function CheckoutPaymentMethodScreen({
  isCardEnabled,
  isCashEnabled,
  onBackPress,
  onConfirm,
  selectedMethod,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const [draftMethod, setDraftMethod] =
    React.useState<CheckoutPaymentMethod>(selectedMethod);

  React.useEffect(() => {
    setDraftMethod(selectedMethod);
  }, [selectedMethod]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CheckoutHeader
        backIconName="close"
        onBackPress={onBackPress}
        title={t('checkout_payment_selector_title')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.copyBlock}>
          <Text
            weight="extraBold"
            style={{
              color: colors.text,
              fontSize: typography.size.h5,
              lineHeight: typography.lineHeight.h5,
            }}
          >
            {t('checkout_payment_selector_heading')}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {t('checkout_payment_selector_description')}
          </Text>
        </View>

        <View accessibilityRole="radiogroup" style={styles.optionGroup}>
          <PaymentOptionCard
            description={t('checkout_payment_option_cash_description')}
            iconName="cash-outline"
            isDisabled={!isCashEnabled}
            isSelected={draftMethod === 'cod'}
            onPress={() => {
              setDraftMethod('cod');
            }}
            title={getCheckoutPaymentMethodTitle('cod', t)}
          />

          <PaymentOptionCard
            description={t('checkout_payment_option_card_description')}
            iconName="card-outline"
            isDisabled={!isCardEnabled}
            isSelected={draftMethod === 'stripe'}
            onPress={() => {
              setDraftMethod('stripe');
            }}
            title={getCheckoutPaymentMethodTitle('stripe', t)}
          />
        </View>

        {!isCashEnabled ? (
          <Text
            style={[
              styles.note,
              {
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              },
            ]}
          >
            {t('checkout_payment_cash_unavailable')}
          </Text>
        ) : null}

        {!isCardEnabled ? (
          <Text
            style={[
              styles.note,
              {
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              },
            ]}
          >
            {t('checkout_payment_card_unavailable')}
          </Text>
        ) : null}

        <View
          style={[
            styles.selectedCard,
            {
              backgroundColor: colors.surfaceSoft,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            weight="semiBold"
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {getCheckoutPaymentMethodTitle(draftMethod, t)}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {getCheckoutPaymentMethodSubtitle(draftMethod, t)}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <Button
          label={t('checkout_payment_selector_confirm')}
          onPress={() => {
            onConfirm(draftMethod);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  copyBlock: {
    gap: 6,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  note: {
    paddingHorizontal: 4,
  },
  optionCard: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionGroup: {
    gap: 12,
  },
  optionIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  screen: {
    flex: 1,
  },
  selectedCard: {
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
});
