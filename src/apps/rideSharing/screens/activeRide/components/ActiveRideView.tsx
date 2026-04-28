import React, { memo, useCallback } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { LatLng } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../../general/components/AppToast';
import { useTheme } from '../../../../../general/theme/theme';
import { useRideSharingEmergencyContact } from '../../../../../general/stores/useAppConfigStore';
import CancelRideBottomSheet from '../../../components/reservation/CancelRideBottomSheet';
import type { ActiveRidePayload, RideAddressSelection } from '../../../api/types';
import type { RideSharingStackParamList } from '../../../navigation/RideSharingNavigator';
import { useActiveRideCancellation } from '../hooks';
import { getActiveRideDriverUserId } from '../../../utils/activeRideMapper';
import { isCourierRideRequest } from '../../../utils/courierBooking';
import { openEmergencyDialer } from '../../../utils/safety';
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
  const emergencyContact = useRideSharingEmergencyContact();
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
    navigation.navigate('Safety', {
      driverName: driverName ?? undefined,
      driverAvatarUri: driverAvatarUri ?? undefined,
      driverRating: driverRating ?? undefined,
      vehicleLabel: [vehicleName, vehicleColor].filter(Boolean).join(' • ') || undefined,
    });
  }, [driverAvatarUri, driverName, driverRating, vehicleColor, vehicleName, navigation]);

  const handleShareRide = useCallback(() => {
    const originLatitude = fromAddress?.coordinates.latitude;
    const originLongitude = fromAddress?.coordinates.longitude;
    const destinationLatitude = toAddress?.coordinates.latitude;
    const destinationLongitude = toAddress?.coordinates.longitude;


    if (
      originLatitude === undefined
      || originLongitude === undefined
      || destinationLatitude === undefined
      || destinationLongitude === undefined
    ) {
      showToast.error(t('error'), t('ride_active_map_open_error'));
      return;
    }

    const openMaps = async () => {
      try {
        if (Platform.OS === 'ios') {
          const appleMapsUrl = `http://maps.apple.com/?saddr=${originLatitude},${originLongitude}&daddr=${destinationLatitude},${destinationLongitude}&dirflg=d`;
          console.log('[ActiveRideView][ShareRide] Apple Maps URL:', appleMapsUrl);
          const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl);
          console.log('[ActiveRideView][ShareRide] canOpenAppleMaps:', canOpenAppleMaps);

          if (!canOpenAppleMaps) {
            showToast.error(t('error'), t('ride_active_map_unavailable'));
            return;
          }

          await Linking.openURL(appleMapsUrl);
          return;
        }

        const googleNavigationUrl = `google.navigation:q=${destinationLatitude},${destinationLongitude}&mode=d`;
        console.log('[ActiveRideView][ShareRide] Google Navigation URL:', googleNavigationUrl);
        const canOpenGoogleNavigation = await Linking.canOpenURL(googleNavigationUrl);
        console.log('[ActiveRideView][ShareRide] canOpenGoogleNavigation:', canOpenGoogleNavigation);

        if (canOpenGoogleNavigation) {
          await Linking.openURL(googleNavigationUrl);
          return;
        }

        const googleMapsWebDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLatitude},${originLongitude}&destination=${destinationLatitude},${destinationLongitude}&travelmode=driving`;
        console.log('[ActiveRideView][ShareRide] Google Maps Web URL:', googleMapsWebDirectionsUrl);
        const canOpenGoogleMapsWeb = await Linking.canOpenURL(googleMapsWebDirectionsUrl);
        console.log('[ActiveRideView][ShareRide] canOpenGoogleMapsWeb:', canOpenGoogleMapsWeb);

        if (!canOpenGoogleMapsWeb) {
          showToast.error(t('error'), t('ride_active_map_unavailable'));
          return;
        }

        await Linking.openURL(googleMapsWebDirectionsUrl);
      } catch {
        showToast.error(t('error'), t('ride_active_map_open_error'));
      }
    };

    void openMaps();
  }, [
    fromAddress?.coordinates.latitude,
    fromAddress?.coordinates.longitude,
    t,
    toAddress?.coordinates.latitude,
    toAddress?.coordinates.longitude,
  ]);

  const handleEmergencyPress = useCallback(() => {
    void openEmergencyDialer(emergencyContact?.contact_number).catch(() => {
      showToast.info(t('ride_active_emergency_coming_soon'));
    });
  }, [emergencyContact?.contact_number, t]);

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
