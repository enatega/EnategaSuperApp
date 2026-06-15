import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CardField, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import {
  useWalletSetupIntentMutation,
  walletSavedCardsKeys,
} from '../../../../general/api/walletSavedCardsService';
import { useTheme } from '../../../../general/theme/theme';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

const WALLET_PAYMENT_APP_PREFIX = 'deliveries' as const;

export default function AddCardScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NavigationProp<RideSharingStackParamList>>();
  const queryClient = useQueryClient();
  const setupIntentMutation = useWalletSetupIntentMutation(WALLET_PAYMENT_APP_PREFIX);
  const { confirmSetupIntent } = useConfirmSetupIntent();

  const [holderName, setHolderName] = useState('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
  const hasStripeKey = stripePublishableKey.trim().length > 0;
  const isValid = hasStripeKey && isCardComplete;

  const handleSave = useCallback(async () => {
    Keyboard.dismiss();

    if (!stripePublishableKey) {
      showToast.error(t('wallet_add_card_error'), t('wallet_stripe_publishable_key_missing'));
      return;
    }

    if (!isCardComplete) {
      showToast.error(t('wallet_add_card_error'), t('wallet_card_incomplete'));
      return;
    }

    try {
      const setupIntent = await setupIntentMutation.mutateAsync();
      const { error } = await confirmSetupIntent(setupIntent.clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: holderName.trim() || undefined,
          },
        },
      });

      if (error) {
        showToast.error(t('wallet_add_card_error'), error.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: walletSavedCardsKeys.byApp(WALLET_PAYMENT_APP_PREFIX),
      });
      showToast.success(
        t('wallet_card_saved_success_title'),
        t('wallet_card_saved_success_message'),
      );
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('wallet_add_card_error');
      showToast.error(t('wallet_add_card_error'), message);
    }
  }, [
    confirmSetupIntent,
    holderName,
    isCardComplete,
    navigation,
    queryClient,
    setupIntentMutation,
    stripePublishableKey,
    t,
  ]);

  const saveDisabled = useMemo(
    () => !isValid || setupIntentMutation.isPending,
    [isValid, setupIntentMutation.isPending],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('wallet_add_card_title')} variant="close" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldGroup}>
          <Text weight="medium" color={colors.text} style={styles.label}>
            {t('wallet_name_on_card')}
          </Text>
          <View style={[styles.inputRow, { borderColor: colors.border }]}>
            <TextInput
              value={holderName}
              onChangeText={setHolderName}
              placeholder={t('wallet_name_placeholder')}
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text }]}
              accessibilityLabel={t('wallet_name_on_card')}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text weight="medium" color={colors.text} style={styles.label}>
            {t('wallet_card_number_label')}
          </Text>
          {hasStripeKey ? (
            <View
              style={[
                styles.cardFieldWrap,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: colors.background,
                  borderColor: colors.background,
                  borderWidth: 0,
                  textColor: colors.text,
                  placeholderColor: colors.mutedText,
                }}
                style={styles.cardField}
                onCardChange={(details) => {
                  setIsCardComplete(Boolean(details.complete));
                }}
              />
            </View>
          ) : (
            <View style={[styles.inputRow, { borderColor: colors.border }]}>
              <Text color={colors.mutedText}>
                {t('wallet_stripe_publishable_key_missing')}
              </Text>
            </View>
          )}
        </View>

        <Text color={colors.mutedText} style={[styles.secureText, { fontSize: typography.size.sm2 }]}>
          {t('wallet_pay_securely')}
        </Text>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          label={t('wallet_save_card')}
          onPress={() => {
            void handleSave();
          }}
          disabled={saveDisabled}
          isLoading={setupIntentMutation.isPending}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 140 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, lineHeight: 22 },
  inputRow: {
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: { flex: 1, fontSize: 16, lineHeight: 24 },
  cardFieldWrap: {
    borderWidth: 1,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  cardField: {
    width: '100%',
    height: 48,
  },
  secureText: {
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
  },
  saveButton: { borderRadius: 8 },
});
