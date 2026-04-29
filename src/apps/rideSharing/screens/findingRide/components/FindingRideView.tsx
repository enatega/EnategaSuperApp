import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type {
  ActiveRideStop,
  RideAddressSelection,
} from '../../../api/types';
import FindingRideBottomSheet from './FindingRideBottomSheet';
import FindingRideBidsList from './FindingRideBidsList';
import FindingRideMapLayer from './FindingRideMapLayer';
import useRideRoutePath from '../../../hooks/useRideRoutePath';
import { useTheme } from '../../../../../general/theme/theme';
import { useFindingRideController } from '../hooks/useFindingRideController';
import type { FindingRideViewProps } from '../types/view';
import { isCourierRideRequest } from '../../../utils/courierBooking';
import { useRideBidsStore } from '../../../stores/useRideBidsStore';
import CancelRideBottomSheet from '../../../components/reservation/CancelRideBottomSheet';

function toAddressSelection(
  requestId: string,
  kind: 'pickup' | 'dropoff' | 'stop',
  description: string,
  coordinates: { lat: number; lng: number },
  suffix?: string,
): RideAddressSelection {
  return {
    placeId: `${requestId}:${kind}${suffix ? `:${suffix}` : ''}`,
    description,
    structuredFormatting: {
      mainText: description,
    },
    coordinates: {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    },
  };
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string') {
    const parsedValue = Number.parseFloat(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function readRequestCoordinates(value: {
  lat?: number | string | null;
  lng?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
} | null | undefined) {
  if (!value) {
    return null;
  }

  const lat = toNumber(value.lat ?? value.latitude);
  const lng = toNumber(value.lng ?? value.longitude);

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  return { lat, lng };
}

function readStopCoordinates(stop: ActiveRideStop) {
  const lat = toNumber(stop.lat);
  const lng = toNumber(stop.lng);

  if (typeof lat === 'number' && typeof lng === 'number') {
    return { lat, lng };
  }

  const geoJsonCoordinates = stop.coordinates?.coordinates;

  if (!Array.isArray(geoJsonCoordinates) || geoJsonCoordinates.length < 2) {
    return null;
  }

  const geoLng = toNumber(geoJsonCoordinates[0]);
  const geoLat = toNumber(geoJsonCoordinates[1]);

  if (typeof geoLat !== 'number' || typeof geoLng !== 'number') {
    return null;
  }

  return { lat: geoLat, lng: geoLng };
}

function toCurrencyNumber(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number.parseFloat(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

export default function FindingRideView({
  activeRideRequest,
  ...props
}: FindingRideViewProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const bidsCount = useRideBidsStore((state) => state.bids.length);
  const [isCancelSheetVisible, setIsCancelSheetVisible] = useState(false);
  const pickupCoordinates = useMemo(
    () => readRequestCoordinates(activeRideRequest.pickup),
    [activeRideRequest.pickup],
  );
  const dropoffCoordinates = useMemo(
    () => readRequestCoordinates(activeRideRequest.dropoff),
    [activeRideRequest.dropoff],
  );
  const fromAddress = useMemo(() => toAddressSelection(
    activeRideRequest.id,
    'pickup',
    activeRideRequest.pickup_location,
    pickupCoordinates!,
  ), [
    activeRideRequest.id,
    activeRideRequest.pickup_location,
    pickupCoordinates,
  ]);
  const toAddress = useMemo(() => toAddressSelection(
    activeRideRequest.id,
    'dropoff',
    activeRideRequest.dropoff_location,
    dropoffCoordinates!,
  ), [
    activeRideRequest.dropoff_location,
    activeRideRequest.id,
    dropoffCoordinates,
  ]);
  const stopAddresses = useMemo(() => (
    (activeRideRequest.stops ?? [])
      .map((stop, index) => {
        const coordinates = readStopCoordinates(stop);

        if (!coordinates || !stop.address) {
          return null;
        }

        const stopKey = stop.id
          ?? (stop.order !== null && stop.order !== undefined ? String(stop.order) : undefined)
          ?? String(index + 1);

        return toAddressSelection(
          activeRideRequest.id,
          'stop',
          stop.address,
          coordinates,
          stopKey,
        );
      })
      .filter((stop): stop is RideAddressSelection => stop !== null)
  ), [
    activeRideRequest.id,
    activeRideRequest.stops,
  ]);
  const selectedRide = useMemo(() => ({
    id: activeRideRequest.ride_type_id,
    title: activeRideRequest.ride_type?.name ?? 'Ride',
    icon: activeRideRequest.ride_type?.imageUrl ?? undefined,
    seats: activeRideRequest.ride_type?.seatCount,
    fare: toCurrencyNumber(activeRideRequest.offeredFair),
    recommendedFare: toCurrencyNumber(activeRideRequest.baseFair),
  }), [
    activeRideRequest.baseFair,
    activeRideRequest.offeredFair,
    activeRideRequest.ride_type?.imageUrl,
    activeRideRequest.ride_type?.name,
    activeRideRequest.ride_type?.seatCount,
    activeRideRequest.ride_type_id,
  ]);
  const isCourierFlow = isCourierRideRequest(selectedRide.title) || isCourierRideRequest(activeRideRequest.ride_type_id);
  const routeQuery = useRideRoutePath(fromAddress, toAddress, stopAddresses);
  const controller = useFindingRideController({
    activeRideRequest,
    fromAddress,
    toAddress,
    selectedRide,
    ...props,
  });
  const openCancelSheet = useCallback(() => {
    if (controller.isCancelLoading) {
      return;
    }

    setIsCancelSheetVisible(true);
  }, [controller.isCancelLoading]);

  const closeCancelSheet = useCallback(() => {
    if (controller.isCancelLoading) {
      return;
    }

    setIsCancelSheetVisible(false);
  }, [controller.isCancelLoading]);

  const confirmCancelRide = useCallback(() => {
    void controller.handleCancelRide();
  }, [controller]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FindingRideMapLayer
        fromAddress={fromAddress}
        stopAddresses={stopAddresses}
        toAddress={toAddress}
        routeCoordinates={routeQuery.data ?? []}
      />

      <FindingRideBottomSheet
        selectedRide={{
          ...selectedRide,
          fare: controller.currentFare,
          recommendedFare: controller.minimumFare,
        }}
        findingTitle={
          bidsCount > 0
            ? (isCourierFlow ? t('ride_finding_accept_courier_offer_title') : t('ride_finding_accept_driver_offer_title'))
            : (isCourierFlow ? t('ride_finding_courier_title') : t('ride_finding_driver_title'))
        }
        cancelLabel={isCourierFlow ? t('ride_finding_cancel_courier') : t('ride_finding_cancel')}
        fare={controller.currentFare}
        recommendedFare={controller.minimumFare}
        timeLeftSec={controller.timeLeftSec}
        onIncreaseFare={controller.handleIncreaseFare}
        onDecreaseFare={controller.handleDecreaseFare}
        isIncreaseDisabled={controller.isIncreaseDisabled}
        isDecreaseDisabled={controller.isDecreaseDisabled}
        onKeepSearching={controller.handleKeepSearching}
        isKeepSearchingLoading={controller.isKeepSearchingLoading}
        onCancelRide={openCancelSheet}
        isCancelLoading={controller.isCancelLoading}
        floatingAccessory={(
          <FindingRideBidsList
            onAcceptBid={controller.handleAcceptBid}
            onDeclineBid={controller.handleDeclineBid}
            acceptingBidId={controller.acceptingBidId}
            decliningBidId={controller.decliningBidId}
            isInteractionLocked={controller.isBidInteractionLocked}
          />
        )}
      />
      <CancelRideBottomSheet
        isVisible={isCancelSheetVisible}
        onClose={closeCancelSheet}
        onConfirmCancel={confirmCancelRide}
        isLoading={controller.isCancelLoading}
        title={t('reservation_confirm_cancel_title')}
        confirmLabel={t('reservation_confirm_cancel_yes')}
        continueLabel={t('reservation_confirm_cancel_no')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
