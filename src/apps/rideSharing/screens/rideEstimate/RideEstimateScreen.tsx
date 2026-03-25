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
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { socketClient } from '../../../../general/services/socket';
import { socketLogger } from '../../../../general/services/socket';
import type {
  ActiveRideRequestPayload,
  CreateRidePayload,
  RideAddressSelection,
  RideTypeFare,
} from '../../api/types';
import type { RideOptionItem } from '../../components/rideOptions/types';
import useRideEstimateOptions from '../../hooks/useRideEstimateOptions';
import { useCreateRide } from '../../hooks/useRideMutations';
import useRideRoutePath from '../../hooks/useRideRoutePath';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import { useActiveRideRequestStore } from '../../stores/useActiveRideRequestStore';
import { useActiveRideStore } from '../../stores/useActiveRideStore';
import { emitRideSharingEvent } from '../../socket/rideSharingSocket';
import type { RideIntent } from '../../utils/rideOptions';
import { rideEstimateIcons } from './rideEstimateAssets';
import { showToast } from '../../../../general/components/AppToast';

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

function mapPaymentMethodToApi(paymentMethodId: PaymentMethodId) {
  switch (paymentMethodId) {
    case 'wallet':
      return 'WALLET';
    case 'visa':
      return 'CARD';
    case 'cash':
    default:
      return 'CASH';
  }
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
  const createRideMutation = useCreateRide();
  const authSessionQuery = useAuthSessionQuery();
  const setActiveRideRequest = useActiveRideRequestStore((state) => state.setActiveRideRequest);
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);

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

  const handleConfirmRide = async () => {
    if (createRideMutation.isPending) {
      return;
    }

    if (!fromAddress?.coordinates || !toAddress?.coordinates) {
      showToast.error(t('error'), t('ride_estimate_route_error_description'));
      return;
    }

    if (!selectedOption?.id) {
      showToast.error(t('error'), t('ride_types_error_description'));
      return;
    }

    const resolvedFare = selectedOptionCurrentFare ?? selectedOptionRecommendedFare;
    if (typeof resolvedFare !== 'number' || Number.isNaN(resolvedFare) || resolvedFare <= 0) {
      showToast.error(t('error'), t('ride_estimate_quote_error_description'));
      return;
    }

    if (!quoteQuery.data) {
      showToast.error(t('error'), t('ride_estimate_quote_error_description'));
      return;
    }

    const createRidePayload: CreateRidePayload = {
      pickup: {
        lat: fromAddress.coordinates.latitude,
        lng: fromAddress.coordinates.longitude,
      },
      dropoff: {
        lat: toAddress.coordinates.latitude,
        lng: toAddress.coordinates.longitude,
      },
      ride_type_id: String(selectedOption.id),
      fare: resolvedFare,
      payment_via: mapPaymentMethodToApi(paymentMethodId),
      is_hourly: false,
      stops: [],
      pickup_address: fromAddress.description,
      pickup_location: fromAddress.description,
      dropoff_location: toAddress.description,
      destination_address: toAddress.description,
      is_scheduled: false,
      is_family: false,
      estimated_time: quoteQuery.data.durationMin,
      estimated_distance: quoteQuery.data.distanceKm,
      base_fair: selectedOptionRecommendedFare ?? resolvedFare,
      offered_fair: resolvedFare,
    };

    try {
      const createdRide = await createRideMutation.mutateAsync(createRidePayload) as {
        rideReq?: ActiveRideRequestPayload | null;
      } | null;
      const createdRideRequest = createdRide?.rideReq ?? null;

      if (!createdRideRequest?.id) {
        showToast.error(t('error'), t('ride_create_invalid_response_description'));
        return;
      }

      console.log('Ride created successfully, emitting socket event...', JSON.stringify(createdRide))

      try {
        await socketClient.connect();
        emitRideSharingEvent('ride-request-created-by-customer', {
          rideRequestData: {
            ...createRidePayload,
            passenger_user_id: createdRideRequest?.passenger?.userProfile?.user?.id,
            
          },
          latitude: fromAddress.coordinates.latitude,
          longitude: fromAddress.coordinates.longitude,
          radiusKm: 1,
        });
      } catch (socketError) {
        socketLogger.warn('Ride request socket emit failed after API success', {
          rideRequestId: createdRideRequest.id,
          error:
            socketError instanceof Error ? socketError.message : String(socketError),
        });
      }

      clearActiveRide();
      setActiveRideRequest(createdRideRequest);
      navigation.popToTop();
    } catch (error) {
      showToast.error(
        t('error'),
        getApiErrorMessage(error, t('ride_create_error_description')),
      );
    }
  };

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
        onConfirmRide={handleConfirmRide}
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
        isConfirmDisabled={quoteQuery.isLoading || quoteQuery.isFetching || !quoteQuery.data}
        isConfirmLoading={createRideMutation.isPending}
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
