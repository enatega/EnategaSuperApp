import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Icon from '../../../../general/components/Icon';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import OfferFareHourlyStepper from '../../components/offerFare/OfferFareHourlyStepper';
import OfferFareModeTabs from '../../components/offerFare/OfferFareModeTabs';
import OfferFareTripSummary from '../../components/offerFare/OfferFareTripSummary';
import PaymentMethodBadge from '../../components/payment/PaymentMethodBadge';
import PaymentMethodBottomSheet from '../../components/payment/PaymentMethodBottomSheet';
import {
  getPaymentMethodOption,
  type PaymentMethodId,
} from '../../components/payment/paymentTypes';
import type { RideAddressSelection } from '../../api/types';
import type { RideOptionItem } from '../../components/rideOptions/types';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import { formatRideCurrency } from '../../utils/rideFormatting';
import {
  DEFAULT_HOURLY_HOURS,
  getHourlyIncludedMiles,
  getRecommendedOfferFare,
  getSuggestedOfferFare,
  MIN_HOURLY_HOURS,
  resolveRideOfferMode,
  type RideOfferMode,
} from '../../utils/rideOffer';
import type { RideIntent } from '../../utils/rideOptions';

type RouteParams = {
  rideType?: RideIntent;
  rideCategory?: RideOptionItem['id'];
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  stops?: RideAddressSelection[];
  offeredFare?: number;
  recommendedFare?: number;
  paymentMethodId?: PaymentMethodId;
  offerMode?: RideOfferMode;
  hourlyHours?: number;
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
    stops = [],
    offeredFare,
    recommendedFare,
    paymentMethodId: initialPaymentMethodId = 'cash',
    offerMode,
    hourlyHours: initialHourlyHours,
  } = route.params as RouteParams;
  const isCourierFlow = rideType === 'courier';
  const [activeMode, setActiveMode] = useState<RideOfferMode>(
    isCourierFlow ? 'standard' : resolveRideOfferMode(rideType, offerMode),
  );
  const [hourlyHours, setHourlyHours] = useState(
    initialHourlyHours ?? DEFAULT_HOURLY_HOURS,
  );
  const [fareValue, setFareValue] = useState(
    typeof offeredFare === 'number' ? offeredFare.toFixed(2) : '',
  );
  const [hasEditedFare, setHasEditedFare] = useState(typeof offeredFare === 'number');
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId>(initialPaymentMethodId);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  const paymentMethod = getPaymentMethodOption(paymentMethodId);
  const paymentMethodLabel = paymentMethod.value
    ?? (paymentMethodId === 'cash' ? t('ride_payment_cash') : '');
  const resolvedOfferMode = isCourierFlow ? 'standard' : activeMode;
  const recommendedOfferFare = useMemo(
    () => getRecommendedOfferFare({
      baseFare: recommendedFare,
      offerMode: resolvedOfferMode,
      hourlyHours,
    }),
    [hourlyHours, recommendedFare, resolvedOfferMode],
  );
  const suggestedOfferFare = useMemo(
    () => getSuggestedOfferFare({
      recommendedFare: recommendedOfferFare,
      offerMode: resolvedOfferMode,
    }),
    [recommendedOfferFare, resolvedOfferMode],
  );
  const parsedFare = useMemo(() => Number.parseFloat(fareValue), [fareValue]);
  const isBelowRecommended = fareValue.trim().length > 0
    && Number.isFinite(parsedFare)
    && parsedFare < recommendedOfferFare;
  const canContinue = Number.isFinite(parsedFare) && parsedFare >= recommendedOfferFare;
  const hourlyTitle = hourlyHours === 1
    ? t('ride_offer_fare_hour_single', { count: hourlyHours })
    : t('ride_offer_fare_hour_plural', { count: hourlyHours });
  const hourlySubtitle = t('ride_offer_fare_miles_included', {
    miles: getHourlyIncludedMiles(hourlyHours),
  });

  useEffect(() => {
    if (!isCourierFlow || activeMode === 'standard') {
      return;
    }

    setActiveMode('standard');
  }, [activeMode, isCourierFlow]);

  useEffect(() => {
    if (hasEditedFare) {
      return;
    }

    setFareValue(suggestedOfferFare.toFixed(2));
  }, [hasEditedFare, suggestedOfferFare]);

  const handleSave = () => {
    if (!canContinue) {
      return;
    }

    navigation.navigate('RideEstimate', {
      rideType,
      rideCategory,
      fromAddress,
      toAddress,
      stops,
      offeredFare: parsedFare,
      paymentMethodId,
      offerMode: resolvedOfferMode,
      hourlyHours: resolvedOfferMode === 'hourly' ? hourlyHours : undefined,
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
          <View style={styles.topSection}>
            {!isCourierFlow ? (
              <OfferFareModeTabs
                activeMode={activeMode}
                onChange={(nextMode) => {
                  setActiveMode(nextMode);
                  setHasEditedFare(false);
                }}
                standardLabel={t('ride_offer_fare_tab_standard')}
                hourlyLabel={t('ride_offer_fare_tab_hourly')}
              />
            ) : null}

            {resolvedOfferMode === 'hourly' ? (
              <OfferFareHourlyStepper
                title={hourlyTitle}
                subtitle={hourlySubtitle}
                onIncrease={() => setHourlyHours((currentHours) => currentHours + 1)}
                onDecrease={() => setHourlyHours((currentHours) => Math.max(MIN_HOURLY_HOURS, currentHours - 1))}
                isDecreaseDisabled={hourlyHours <= MIN_HOURLY_HOURS}
              />
            ) : null}

            <View style={styles.fieldBlock}>
              <Text weight="medium" style={styles.fieldLabel}>
                {t('ride_offer_fare_title')}
                <Text color={colors.danger}> *</Text>
              </Text>
              <Text style={[styles.fieldHint, { color: colors.mutedText }]}>
                {t('ride_offer_fare_recommended', { fare: formatRideCurrency(recommendedOfferFare) })}
              </Text>

              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: isBelowRecommended ? colors.primary : colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text style={styles.currencyLabel}>QAR</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  value={fareValue}
                  onChangeText={(value) => {
                    setHasEditedFare(true);
                    setFareValue(value);
                  }}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                />
              </View>
              {isBelowRecommended ? (
                <Text style={[styles.validationText, { color: colors.danger }]}>
                  {t('ride_offer_fare_validation', { fare: formatRideCurrency(recommendedOfferFare) })}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Pressable
              style={styles.row}
              onPress={() => showToast.info(t('ride_offer_fare_promo_coming_soon'))}
            >
              <View style={styles.rowLeft}>
                <Icon type="Feather" name="percent" size={20} color={colors.text} />
                <Text weight="medium" style={styles.rowLabel}>
                  {t('ride_offer_fare_promo_code')}
                </Text>
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

            <OfferFareTripSummary
              title={t('ride_offer_fare_current_trip')}
              fromAddress={fromAddress.description}
              toAddress={toAddress.description}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={t('ride_offer_fare_next')}
            onPress={handleSave}
            disabled={!canContinue}
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
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  bottomSection: {
    paddingTop: 12,
    gap: 4,
  },
  fieldBlock: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  fieldHint: {
    fontSize: 14,
    lineHeight: 22,
  },
  inputWrap: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  currencyLabel: {
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
  },
  validationText: {
    marginTop: 4,
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
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  saveButton: {
    minHeight: 44,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: '#1691BF',
    borderColor: '#1691BF',
  },
});
