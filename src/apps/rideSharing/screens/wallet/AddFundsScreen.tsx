import React, { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { useTheme } from '../../../../general/theme/theme';
import {
  useRideSharingCurrencyCode,
  useRideSharingCurrencyLabel,
} from '../../../../general/stores/useAppConfigStore';
import QuickAmountChips from '../../components/wallet/QuickAmountChips';
import PaymentMethodRow from '../../components/wallet/PaymentMethodRow';
import ChoosePaymentSheet from '../../components/wallet/ChoosePaymentSheet';
import AddPaymentMethodSheet from '../../components/wallet/AddPaymentMethodSheet';
import { MOCK_PAYMENT_CARDS, QUICK_AMOUNTS } from '../../data/walletMockData';
import { useWalletTopUp } from '../../hooks/useUserMutations';
import type { PaymentCard } from '../../types/wallet';

export default function AddFundsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const currencyCode = useRideSharingCurrencyCode();
  const currencyLabel = useRideSharingCurrencyLabel();
  const walletTopUpMutation = useWalletTopUp();

  const [amount, setAmount] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<PaymentCard>(MOCK_PAYMENT_CARDS[0]);
  const [isPaymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [isAddMethodVisible, setAddMethodVisible] = useState(false);

  const parsedAmount = parseFloat(amount) || 0;
  const isValid = parsedAmount >= 10 && parsedAmount <= 500;

  const handleQuickAmount = useCallback((value: number) => {
    setSelectedQuickAmount(value);
    setAmount(value.toFixed(2));
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    setAmount(text);
    setSelectedQuickAmount(null);
  }, []);

  const handleSelectCard = useCallback((card: PaymentCard) => {
    setSelectedCard(card);
    setPaymentSheetVisible(false);
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    setPaymentSheetVisible(false);
    setAddMethodVisible(true);
  }, []);

  const handleSaveCard = useCallback((_cardNumber: string, _expiry: string, _securityCode: string) => {
    // API integration placeholder
    setAddMethodVisible(false);
  }, []);

  const handleAddFunds = useCallback(() => {
    walletTopUpMutation.mutate(
      {
        amount: parsedAmount,
        currency: currencyCode,
      },
      {
        onError: (error) => {
          showToast.error(
            t('wallet_topup_error_title'),
            error.message || t('wallet_topup_error_message'),
          );
        },
        onSuccess: async (response) => {
          if (!response.checkoutUrl) {
            showToast.error(
              t('wallet_topup_error_title'),
              t('wallet_topup_error_message'),
            );
            return;
          }

          const canOpenCheckout = await Linking.canOpenURL(response.checkoutUrl);

          if (!canOpenCheckout) {
            showToast.error(
              t('wallet_topup_error_title'),
              t('wallet_topup_checkout_error_message'),
            );
            return;
          }

          await Linking.openURL(response.checkoutUrl);
        },
      },
    );
  }, [currencyCode, parsedAmount, t, walletTopUpMutation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('wallet_add_funds_title')} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text
            variant="title"
            weight="bold"
            color={colors.text}
            style={{ fontSize: 32, lineHeight: 38, letterSpacing: -0.48 }}
          >
            {t('wallet_add_funds_title')}
          </Text>
          <Text variant="caption" weight="medium" color={colors.mutedText}>
            {t('wallet_add_funds_subtitle')}
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text variant="caption" weight="medium" color={colors.text} style={styles.label}>
                {t('wallet_offer_your_fare')}
              </Text>
              <Text variant="caption" weight="medium" color={colors.danger}>
                {t('wallet_offer_fare_required')}
              </Text>
            </View>
            <Text variant="caption" color={colors.mutedText}>
              {t('wallet_offer_fare_hint', { currency: currencyLabel })}
            </Text>
          </View>

          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Text variant="body" color={colors.text} style={styles.currencyPrefix}>
              {currencyLabel}
            </Text>
            <TextInput
              value={amount}
              onChangeText={handleAmountChange}
              placeholder={t('wallet_amount_placeholder')}
              placeholderTextColor={colors.mutedText}
              style={[styles.amountInput, { color: colors.text }]}
              keyboardType="decimal-pad"
              accessibilityLabel={t('wallet_offer_your_fare')}
            />
          </View>

          <QuickAmountChips
            amounts={QUICK_AMOUNTS}
            currency={currencyLabel}
            selectedAmount={selectedQuickAmount}
            onSelect={handleQuickAmount}
          />
        </View>

        <View style={styles.spacer} />

        <PaymentMethodRow
          card={selectedCard}
          onPress={() => setPaymentSheetVisible(true)}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={t('wallet_add_funds')}
          onPress={handleAddFunds}
          disabled={!isValid}
          isLoading={walletTopUpMutation.isPending}
          style={styles.addButton}
        />
      </View>

      <ChoosePaymentSheet
        visible={isPaymentSheetVisible}
        cards={MOCK_PAYMENT_CARDS}
        selectedCardId={selectedCard.id}
        title={t('wallet_choose_payment_method')}
        addMethodLabel={t('wallet_add_payment_method')}
        onSelectCard={handleSelectCard}
        onAddPaymentMethod={handleAddPaymentMethod}
        onClose={() => setPaymentSheetVisible(false)}
      />

      <AddPaymentMethodSheet
        visible={isAddMethodVisible}
        title={t('wallet_choose_payment_method')}
        cardNumberPlaceholder={t('wallet_card_number')}
        expiryPlaceholder={t('wallet_expiry')}
        securityCodePlaceholder={t('wallet_security_code')}
        saveLabel={t('wallet_save')}
        onSave={handleSaveCard}
        onClose={() => setAddMethodVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  titleSection: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formSection: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fieldGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 2,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    height: 48,
    paddingHorizontal: 12,
    gap: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 1,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
  },
  addButton: {
    borderRadius: 6,
  },
});
