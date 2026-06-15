import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { useWalletSavedCardsQuery } from '../../../../general/api/walletSavedCardsService';
import { useTheme } from '../../../../general/theme/theme';
import { formatCurrencyLabelAmount } from '../../../../general/utils/currency';
import {
  useRideSharingCurrency,
  useRideSharingCurrencyCode,
  useRideSharingCurrencyLabel,
} from '../../../../general/stores/useAppConfigStore';
import QuickAmountChips from '../../components/wallet/QuickAmountChips';
import PaymentMethodRow from '../../components/wallet/PaymentMethodRow';
import ChoosePaymentSheet from '../../components/wallet/ChoosePaymentSheet';
import { useWalletTopUp } from '../../hooks/useUserMutations';
import type { PaymentCard } from '../../types/wallet';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

const WALLET_SAVED_CARDS_APP_PREFIX = 'deliveries' as const;
const WALLET_TOP_UP_APP_PREFIX = 'ride-hailing' as const;
const DEFAULT_MIN_TOP_UP_AMOUNT = 10;
const MAX_TOP_UP_AMOUNT = 500;
const MINIMUM_USD_EQUIVALENT = 0.5;

function normalizeAmountInput(text: string) {
  const normalizedText = text.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const [wholePart = '', ...decimalParts] = normalizedText.split('.');

  if (decimalParts.length === 0) {
    return wholePart;
  }

  const decimalPart = decimalParts.join('').slice(0, 2);
  return `${wholePart}.${decimalPart}`;
}

function roundUpCurrencyAmount(value: number) {
  return Math.ceil(value * 100) / 100;
}

function resolveMinTopUpAmount(rateToBase: string | undefined) {
  const parsedRate = Number.parseFloat(rateToBase ?? '');

  if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
    return DEFAULT_MIN_TOP_UP_AMOUNT;
  }

  const derivedAmount =
    parsedRate >= 1
      ? MINIMUM_USD_EQUIVALENT * parsedRate
      : MINIMUM_USD_EQUIVALENT / parsedRate;

  return Math.max(DEFAULT_MIN_TOP_UP_AMOUNT, roundUpCurrencyAmount(derivedAmount));
}

export default function AddFundsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation =
    useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const currency = useRideSharingCurrency();
  const currencyCode = useRideSharingCurrencyCode();
  const currencyLabel = useRideSharingCurrencyLabel();
  const walletTopUpMutation = useWalletTopUp(WALLET_TOP_UP_APP_PREFIX);
  const savedCardsQuery = useWalletSavedCardsQuery(WALLET_SAVED_CARDS_APP_PREFIX);

  const [amount, setAmount] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isPaymentSheetVisible, setPaymentSheetVisible] = useState(false);

  const availableCards = React.useMemo<PaymentCard[]>(
    () =>
      (savedCardsQuery.data?.cards ?? []).map((card) => ({
        id: card.id,
        paymentMethodId: card.id,
        brand: card.brand.toLowerCase() === 'visa' ? 'visa' : 'mastercard',
        lastFour: card.last4,
        expiryDate: `${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`,
        isDefault: card.isDefault,
        holderName: card.name ?? null,
      })),
    [savedCardsQuery.data?.cards],
  );
  const selectedCard = React.useMemo(() => {
    if (!availableCards.length) {
      return null;
    }

    return (
      availableCards.find((card) => card.id === selectedCardId) ??
      availableCards.find((card) => card.isDefault) ??
      availableCards[0]
    );
  }, [availableCards, selectedCardId]);
  const minTopUpAmount = React.useMemo(
    () => resolveMinTopUpAmount(currency?.rateToBase),
    [currency?.rateToBase],
  );
  const quickAmounts = React.useMemo(
    () => [
      minTopUpAmount,
      Math.min(minTopUpAmount * 2, MAX_TOP_UP_AMOUNT),
      Math.min(minTopUpAmount * 3, MAX_TOP_UP_AMOUNT),
      MAX_TOP_UP_AMOUNT,
    ].filter((amount, index, amounts) => amounts.indexOf(amount) === index),
    [minTopUpAmount],
  );

  const parsedAmount = Number.parseFloat(normalizeAmountInput(amount)) || 0;
  const isValid =
    parsedAmount >= minTopUpAmount &&
    parsedAmount <= MAX_TOP_UP_AMOUNT &&
    Boolean(selectedCard?.paymentMethodId);

  const handleQuickAmount = useCallback((value: number) => {
    setSelectedQuickAmount(value);
    setAmount(value.toFixed(2));
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    setAmount(normalizeAmountInput(text));
    setSelectedQuickAmount(null);
  }, []);

  const handleSelectCard = useCallback((card: PaymentCard) => {
    setSelectedCardId(card.id);
    setPaymentSheetVisible(false);
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    setPaymentSheetVisible(false);
    navigation.push('WalletAddCard');
  }, [navigation]);

  const handleAddFunds = useCallback(() => {
    if (!selectedCard?.paymentMethodId) {
      showToast.error(
        t('wallet_topup_error_title'),
        t('wallet_no_saved_cards'),
      );
      return;
    }

    walletTopUpMutation.mutate(
      {
        amount: parsedAmount,
        currency: currencyCode,
        paymentMethodId: selectedCard.paymentMethodId,
      },
      {
        onError: (error) => {
          showToast.error(
            t('wallet_topup_error_title'),
            error.message || t('wallet_topup_error_message'),
          );
        },
        onSuccess: (response) => {
          showToast.success(t('wallet_add_funds'), response.message);
          setAmount('');
          setSelectedQuickAmount(null);
        },
      },
    );
  }, [currencyCode, parsedAmount, selectedCard?.paymentMethodId, t, walletTopUpMutation]);

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
              {t('wallet_offer_fare_hint', {
                minAmount: formatCurrencyLabelAmount(minTopUpAmount, currencyLabel),
                maxAmount: formatCurrencyLabelAmount(MAX_TOP_UP_AMOUNT, currencyLabel),
              })}
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
            amounts={quickAmounts}
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
        {!savedCardsQuery.isPending && availableCards.length === 0 ? (
          <View style={styles.emptyCardsBlock}>
            <Text
              variant="caption"
              weight="medium"
              color={colors.mutedText}
              style={styles.emptyCardsText}
            >
              {t('wallet_no_saved_cards')}
            </Text>
            <Text
              variant="caption"
              color={colors.mutedText}
              style={styles.emptyCardsHelperText}
            >
              {t('wallet_add_card_required_hint')}
            </Text>
          </View>
        ) : null}
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
        cards={availableCards}
        selectedCardId={selectedCard?.id ?? null}
        title={t('wallet_choose_payment_method')}
        addMethodLabel={t('wallet_add_payment_method')}
        onSelectCard={handleSelectCard}
        onAddPaymentMethod={handleAddPaymentMethod}
        onClose={() => setPaymentSheetVisible(false)}
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
  emptyCardsText: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyCardsBlock: {
    gap: 4,
  },
  emptyCardsHelperText: {
    paddingHorizontal: 16,
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
