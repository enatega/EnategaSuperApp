import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import Button from '../../../../general/components/Button';
import PaymentMethodBadge from '../../components/payment/PaymentMethodBadge';
import PaymentMethodBottomSheet from '../../components/payment/PaymentMethodBottomSheet';
import {
  getPaymentMethodOption,
  type PaymentMethodId,
} from '../../components/payment/paymentTypes';
import { formatRideCurrency } from '../../utils/rideFormatting';
import type { RideAddressSelection } from '../../api/types';
import type { RideOptionItem } from '../../components/rideOptions/types';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import type { RideIntent } from '../../utils/rideOptions';

type RouteParams = {
  rideType?: RideIntent;
  rideCategory?: RideOptionItem['id'];
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  offeredFare?: number;
  recommendedFare?: number;
  paymentMethodId?: PaymentMethodId;
};

export default function OfferFareScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute();
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const {
    rideType,
    rideCategory,
    fromAddress,
    toAddress,
    offeredFare,
    recommendedFare,
    paymentMethodId: initialPaymentMethodId = 'cash',
  } = route.params as RouteParams;
  const [fareValue, setFareValue] = useState(
    typeof offeredFare === 'number' ? offeredFare.toFixed(2) : '',
  );
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId>(initialPaymentMethodId);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  const selectedPayment = getPaymentMethodOption(paymentMethodId);
  const paymentMethodLabel = selectedPayment.value
    ?? (paymentMethodId === 'cash' ? t('ride_payment_cash') : '');
  const minimumFare = recommendedFare ?? 0;
  const parsedFare = useMemo(() => Number.parseFloat(fareValue), [fareValue]);
  const isBelowRecommended = fareValue.trim().length > 0 && Number.isFinite(parsedFare) && parsedFare < minimumFare;
  const canSave = Number.isFinite(parsedFare) && parsedFare >= minimumFare;

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    navigation.navigate('RideEstimate', {
      rideType,
      rideCategory,
      fromAddress,
      toAddress,
      offeredFare: parsedFare,
      paymentMethodId,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScreenHeader
          title={t('ride_offer_fare_title')}
          showBack={false}
          leftSlot={<View style={styles.headerSpacer} />}
          rightSlot={(
            <Pressable
              onPress={() => navigation.goBack()}
              style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
            >
              <Icon type="Feather" name="x" size={22} color={colors.text} />
            </Pressable>
          )}
        />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.fieldBlock}>
            <Text weight="medium" style={styles.fieldLabel}>
              {t('ride_offer_fare_field_label')}
              <Text color={colors.danger}> *</Text>
            </Text>
            <Text style={[styles.fieldHint, { color: colors.mutedText }]}>
              {t('ride_offer_fare_recommended', { fare: formatRideCurrency(recommendedFare) })}
            </Text>

            <View
              style={[
                styles.inputWrap,
                {
                  borderColor: isBelowRecommended ? colors.danger : colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Text style={styles.currencyLabel}>QAR</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={fareValue}
                onChangeText={setFareValue}
                style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
              />
            </View>
            {isBelowRecommended ? (
              <Text style={[styles.validationText, { color: colors.danger }]}>
                {t('ride_offer_fare_validation', { fare: formatRideCurrency(minimumFare) })}
              </Text>
            ) : null}
          </View>

          <Pressable style={styles.row} onPress={() => {}}>
            <View style={styles.rowLeft}>
              <Icon type="Feather" name="percent" size={20} color={colors.text} />
              <Text weight="medium" style={styles.rowLabel}>{t('ride_offer_fare_promo_code')}</Text>
            </View>
            <Icon type="Feather" name="chevron-right" size={18} color={colors.text} />
          </Pressable>

          <Pressable style={styles.row} onPress={() => setIsPaymentVisible(true)}>
            <View style={styles.rowLeft}>
              <PaymentMethodBadge paymentMethodId={paymentMethodId} size="sm" />
              <Text weight="medium" style={styles.rowLabel}>
                {paymentMethodLabel}
              </Text>
            </View>
            <Icon type="Feather" name="chevron-right" size={18} color={colors.text} />
          </Pressable>

          <View style={styles.tripBlock}>
            <Text weight="medium" style={[styles.tripLabel, { color: colors.mutedText }]}>
              {t('ride_offer_fare_current_trip')}
            </Text>

            <View style={styles.tripRow}>
              <View style={[styles.tripDot, { borderColor: colors.success }]} />
              <Text style={styles.tripAddress}>{fromAddress.description}</Text>
            </View>

            <View style={styles.tripRow}>
              <View style={[styles.tripDot, { borderColor: colors.danger }]} />
              <Text style={styles.tripAddress}>{toAddress.description}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={t('ride_payment_save')}
            onPress={handleSave}
            disabled={!canSave}
            style={styles.saveButton}
          />
        </View>

        <PaymentMethodBottomSheet
          visible={isPaymentVisible}
          selectedPaymentMethodId={paymentMethodId}
          onClose={() => setIsPaymentVisible(false)}
          onSelect={(nextPaymentMethodId) => {
            setPaymentMethodId(nextPaymentMethodId);
            setIsPaymentVisible(false);
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  fieldBlock: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  fieldHint: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
    marginBottom: 10,
  },
  inputWrap: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  currencyLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
  },
  validationText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  tripBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  tripLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 4,
  },
  tripAddress: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  saveButton: {
    minHeight: 44,
    borderRadius: 6,
    borderWidth: 0,
  },
});
