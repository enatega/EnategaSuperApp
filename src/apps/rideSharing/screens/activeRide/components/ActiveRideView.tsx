import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LatLng } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../../general/components/AppToast';
import { useTheme } from '../../../../../general/theme/theme';
import CancelRideBottomSheet from '../../../components/reservation/CancelRideBottomSheet';
import type { ActiveRidePayload, RideAddressSelection } from '../../../api/types';
import type { RideSharingStackParamList } from '../../../navigation/RideSharingNavigator';
import { useActiveRideCancellation } from '../hooks';
import { getActiveRideDriverUserId } from '../../../utils/activeRideMapper';
import { isCourierRideRequest } from '../../../utils/courierBooking';
import ActiveRideMapLayer from './ActiveRideMapLayer';
import ActiveRideBottomSheet from './ActiveRideBottomSheet';

type Props = {
  activeRide: ActiveRidePayload;
};

function readString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function readDisplayString(...values: Array<unknown>) {
  const resolvedValue = readString(...values);
  if (!resolvedValue) {
    return undefined;
  }

  const normalizedValue = resolvedValue.toLowerCase();
  if (
    normalizedValue === 'n/a'
    || normalizedValue === 'na'
    || normalizedValue === 'null'
    || normalizedValue === 'undefined'
  ) {
    return undefined;
  }

  return resolvedValue;
}

function readNumber(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number.parseFloat(value);
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function readCoordinates(value: {
  lat?: unknown;
  lng?: unknown;
  heading?: unknown;
  coordinates?: {
    coordinates?: unknown;
  } | null;
} | null | undefined) {
  if (!value) {
    return undefined;
  }

  const latitude = readNumber(value.lat);
  const longitude = readNumber(value.lng);

  if (latitude !== undefined && longitude !== undefined) {
    return {
      latitude,
      longitude,
      heading: readNumber(value.heading),
    };
  }

  const rawGeoJsonCoordinates = value.coordinates?.coordinates;
  const geoJsonCoordinates = Array.isArray(rawGeoJsonCoordinates)
    ? rawGeoJsonCoordinates
    : [];
  const geoJsonLongitude = readNumber(geoJsonCoordinates[0]);
  const geoJsonLatitude = readNumber(geoJsonCoordinates[1]);

  if (geoJsonLatitude === undefined || geoJsonLongitude === undefined) {
    return undefined;
  }

  return {
    latitude: geoJsonLatitude,
    longitude: geoJsonLongitude,
    heading: readNumber(value.heading),
  };
}

function createAddressSelection(
  rideId: string,
  kind: 'pickup' | 'dropoff' | 'stop',
  label: string,
  coordinates: LatLng,
  suffix?: string,
): RideAddressSelection {
  return {
    placeId: `${rideId}:${kind}${suffix ? `:${suffix}` : ''}`,
    description: label,
    structuredFormatting: {
      mainText: label,
    },
    coordinates,
  };
}

function formatStatusLabel(status?: string) {
  if (!status) {
    return undefined;
  }

  return status
    .trim()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPaymentMethod(paymentMethod?: string) {
  if (!paymentMethod) {
    return undefined;
  }

  return paymentMethod
    .trim()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getTitle(status?: string) {
  switch (status?.trim().toUpperCase()) {
    case 'ASSIGNED':
      return 'Arriving soon';
    case 'IN_PROGRESS':
      return 'On your trip';
    case 'COMPLETED':
      return 'Trip completed';
    default:
      return 'Active ride';
  }
}

function ActiveRideView({ activeRide }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const rideId = activeRide.ride_id;
  const status = activeRide.ride_status;
  const statusCode = status?.toUpperCase();
  const statusLabel = formatStatusLabel(status);
  const fare = readNumber(activeRide.agreed_price);
  const paymentMethodLabel = formatPaymentMethod(activeRide.payment_via);
  const driver = activeRide.driver;
  const vehicle = driver?.vehicle;
  const isCourierFlow = isCourierRideRequest(activeRide.ride_type?.name) || isCourierRideRequest(activeRide.ride_type?.id) || Boolean(activeRide.courierDetail);
  const driverUserId = getActiveRideDriverUserId(activeRide);
  const driverName = readDisplayString(driver?.user?.name);
  const driverRating = readNumber(driver?.dynamic_info?.averageRating);
  const driverAvatarUri = readString(driver?.user?.profile);
  const driverPhone = readString(driver?.user?.phone);
  const vehicleName = readDisplayString(vehicle?.name);
  const vehicleColor = readDisplayString(vehicle?.colour);
  const licensePlate = readDisplayString(vehicle?.no);
  const title = getTitle(status);
  const driverLocation = readCoordinates(driver?.user?.current_location);
  const driverCoordinate = driverLocation
    ? { latitude: driverLocation.latitude, longitude: driverLocation.longitude }
    : undefined;
  const driverHeading = driverLocation?.heading;
  const pickupLabel = activeRide.pickup_location;
  const pickupCoordinates = readCoordinates(activeRide.pickup);
  const fromAddress = rideId && activeRide.pickup_location && pickupCoordinates
    ? createAddressSelection(rideId, 'pickup', pickupLabel, pickupCoordinates)
    : null;
  const dropoffCoordinates = readCoordinates(activeRide.dropoff);
  const dropoffLabel = activeRide.dropoff_location;
  const toAddress = rideId && dropoffLabel && dropoffCoordinates
    ? createAddressSelection(rideId, 'dropoff', dropoffLabel, dropoffCoordinates)
    : null;
  const stopAddresses = rideId
    ? activeRide.stops.flatMap((stop, index) => {
        const stopLabel = readString(stop?.address);
        const stopCoordinates = readCoordinates(stop);

        if (!stopLabel || !stopCoordinates) {
          return [];
        }

        return [createAddressSelection(rideId, 'stop', stopLabel, stopCoordinates, String(index + 1))];
      })
    : [];
  const {
    canCancelRide,
    isCancelSheetVisible,
    isCancelling,
    openCancelSheet,
    closeCancelSheet,
    confirmCancelRide,
  } = useActiveRideCancellation({
    rideId,
    driverUserId,
    statusCode,
  });

  const handleContactDriver = useCallback(() => {
    if (!driverUserId) {
      showToast.info(t('ride_active_driver_contact_unavailable'));
      return;
    }

    navigation.navigate('RiderChat', {
      driverAvatarUri: driverAvatarUri ?? undefined,
      driverName: driverName || t('ride_active_driver_fallback'),
      driverPhone: driverPhone ?? undefined,
      driverUserId,
    });
  }, [driverAvatarUri, driverName, driverPhone, driverUserId, navigation, t]);

  const handleSafetyPress = useCallback(() => {
    showToast.info(t('ride_active_safety_coming_soon'));
  }, [t]);

  const handleShareRide = useCallback(() => {
    showToast.info(t('ride_active_share_coming_soon'));
  }, [t]);

  const handleEmergencyPress = useCallback(() => {
    showToast.info(t('ride_active_emergency_coming_soon'));
  }, [t]);

  const handleDriverPress = useCallback(() => {
    navigation.navigate('DriverProfile', { userId: driverUserId });
  }, [driverUserId, navigation]);

  if (!rideId || !fromAddress || !toAddress) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActiveRideMapLayer
        fromAddress={fromAddress}
        stopAddresses={stopAddresses}
        toAddress={toAddress}
        statusCode={statusCode}
        driverCoordinate={driverCoordinate}
        driverHeading={driverHeading}
      />
      <ActiveRideBottomSheet
        fromAddress={fromAddress}
        stopAddresses={stopAddresses.length ? stopAddresses : undefined}
        toAddress={toAddress}
        title={title}
        statusCode={statusCode}
        statusLabel={statusLabel}
        fare={fare}
        paymentMethodLabel={paymentMethodLabel}
        driverName={driverName}
        driverRating={driverRating}
        driverAvatarUri={driverAvatarUri}
        vehicleName={vehicleName}
        vehicleColor={vehicleColor}
        licensePlate={licensePlate}
        isCourierFlow={isCourierFlow}
        canCancelRide={canCancelRide}
        onDriverPress={handleDriverPress}
        onContactDriver={handleContactDriver}
        onSafetyPress={handleSafetyPress}
        onShareRide={handleShareRide}
        onEmergencyPress={handleEmergencyPress}
        onCancelRide={openCancelSheet}
      />
      <CancelRideBottomSheet
        isVisible={isCancelSheetVisible}
        onClose={closeCancelSheet}
        onConfirmCancel={confirmCancelRide}
        isLoading={isCancelling}
        title={t('reservation_confirm_cancel_title')}
        confirmLabel={t('reservation_confirm_cancel_yes')}
        continueLabel={t('reservation_confirm_cancel_no')}
      />
    </View>
  );
}

export default memo(ActiveRideView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
