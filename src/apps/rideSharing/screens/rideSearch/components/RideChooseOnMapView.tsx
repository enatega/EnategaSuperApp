import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { LatLng, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import Map from '../../../../../general/components/Map';
import MapCurrentLocationButton from '../../../../../general/components/MapCurrentLocationButton';
import Button from '../../../../../general/components/Button';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import useCurrentLocation from '../../../../../general/hooks/useCurrentLocation';
import useDebouncedValue from '../../../../../general/hooks/useDebouncedValue';
import type { RideAddressSelection } from '../../../api/types';
import { splitAddressDescription } from '../../../utils/rideAddress';

type Props = {
  activeField: 'from' | 'to' | 'stop';
  initialCoordinate?: LatLng | null;
  onBackPress: () => void;
  onConfirm: (address: RideAddressSelection) => Promise<void> | void;
};

const DEFAULT_REGION: Region = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const FOCUSED_DELTA = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

function toRegion(coordinate: LatLng): Region {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    ...FOCUSED_DELTA,
  };
}

function toCoordinateKey(coordinate: LatLng | null) {
  if (!coordinate) {
    return '';
  }

  return `${coordinate.latitude.toFixed(5)},${coordinate.longitude.toFixed(5)}`;
}

function normalizeAddressPart(value: string | null | undefined) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[-/,#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactAddressPart(value: string | null | undefined) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function formatReverseGeocodeResult(result: Location.LocationGeocodedAddress | null) {
  if (!result) {
    return {
      description: '',
    };
  }

  const streetLine = [compactAddressPart(result.streetNumber), compactAddressPart(result.street)]
    .filter(Boolean)
    .join(' ')
    .trim();

  const candidates = [
    compactAddressPart(result.name),
    streetLine,
    compactAddressPart(result.district),
    result.city,
    result.subregion,
    result.region,
    result.postalCode,
    result.country,
  ]
    .map(compactAddressPart)
    .filter(Boolean);

  const dedupedParts = candidates.reduce<string[]>((parts, candidate) => {
    const normalizedCandidate = normalizeAddressPart(candidate);

    if (!normalizedCandidate) {
      return parts;
    }

    const isDuplicate = parts.some((existingPart) => {
      const normalizedExisting = normalizeAddressPart(existingPart);

      return normalizedExisting === normalizedCandidate
        || normalizedExisting.includes(normalizedCandidate)
        || normalizedCandidate.includes(normalizedExisting);
    });

    if (!isDuplicate) {
      parts.push(candidate);
    }

    return parts;
  }, []);

  const description = dedupedParts.join(', ').trim();

  return { description };
}

function RideChooseOnMapView({
  activeField,
  initialCoordinate = null,
  onBackPress,
  onConfirm,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('rideSharing');
  const mapRef = useRef<MapView | null>(null);
  const latestRequestId = useRef(0);
  const lastGeocodedCoordinateKeyRef = useRef('');
  const lastAppliedInitialCoordinateKeyRef = useRef('');
  const hasPendingGestureRef = useRef(false);
  const hasPendingProgrammaticMoveRef = useRef(false);
  const [centerCoordinate, setCenterCoordinate] = useState<LatLng | null>(initialCoordinate);
  const [resolvedAddress, setResolvedAddress] = useState<RideAddressSelection | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { currentCoordinates, isLoadingCurrentLocation, refreshCurrentLocation } = useCurrentLocation();

  const debouncedCenterCoordinate = useDebouncedValue(centerCoordinate, 400);

  const initialRegion = useMemo(
    () => (initialCoordinate ? toRegion(initialCoordinate) : DEFAULT_REGION),
    [initialCoordinate],
  );

  const moveMapToCoordinate = useCallback((coordinate: LatLng) => {
    hasPendingProgrammaticMoveRef.current = true;
    setCenterCoordinate(coordinate);
    setIsResolvingAddress(true);
    mapRef.current?.animateToRegion(toRegion(coordinate), 250);
  }, []);

  useEffect(() => {
    if (initialCoordinate) {
      const initialCoordinateKey = toCoordinateKey(initialCoordinate);
      if (lastAppliedInitialCoordinateKeyRef.current === initialCoordinateKey) {
        return;
      }

      lastAppliedInitialCoordinateKeyRef.current = initialCoordinateKey;
      moveMapToCoordinate(initialCoordinate);
      return;
    }

    lastAppliedInitialCoordinateKeyRef.current = '';

    if (!currentCoordinates) {
      return;
    }

    if (centerCoordinate) {
      return;
    }

    moveMapToCoordinate(currentCoordinates);
  }, [centerCoordinate, currentCoordinates, initialCoordinate, moveMapToCoordinate]);

  useEffect(() => {
    const targetCoordinate = debouncedCenterCoordinate;
    const targetCoordinateKey = toCoordinateKey(targetCoordinate);

    if (!targetCoordinate || targetCoordinateKey.length === 0) {
      return;
    }

    if (targetCoordinateKey === lastGeocodedCoordinateKeyRef.current) {
      setIsResolvingAddress(false);
      return;
    }

    let isMounted = true;
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setIsResolvingAddress(true);

    void (async () => {
      try {
        const [result] = await Location.reverseGeocodeAsync(targetCoordinate);

        if (!isMounted || latestRequestId.current !== requestId) {
          return;
        }

        const formatted = formatReverseGeocodeResult(result ?? null);
        const description = formatted.description || t('ride_address_map_selected_location');

        setResolvedAddress({
          placeId: `map:${targetCoordinate.latitude.toFixed(6)},${targetCoordinate.longitude.toFixed(6)}`,
          description,
          structuredFormatting: splitAddressDescription(description),
          coordinates: targetCoordinate,
        });
        lastGeocodedCoordinateKeyRef.current = targetCoordinateKey;
      } catch (error) {
        if (!isMounted || latestRequestId.current !== requestId) {
          return;
        }

        const fallbackDescription = t('ride_address_map_selected_location');

        setResolvedAddress({
          placeId: `map:${targetCoordinate.latitude.toFixed(6)},${targetCoordinate.longitude.toFixed(6)}`,
          description: fallbackDescription,
          structuredFormatting: splitAddressDescription(fallbackDescription),
          coordinates: targetCoordinate,
        });
        lastGeocodedCoordinateKeyRef.current = targetCoordinateKey;
      } finally {
        if (isMounted && latestRequestId.current === requestId) {
          setIsResolvingAddress(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [debouncedCenterCoordinate, t]);

  const handleRegionChangeComplete = useCallback((region: Region) => {
    const shouldHandleChange = hasPendingGestureRef.current || hasPendingProgrammaticMoveRef.current;
    hasPendingGestureRef.current = false;
    hasPendingProgrammaticMoveRef.current = false;

    if (!shouldHandleChange) {
      return;
    }

    const nextCoordinate = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    const nextCoordinateKey = toCoordinateKey(nextCoordinate);

    if (nextCoordinateKey === toCoordinateKey(centerCoordinate)) {
      return;
    }

    setIsResolvingAddress(true);
    setCenterCoordinate(nextCoordinate);
  }, [centerCoordinate]);

  const handlePressCurrentLocation = useCallback(async () => {
    const nextCoordinates = await refreshCurrentLocation();

    if (!nextCoordinates) {
      return;
    }

    moveMapToCoordinate(nextCoordinates);
  }, [moveMapToCoordinate, refreshCurrentLocation]);

  const handleConfirm = useCallback(async () => {
    if (!resolvedAddress || isConfirming) {
      return;
    }

    setIsConfirming(true);

    try {
      await onConfirm(resolvedAddress);
    } finally {
      setIsConfirming(false);
    }
  }, [isConfirming, onConfirm, resolvedAddress]);

  const confirmLabel = activeField === 'from'
    ? t('ride_address_confirm_pickup')
    : activeField === 'stop'
      ? t('ride_address_stop_title')
      : t('ride_address_confirm_dropoff');
  const addressChipTitle = isResolvingAddress
    ? t('ride_address_map_locating')
    : resolvedAddress?.structuredFormatting.mainText || t('ride_address_map_selected_location');
  const addressChipSubtitle = !isResolvingAddress
    ? resolvedAddress?.structuredFormatting.secondaryText
    : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Map
        ref={mapRef}
        initialRegion={initialRegion}
        onPanDrag={() => {
          hasPendingGestureRef.current = true;
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        useGoogleProvider
      />

      <View pointerEvents="box-none" style={styles.overlay}>
        <View style={[styles.header, { top: insets.top + 8 }]}>
          <Pressable
            onPress={onBackPress}
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon type="Ionicons" name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View pointerEvents="none" style={styles.centerMarkerWrap}>
          <View
            style={[
              styles.addressChip,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Text variant="caption" weight="semiBold" numberOfLines={1} style={styles.addressChipTitle}>
              {addressChipTitle}
            </Text>
            {addressChipSubtitle ? (
              <Text
                variant="caption"
                numberOfLines={2}
                style={[styles.addressChipSubtitle, { color: colors.mutedText }]}
              >
                {addressChipSubtitle}
              </Text>
            ) : null}
          </View>
          <View style={styles.markerStack}>
            <View style={[styles.markerHalo, { backgroundColor: 'rgba(35, 70, 232, 0.16)' }]} />
            <View style={[styles.markerDotOuter, { backgroundColor: '#7DD3FC' }]}>
              <View style={[styles.markerDotInner, { backgroundColor: colors.primary }]} />
            </View>
            <View style={[styles.markerStem, { backgroundColor: '#7DD3FC' }]} />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 18 }]}>
          <MapCurrentLocationButton
            onPress={handlePressCurrentLocation}
            isLoading={isLoadingCurrentLocation}
            style={styles.currentLocationButton}
          />
          <Button
            label={confirmLabel}
            onPress={handleConfirm}
            isLoading={isConfirming}
            disabled={!resolvedAddress || isResolvingAddress}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(RideChooseOnMapView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    position: 'absolute',
    left: 16,
    zIndex: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  centerMarkerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  addressChip: {
    maxWidth: 300,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addressChipTitle: {
    textAlign: 'center',
  },
  addressChipSubtitle: {
    textAlign: 'center',
    marginTop: 2,
  },
  markerStack: {
    alignItems: 'center',
  },
  markerHalo: {
    position: 'absolute',
    bottom: -18,
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  markerDotOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDotInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerStem: {
    width: 4,
    height: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginTop: -2,
  },
  footer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  currentLocationButton: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    minHeight: 44,
    borderRadius: 6,
    borderWidth: 0,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
