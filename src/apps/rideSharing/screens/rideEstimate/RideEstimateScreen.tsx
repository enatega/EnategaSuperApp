import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import RideEstimateStatusCard from '../../components/rideEstimate/RideEstimateStatusCard';
import RideScheduleBottomSheet from '../../components/rideEstimate/schedule/RideScheduleBottomSheet';
import PaymentMethodBadge from '../../components/payment/PaymentMethodBadge';
import PaymentMethodBottomSheet from '../../components/payment/PaymentMethodBottomSheet';
import { getPaymentMethodOption, type PaymentMethodId } from '../../components/payment/paymentTypes';
import RideEstimateAddressSummaryCard from './components/RideEstimateAddressSummaryCard';
import RideEstimateBottomSheet from './components/RideEstimateBottomSheet';
import RideEstimateMapLayer from './components/RideEstimateMapLayer';
import RideEstimateTripPointsSheet from './components/RideEstimateTripPointsSheet';
import WalletTopUpPromptModal from './components/WalletTopUpPromptModal';
import { useTheme } from '../../../../general/theme/theme';
import { getApiErrorMessage } from '../../../../general/utils/apiError';
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
import { useCourierBookingStore } from '../../stores/useCourierBookingStore';
import { emitRideSharingEvent } from '../../socket/rideSharingSocket';
import {
  buildCourierCreateRidePayload,
  getCourierComment,
  isCourierBookingValid,
  isCourierRideRequest,
} from '../../utils/courierBooking';
import { resolveRideOfferMode, type RideOfferMode } from '../../utils/rideOffer';
import type { RideIntent } from '../../utils/rideOptions';
import { formatScheduledRideSummary, toApiScheduledDateString } from '../../utils/rideSchedule';
import { toCreateRideStops } from '../../utils/rideStops';
import { rideEstimateIcons } from './rideEstimateAssets';
import { showToast } from '../../../../general/components/AppToast';

type RouteParams = {
  rideType?: RideIntent;
  rideCategory?: RideOptionItem['id'];
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  stops?: RideAddressSelection[];
  offeredFare?: number;
  paymentMethodId?: PaymentMethodId;
  offerMode?: RideOfferMode;
  hourlyHours?: number;
};

const DEFAULT_PAYMENT_METHOD_ID: PaymentMethodId = 'wallet';
let lastSelectedPaymentMethodId: PaymentMethodId = DEFAULT_PAYMENT_METHOD_ID;

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

function getPassengerUserId(passenger: ActiveRideRequestPayload['passenger']) {
  return (
    passenger as { userProfile?: { user?: { id?: string } } } | undefined
  )?.userProfile?.user?.id;
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
    stops = [],
    rideCategory,
    offeredFare: initialOfferedFare,
    paymentMethodId: initialPaymentMethodId,
    offerMode: initialOfferMode,
    hourlyHours: initialHourlyHours,
  } = route.params as RouteParams;

  const quoteQuery = useRideEstimateOptions(fromAddress, toAddress, stops);
  const routeQuery = useRideRoutePath(fromAddress, toAddress, stops);
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
  const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethodId>(
    () => initialPaymentMethodId ?? lastSelectedPaymentMethodId,
  );
  const [isPaymentMethodVisible, setIsPaymentMethodVisible] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [wantsScheduledRide, setWantsScheduledRide] = useState(rideType === 'schedule');
  const [isSchedulePickerVisible, setIsSchedulePickerVisible] = useState(false);
  const [isTripPointsVisible, setIsTripPointsVisible] = useState(false);
  const [isWalletTopUpPromptVisible, setIsWalletTopUpPromptVisible] = useState(false);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const hasPresentedHourlyOfferRef = useRef(false);
  const createRideMutation = useCreateRide();
  const setActiveRideRequest = useActiveRideRequestStore((state) => state.setActiveRideRequest);
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
  const courierActiveTab = useCourierBookingStore((state) => state.activeTab);
  const courierToBuilding = useCourierBookingStore((state) => state.toBuilding);
  const courierToDoor = useCourierBookingStore((state) => state.toDoor);
  const courierBooking = useMemo(() => ({
    activeTab: courierActiveTab,
    toBuilding: courierToBuilding,
    toDoor: courierToDoor,
  }), [courierActiveTab, courierToBuilding, courierToDoor]);

  useEffect(() => {
    if (!initialPaymentMethodId) {
      return;
    }

    setPaymentMethodId(initialPaymentMethodId);
    lastSelectedPaymentMethodId = initialPaymentMethodId;
  }, [initialPaymentMethodId]);

  useEffect(() => {
    if (wantsScheduledRide && !scheduledAt) {
      setIsSchedulePickerVisible(true);
    }
  }, [scheduledAt, wantsScheduledRide]);

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
  const offerMode = resolveRideOfferMode(rideType, initialOfferMode);
  const isHourlyRide = offerMode === 'hourly';
  const isCourierFlow = rideType === 'courier' || isCourierRideRequest(selectedOption.title);
  const isCourierDetailsValid = isCourierBookingValid(courierBooking);
  const courierComment = getCourierComment(courierBooking);
  const hourlyMetaLabel = isHourlyRide && typeof initialHourlyHours === 'number'
    ? (initialHourlyHours === 1
      ? t('ride_offer_fare_hour_single', { count: initialHourlyHours })
      : t('ride_offer_fare_hour_plural', { count: initialHourlyHours }))
    : undefined;
  const scheduleLabel = scheduledAt
    ? formatScheduledRideSummary(scheduledAt)
    : t('ride_schedule_label');
  const displayOptions = options.map((item) => (
    item.id === resolvedSelectedOptionId
      ? {
        ...item,
        fare: selectedOptionCurrentFare,
        recommendedFare: item.fare,
      }
      : item
  ));
  const bottomSheetOptions = isCourierFlow
    ? displayOptions.filter((item) => item.id === resolvedSelectedOptionId)
    : displayOptions;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setLayoutHeight(event.nativeEvent.layout.height);
  }, []);

  const handleBottomSheetHeightChange = useCallback((height: number) => {
    setBottomSheetHeight((previousHeight) => {
      if (Math.abs(previousHeight - height) < 1) {
        return previousHeight;
      }

      return height;
    });
  }, []);

  const mapHeight = useMemo(() => {
    if (layoutHeight <= 0) {
      return null;
    }

    return Math.max(layoutHeight - bottomSheetHeight, 0);
  }, [bottomSheetHeight, layoutHeight]);

  const handleEditStop = (stopIndex: number) => {
    const selectedStop = stops[stopIndex];

    if (!selectedStop) {
      return;
    }

    navigation.navigate('RideAddressSearch', {
      rideType,
      rideCategory,
      fromAddress,
      toAddress,
      stops,
      stopAction: 'edit',
      stopIndex,
      prefilledStopAddress: selectedStop,
    });
  };

  const handleRemoveStop = (stopIndex: number) => {
    const nextStops = stops.filter((_, index) => index !== stopIndex);

    if (!nextStops.length) {
      setIsTripPointsVisible(false);
    }

    navigation.setParams({ stops: nextStops });
  };

  useEffect(() => {
    if (typeof initialOfferedFare === 'number') {
      setCustomFare(initialOfferedFare);
      return;
    }

    setCustomFare(undefined);
  }, [initialOfferedFare]);

  useEffect(() => {
    if (
      !isHourlyRide
      || typeof initialHourlyHours === 'number'
      || hasPresentedHourlyOfferRef.current
      || typeof selectedOptionRecommendedFare !== 'number'
    ) {
      return;
    }

    hasPresentedHourlyOfferRef.current = true;
    navigation.navigate('OfferFare', {
      rideType,
      rideCategory,
      fromAddress,
      toAddress,
      stops,
      offeredFare: selectedOptionCurrentFare,
      recommendedFare: selectedOptionRecommendedFare,
      paymentMethodId,
      offerMode: 'hourly',
    });
  }, [
    fromAddress,
    initialHourlyHours,
    isHourlyRide,
    navigation,
    paymentMethodId,
    rideCategory,
    rideType,
    selectedOptionCurrentFare,
    selectedOptionRecommendedFare,
    stops,
    toAddress,
  ]);

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

    if (wantsScheduledRide && !scheduledAt) {
      setIsSchedulePickerVisible(true);
      return;
    }

    if (isCourierFlow && !isCourierDetailsValid) {
      navigation.navigate('CourierDetails', {
        rideType,
        rideCategory,
        fromAddress,
        toAddress,
        stops,
        offeredFare: selectedOptionCurrentFare,
        paymentMethodId,
        offerMode,
        hourlyHours: initialHourlyHours,
        source: 'rideEstimate',
      });
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
      is_hourly: isHourlyRide,
      stops: toCreateRideStops(stops),
      pickup_address: fromAddress.description,
      pickup_location: fromAddress.description,
      dropoff_location: toAddress.description,
      destination_address: toAddress.description,
      is_scheduled: Boolean(scheduledAt),
      is_family: false,
      estimated_time: quoteQuery.data.durationMin,
      estimated_distance: quoteQuery.data.distanceKm,
      base_fair: selectedOptionRecommendedFare ?? resolvedFare,
      offered_fair: resolvedFare,
      ...(scheduledAt ? { scheduled_at: toApiScheduledDateString(scheduledAt) ?? scheduledAt.toISOString() } : {}),
      ...(isCourierFlow
        ? buildCourierCreateRidePayload({
          snapshot: courierBooking,
          fromAddress,
          toAddress,
        })
        : {}),
    };

    try {
      const createdRide = await createRideMutation.mutateAsync(createRidePayload) as {
        rideReq?: ActiveRideRequestPayload | null;
      } | null;
      console.log('Create ride API response', JSON.stringify(createdRide));
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
            passenger_user_id: getPassengerUserId(createdRideRequest?.passenger),
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
      console.log("Error creating ride:", error);

      const errorMessage = error?.message || "";
      console.log("Error message:", errorMessage);

      // Case: Not enough wallet balance
      if (errorMessage.includes("enough amount in your wallet")) {
        // showToast.error(
        //   t("error"),
        //   t("insufficient_wallet_balance") // create this translation key
        // );
        setIsWalletTopUpPromptVisible(true);

        return;
      }

      // Default error handling
      showToast.error(
        t("error"),
        getApiErrorMessage(error, t("ride_create_error_description"))
      );
    }
  };

  const handleSelectPaymentMethod = (nextPaymentMethodId: PaymentMethodId) => {
    setPaymentMethodId(nextPaymentMethodId);
    lastSelectedPaymentMethodId = nextPaymentMethodId;
    setIsPaymentMethodVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} onLayout={handleLayout}>
      <View
        style={[
          styles.mapContainer,
          mapHeight === null ? styles.mapContainerFallback : { height: mapHeight },
        ]}
      >
        <RideEstimateMapLayer
          fromAddress={fromAddress}
          stopAddresses={stops}
          toAddress={toAddress}
          routeCoordinates={routeQuery.data ?? []}
        />
      </View>
      <RideEstimateAddressSummaryCard
        fromAddress={fromAddress}
        stopAddresses={stops}
        toAddress={toAddress}
        onAddStopPress={() => navigation.navigate('RideAddressSearch', {
          rideType,
          rideCategory,
          fromAddress,
          toAddress,
          stops,
          stopAction: 'add',
        })}
        onStopPress={handleEditStop}
        onRemoveStopPress={handleRemoveStop}
        onViewStopsPress={() => setIsTripPointsVisible(true)}
        viewStopsLabel={t('ride_trip_points_view_all')}
        moreStopsLabel={(count) => t('ride_trip_points_more_stops', { count })}
        removeStopLabel={(count) => t('ride_trip_points_remove_stop', { count })}
      />
      <RideEstimateBottomSheet
        options={bottomSheetOptions}
        selectedOptionId={resolvedSelectedOptionId}
        onSelectOption={(nextOptionId) => {
          setSelectedOptionId(nextOptionId);
          const nextOption = options.find((item) => item.id === nextOptionId);
          setCustomFare(nextOption?.fare);
        }}
        onConfirmRide={handleConfirmRide}
        onBackPress={() => navigation.goBack()}
        floatingStatusCard={showRouteAlert ? (
          <RideEstimateStatusCard
            title={t('ride_estimate_route_error_title')}
            message={routeErrorMessage ?? t('ride_estimate_route_error_description')}
            variant="warning"
            actionLabel={t('ride_estimate_retry')}
            onActionPress={() => routeQuery.refetch()}
            compact
          />
        ) : null}
        paymentMethodLabel={paymentMethodLabel}
        paymentMethodBadge={<PaymentMethodBadge paymentMethodId={paymentMethodId} size="sm" />}
        onPaymentMethodPress={() => setIsPaymentMethodVisible(true)}
        selectedOptionMetaLabel={hourlyMetaLabel}
        isCourierFlow={isCourierFlow}
        courierCommentLabel={courierComment ?? t('ride_courier_comment_label')}
        onCourierDetailsPress={() => navigation.navigate('CourierDetails', {
          rideType,
          rideCategory,
          fromAddress,
          toAddress,
          stops,
          offeredFare: selectedOptionCurrentFare,
          paymentMethodId,
          offerMode,
          hourlyHours: initialHourlyHours,
          source: 'rideEstimate',
        })}
        confirmButtonLabel={isCourierFlow ? t('ride_find_courier_button') : undefined}
        scheduleLabel={scheduleLabel}
        hasScheduledRide={Boolean(scheduledAt)}
        onSchedulePress={() => {
          setWantsScheduledRide(true);
          setIsSchedulePickerVisible(true);
        }}
        onClearSchedule={() => {
          setScheduledAt(null);
          setWantsScheduledRide(false);
        }}
        onEditFarePress={() => navigation.navigate('OfferFare', {
          rideType,
          rideCategory,
          fromAddress,
          toAddress,
          stops,
          offeredFare: selectedOptionCurrentFare,
          recommendedFare: selectedOptionRecommendedFare,
          paymentMethodId,
          offerMode,
          hourlyHours: initialHourlyHours,
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
        isConfirmDisabled={quoteQuery.isLoading || quoteQuery.isFetching || !quoteQuery.data || (isCourierFlow && !isCourierDetailsValid)}
        isConfirmLoading={createRideMutation.isPending}
        onHeightChange={handleBottomSheetHeightChange}
      />

      <PaymentMethodBottomSheet
        visible={isPaymentMethodVisible}
        selectedPaymentMethodId={paymentMethodId}
        onClose={() => setIsPaymentMethodVisible(false)}
        onSelect={handleSelectPaymentMethod}
      />

      <WalletTopUpPromptModal
        cancelLabel={t('cancel_button')}
        message={t('wallet_top_up_prompt_message')}
        onCancel={() => setIsWalletTopUpPromptVisible(false)}
        onTopUp={() => {
          setIsWalletTopUpPromptVisible(false);
          navigation.navigate('WalletHome');
        }}
        title={t('wallet_top_up_prompt_title')}
        topUpLabel={t('wallet_top_up_prompt_confirm')}
        visible={isWalletTopUpPromptVisible}
      />

      {!isCourierFlow ? (
        <RideScheduleBottomSheet
          visible={isSchedulePickerVisible}
          value={scheduledAt}
          onClose={() => setIsSchedulePickerVisible(false)}
          onConfirm={(nextDate) => {
            setWantsScheduledRide(true);
            setScheduledAt(nextDate);
            setIsSchedulePickerVisible(false);
          }}
        />
      ) : null}

      <RideEstimateTripPointsSheet
        visible={isTripPointsVisible}
        title={t('ride_trip_points_title')}
        originLabel={t('ride_trip_points_origin')}
        stopLabel={(index) => t('ride_trip_points_stop', { count: index })}
        destinationLabel={t('ride_trip_points_destination')}
        fromAddress={fromAddress}
        stopAddresses={stops}
        toAddress={toAddress}
        onStopPress={handleEditStop}
        removeStopLabel={(count) => t('ride_trip_points_remove_stop', { count })}
        onRemoveStop={handleRemoveStop}
        onClose={() => setIsTripPointsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  mapContainerFallback: {
    flex: 1,
  },
});
