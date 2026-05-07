import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import type { CheckoutPaymentMethod } from '../../api/orderServiceTypes';
import type { WalletSavedCard } from '../../../../general/api/walletSavedCardsService';
import {
  getCheckoutPaymentMethodSubtitle,
  getCheckoutPaymentMethodTitle,
} from './checkoutPaymentUtils';

type Props = {
  isCardEnabled: boolean;
  isCashEnabled: boolean;
  isVisible: boolean;
  isSavingCardSelection?: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: CheckoutPaymentMethod) => void;
  onManageCards: () => void;
  onSelectCard: (cardId: string) => void;
  savedCards: WalletSavedCard[];
  selectedCardId?: string | null;
  selectedMethod: CheckoutPaymentMethod;
};

export default function CheckoutPaymentMethodBottomSheet({
  isCardEnabled,
  isCashEnabled,
  isVisible,
  isSavingCardSelection = false,
  onClose,
  onConfirm,
  onManageCards,
  onSelectCard,
  savedCards,
  selectedCardId,
  selectedMethod,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const [draftMethod, setDraftMethod] = React.useState<CheckoutPaymentMethod>(selectedMethod);
  const hasSavedCards = savedCards.length > 0;
  const isCardSelectable = isCardEnabled;
  const visibleCardCount = draftMethod === 'stripe' ? savedCards.length + 1 : 0;
  const estimatedContentHeight =
    72 + // header + top spacing
    70 + // cash option
    70 + // card option
    (visibleCardCount > 0 ? Math.min(visibleCardCount, 4) * 54 + 12 : 0) + // saved cards + add card
    76 + // footer button
    Math.max(insets.bottom, 18);
  const sheetHeight = Math.min(Math.max(estimatedContentHeight, 324), Math.min(height * 0.78, 520));

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }
    setDraftMethod(selectedMethod);
  }, [isVisible, selectedMethod]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.overlayDark20 }]} onPress={onClose} />
      <SwipeableBottomSheet
        expandedHeight={sheetHeight}
        collapsedHeight={0}
        initialState="expanded"
        onStateChange={(state) => {
          if (state === 'collapsed') {
            onClose();
          }
        }}
        style={[styles.sheet, { backgroundColor: colors.background, shadowColor: colors.shadowColor }]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text
            weight="extraBold"
            style={{ color: colors.text, fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5 }}
          >
            {t('checkout_payment_selector_title')}
          </Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.backgroundTertiary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="close" size={18} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          bounces={false}
        >
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ disabled: !isCashEnabled, selected: draftMethod === 'cod' }}
            disabled={!isCashEnabled}
            onPress={() => setDraftMethod('cod')}
            style={[
              styles.option,
              {
                borderColor: draftMethod === 'cod' ? colors.primary : colors.border,
                borderWidth: draftMethod === 'cod' ? 2 : 1,
                opacity: isCashEnabled ? 1 : 0.45,
              },
            ]}
          >
            <Ionicons name="cash-outline" size={22} color={colors.text} />
            <View style={styles.optionText}>
              <Text weight="medium" style={{ color: colors.text, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}>
                {getCheckoutPaymentMethodTitle('cod', t)}
              </Text>
              <Text style={{ color: colors.mutedText, fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }}>
                {getCheckoutPaymentMethodSubtitle('cod', t)}
              </Text>
            </View>
            <Ionicons name={draftMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'} size={20} color={draftMethod === 'cod' ? colors.primary : colors.iconDisabled} />
          </Pressable>

          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ disabled: !isCardSelectable, selected: draftMethod === 'stripe' }}
            disabled={!isCardSelectable}
            onPress={() => setDraftMethod('stripe')}
            style={[
              styles.option,
              {
                borderColor: draftMethod === 'stripe' ? colors.primary : colors.border,
                borderWidth: draftMethod === 'stripe' ? 2 : 1,
                opacity: isCardSelectable ? 1 : 0.45,
              },
            ]}
          >
            <Ionicons name="card-outline" size={22} color={colors.text} />
            <View style={styles.optionText}>
              <Text weight="medium" style={{ color: colors.text, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}>
                {getCheckoutPaymentMethodTitle('stripe', t)}
              </Text>
              <Text style={{ color: colors.mutedText, fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }}>
                {isCardEnabled
                  ? hasSavedCards
                    ? getCheckoutPaymentMethodSubtitle('stripe', t)
                    : t('checkout_payment_add_card_required')
                  : t('checkout_payment_card_unavailable')}
              </Text>
            </View>
            <Ionicons name={draftMethod === 'stripe' ? 'radio-button-on' : 'radio-button-off'} size={20} color={draftMethod === 'stripe' ? colors.primary : colors.iconDisabled} />
          </Pressable>

          {draftMethod === 'stripe' ? (
            <View style={styles.cardsWrap}>
              {hasSavedCards ? savedCards.map((card) => (
                <Pressable
                  key={card.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedCardId === card.id }}
                  disabled={isSavingCardSelection}
                  onPress={() => onSelectCard(card.id)}
                  style={[
                    styles.cardOption,
                    {
                      borderColor: selectedCardId === card.id ? colors.primary : colors.border,
                      opacity: isSavingCardSelection ? 0.6 : 1,
                    },
                  ]}
                >
                  <View style={styles.cardOptionTextWrap}>
                    <Text
                      weight="medium"
                      style={{ color: colors.text, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
                    >
                      {`${card.brand.toUpperCase()} (•••• ${card.last4})`}
                    </Text>
                    <Text
                      style={{ color: colors.mutedText, fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }}
                    >
                      {`${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`}
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedCardId === card.id ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={selectedCardId === card.id ? colors.primary : colors.iconDisabled}
                  />
                </Pressable>
              )) : null}

              <Pressable
                onPress={onManageCards}
                style={({ pressed }) => [
                  styles.addCardButton,
                  { borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="add" size={16} color={colors.text} />
                <Text
                  weight="medium"
                  style={{ color: colors.text, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
                >
                  {t('wallet_add_card')}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
          <Button
            label={t('checkout_payment_selector_confirm')}
            onPress={() => onConfirm(draftMethod)}
            disabled={draftMethod === 'stripe' && !selectedCardId}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    paddingTop: 12,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  content: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  option: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionText: {
    flex: 1,
  },
  cardsWrap: {
    gap: 8,
  },
  cardOption: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cardOptionTextWrap: {
    flex: 1,
  },
  addCardButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 40,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
