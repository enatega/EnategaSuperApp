import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import RideEstimateStatusCard from '../../components/rideEstimate/RideEstimateStatusCard';
import PaymentMethodBadge from '../../components/payment/PaymentMethodBadge';
import PaymentMethodBottomSheet from '../../components/payment/PaymentMethodBottomSheet';
import { getPaymentMethodOption, type PaymentMethodId } from '../../components/payment/paymentTypes';
import RideEstimateAddressSummaryCard from './components/RideEstimateAddressSummaryCard';
import RideEstimateBottomSheet from './components/RideEstimateBottomSheet';
import RideEstimateMapLayer from './components/RideEstimateMapLayer';
import { useTheme } from '../../../../general/theme/theme';
import { getApiErrorMessage } from '../../../../general/utils/apiError';
import type {
  RideAddressSelection,
  RideTypeFare,
} from '../../api/types';
import type { RideOptionItem } from '../../components/rideOptions/types';
import useRideEstimateOptions from '../../hooks/useRideEstimateOptions';
import useRideRoutePath from '../../hooks/useRideRoutePath';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import type { RideIntent } from '../../utils/rideOptions';
import { rideEstimateIcons } from './rideEstimateAssets';

type RouteParams = {
  rideType?: RideIntent;
  rideCategory?: RideOptionItem['id'];
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  offeredFare?: number;
  paymentMethodId?: PaymentMethodId;
};

function resolveRideIcon(name: string) {
  if (/comfort/i.test(name)) return rideEstimateIcons.comfort;
  if (/premium/i.test(name)) return rideEstimateIcons.premiumSedan;
  if (/motorcycle|bike|wheel/i.test(name)) return rideEstimateIcons.motorcycle;
  if (/courier/i.test(name)) return rideEstimateIcons.courier;
  if (/women/i.test(name)) return rideEstimateIcons.women;
  if (/premium/i.test(name)) return rideEstimateIcons.premium;
  return rideEstimateIcons.ride;
}

function toRideOption(ride: RideTypeFare): RideOptionItem & { fare?: number; recommendedFare?: number } {
  return {
    id: (ride.ride_type_id ?? ride.name) as RideOptionItem['id'],
    title: ride.name.replace(/_/g, ' '),
    icon: ride.imageUrl ?? resolveRideIcon(ride.name),
    seats: ride.capacity ?? (/courier/i.test(ride.name) ? undefined : 4),
    fare: ride.fare,
    recommendedFare: ride.recommendedFare,
  };
}

export default function RideEstimateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const {
    rideType,
    fromAddress,
    toAddress,
    rideCategory,
    offeredFare: initialOfferedFare,
    paymentMethodId: initialPaymentMethodId = 'cash',
  } = route.params as RouteParams;

  const quoteQuery = useRideEstimateOptions(fromAddress, toAddress);
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const quoteErrorMessage = quoteQuery.error
    ? getApiErrorMessage(quoteQuery.error, t('ride_estimate_quote_error_description'))
    : null;
  const routeErrorMessage = routeQuery.error
    ? getApiErrorMessage(routeQuery.error, t('ride_estimate_route_error_description'))
    : null;
  const isQuoteLoading = !quoteQuery.data && (quoteQuery.isLoading || quoteQuery.isFetching);
  const mappedOptions = useMemo(
    () => (quoteQuery.data?.rideTypeFares ?? []).map(toRideOption),
    [quoteQuery.data?.rideTypeFares],
  );
  const [selectedOptionId, setSelectedOptionId] = useState<RideOptionItem['id']>(
    rideCategory ?? (mappedOptions[0]?.id ?? 'ride'),
  );
  const [customFare, setCustomFare] = useState<number | undefined>(initialOfferedFare);
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId>(initialPaymentMethodId);
  const [isPaymentMethodVisible, setIsPaymentMethodVisible] = useState(false);

  useEffect(() => {
    setPaymentMethodId(initialPaymentMethodId);
  }, [initialPaymentMethodId]);

  const options = mappedOptions.length
    ? mappedOptions
    : [
        {
          id: 'ride',
          title: t('ride_option_now_title'),
          icon: rideEstimateIcons.ride,
          seats: 4,
        },
      ];

  const resolvedSelectedOptionId = options.some((item) => item.id === selectedOptionId)
    ? selectedOptionId
    : options[0].id;
  const showRouteAlert = Boolean(routeErrorMessage) && !quoteErrorMessage;
  const selectedOption = options.find((item) => item.id === resolvedSelectedOptionId) ?? options[0];
  const selectedOptionRecommendedFare = selectedOption.fare;
  const selectedOptionCurrentFare = customFare ?? selectedOptionRecommendedFare;
  const paymentMethod = getPaymentMethodOption(paymentMethodId);
  const paymentMethodLabel = paymentMethod.value
    ?? (paymentMethodId === 'cash' ? t('ride_payment_cash') : '');
  const displayOptions = options.map((item) => (
    item.id === resolvedSelectedOptionId
      ? {
          ...item,
          fare: selectedOptionCurrentFare,
          recommendedFare: item.fare,
        }
      : item
  ));

  useEffect(() => {
    if (typeof initialOfferedFare === 'number') {
      setCustomFare(initialOfferedFare);
      return;
    }

    setCustomFare(undefined);
  }, [initialOfferedFare]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <RideEstimateMapLayer
        fromAddress={fromAddress}
        toAddress={toAddress}
        routeCoordinates={routeQuery.data ?? []}
      />
      <RideEstimateAddressSummaryCard
        fromAddress={fromAddress}
        toAddress={toAddress}
        onChangeAddressPress={() => navigation.navigate(
          'RideAddressSearch' as never,
          {
            rideType,
            rideCategory,
          } as never,
        )}
      />
      {showRouteAlert ? (
        <View style={styles.routeAlertWrap}>
          <RideEstimateStatusCard
            title={t('ride_estimate_route_error_title')}
            message={routeErrorMessage ?? t('ride_estimate_route_error_description')}
            variant="warning"
            actionLabel={t('ride_estimate_retry')}
            onActionPress={() => routeQuery.refetch()}
            compact
          />
        </View>
      ) : null}
      <RideEstimateBottomSheet
        options={displayOptions}
        selectedOptionId={resolvedSelectedOptionId}
        onSelectOption={(nextOptionId) => {
          setSelectedOptionId(nextOptionId);
          const nextOption = options.find((item) => item.id === nextOptionId);
          setCustomFare(nextOption?.fare);
        }}
        onConfirmRide={() => navigation.navigate('FindingRide', {
          fromAddress,
          toAddress,
          selectedRide: {
            ...selectedOption,
            fare: selectedOptionCurrentFare,
            recommendedFare: selectedOptionRecommendedFare,
          },
          offeredFare: selectedOptionCurrentFare,
          recommendedFare: selectedOptionRecommendedFare,
          paymentMethodId,
        })}
        onBackPress={() => navigation.goBack()}
        paymentMethodLabel={paymentMethodLabel}
        paymentMethodBadge={<PaymentMethodBadge paymentMethodId={paymentMethodId} size="sm" />}
        onPaymentMethodPress={() => setIsPaymentMethodVisible(true)}
        onEditFarePress={() => navigation.navigate('OfferFare', {
          rideType,
          rideCategory,
          fromAddress,
          toAddress,
          offeredFare: selectedOptionCurrentFare,
          recommendedFare: selectedOptionRecommendedFare,
          paymentMethodId,
        })}
        onIncreaseFare={() => {
          const minimumFare = selectedOptionRecommendedFare ?? 0;
          const nextFare = Number(((selectedOptionCurrentFare ?? minimumFare) + 1).toFixed(2));
          setCustomFare(nextFare);
        }}
        onDecreaseFare={() => {
          const minimumFare = selectedOptionRecommendedFare ?? 0;
          const currentFare = selectedOptionCurrentFare ?? minimumFare;

          if (currentFare <= minimumFare) {
            return;
          }

          const nextFare = Number(Math.max(minimumFare, currentFare - 1).toFixed(2));
          setCustomFare(nextFare);
        }}
        isDecreaseFareDisabled={(selectedOptionCurrentFare ?? 0) <= (selectedOptionRecommendedFare ?? 0)}
        isLoading={isQuoteLoading}
        errorMessage={quoteErrorMessage}
        onRetry={() => quoteQuery.refetch()}
        isConfirmDisabled={quoteQuery.isLoading || quoteQuery.isFetching}
      />

      <PaymentMethodBottomSheet
        visible={isPaymentMethodVisible}
        selectedPaymentMethodId={paymentMethodId}
        onClose={() => setIsPaymentMethodVisible(false)}
        onSelect={(nextPaymentMethodId) => {
          setPaymentMethodId(nextPaymentMethodId);
          setIsPaymentMethodVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  routeAlertWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 156,
  },
});
