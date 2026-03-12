import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { LatLng, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import Map from '../../../../general/components/Map';
import MapCurrentLocationButton from '../../../../general/components/MapCurrentLocationButton';
import Button from '../../../../general/components/Button';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import useCurrentLocation from '../../../../general/hooks/useCurrentLocation';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';

export type MapAddressResult = {
  description: string;
  mainText: string;
  secondaryText?: string;
  latitude: number;
  longitude: number;
};

type Props = {
  initialCoordinate?: LatLng | null;
  onBackPress: () => void;
  onConfirm: (result: MapAddressResult) => void;
  confirmLabel: string;
  locatingLabel: string;
  fallbackLabel: string;
};

const DEFAULT_REGION: Region = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const FOCUSED_DELTA = { latitudeDelta: 0.012, longitudeDelta: 0.012 };

function toRegion(coord: LatLng): Region {
  return { latitude: coord.latitude, longitude: coord.longitude, ...FOCUSED_DELTA };
}

function toKey(coord: LatLng | null) {
  if (!coord) return '';
  return `${coord.latitude.toFixed(5)},${coord.longitude.toFixed(5)}`;
}

function compactPart(value: string | null | undefined) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function formatGeocode(result: Location.LocationGeocodedAddress | null) {
  if (!result) return { description: '', mainText: '' };

  const street = [compactPart(result.streetNumber), compactPart(result.street)]
    .filter(Boolean).join(' ').trim();

  const candidates = [
    compactPart(result.name), street, compactPart(result.district),
    result.city, result.subregion, result.region, result.postalCode, result.country,
  ].map(compactPart).filter(Boolean);

  const normalized = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const deduped = candidates.reduce<string[]>((parts, c) => {
    const nc = normalized(c);
    if (!nc) return parts;
    const isDup = parts.some((p) => {
      const np = normalized(p);
      return np === nc || np.includes(nc) || nc.includes(np);
    });
    if (!isDup) parts.push(c);
    return parts;
  }, []);

  const description = deduped.join(', ');
  const mainText = deduped[0] ?? description;
  const secondaryText = deduped.slice(1).join(', ') || undefined;
  return { description, mainText, secondaryText };
}

function AddressChooseOnMap({
  initialCoordinate = null,
  onBackPress,
  onConfirm,
  confirmLabel,
  locatingLabel,
  fallbackLabel,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const latestReqId = useRef(0);
  const lastGeoKey = useRef('');
  const lastInitKey = useRef('');
  const hasPendingGesture = useRef(false);
  const hasPendingMove = useRef(false);

  const [center, setCenter] = useState<LatLng | null>(initialCoordinate);
  const [resolved, setResolved] = useState<MapAddressResult | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { currentCoordinates, isLoadingCurrentLocation, refreshCurrentLocation } = useCurrentLocation();

  const debouncedCenter = useDebouncedValue(center, 400);

  const initialRegion = useMemo(
    () => (initialCoordinate ? toRegion(initialCoordinate) : DEFAULT_REGION),
    [initialCoordinate],
  );

  const moveMap = useCallback((coord: LatLng) => {
    hasPendingMove.current = true;
    setCenter(coord);
    setIsResolving(true);
    mapRef.current?.animateToRegion(toRegion(coord), 250);
  }, []);

  useEffect(() => {
    if (initialCoordinate) {
      const k = toKey(initialCoordinate);
      if (lastInitKey.current === k) return;
      lastInitKey.current = k;
      moveMap(initialCoordinate);
      return;
    }
    lastInitKey.current = '';
    if (!currentCoordinates || center) return;
    moveMap(currentCoordinates);
  }, [center, currentCoordinates, initialCoordinate, moveMap]);

  useEffect(() => {
    const target = debouncedCenter;
    const targetKey = toKey(target);
    if (!target || !targetKey) return;
    if (targetKey === lastGeoKey.current) { setIsResolving(false); return; }

    let mounted = true;
    const reqId = ++latestReqId.current;
    setIsResolving(true);

    void (async () => {
      try {
        const [result] = await Location.reverseGeocodeAsync(target);
        if (!mounted || latestReqId.current !== reqId) return;
        const fmt = formatGeocode(result ?? null);
        const desc = fmt.description || fallbackLabel;
        setResolved({
          description: desc,
          mainText: fmt.mainText || desc,
          secondaryText: fmt.secondaryText,
          latitude: target.latitude,
          longitude: target.longitude,
        });
        lastGeoKey.current = targetKey;
      } catch {
        if (!mounted || latestReqId.current !== reqId) return;
        setResolved({
          description: fallbackLabel,
          mainText: fallbackLabel,
          latitude: target.latitude,
          longitude: target.longitude,
        });
        lastGeoKey.current = targetKey;
      } finally {
        if (mounted && latestReqId.current === reqId) setIsResolving(false);
      }
    })();

    return () => { mounted = false; };
  }, [debouncedCenter, fallbackLabel]);

  const handleRegionComplete = useCallback((region: Region) => {
    const shouldHandle = hasPendingGesture.current || hasPendingMove.current;
    hasPendingGesture.current = false;
    hasPendingMove.current = false;
    if (!shouldHandle) return;
    const next = { latitude: region.latitude, longitude: region.longitude };
    if (toKey(next) === toKey(center)) return;
    setIsResolving(true);
    setCenter(next);
  }, [center]);

  const handleCurrentLocation = useCallback(async () => {
    const coords = await refreshCurrentLocation();
    if (coords) moveMap(coords);
  }, [moveMap, refreshCurrentLocation]);

  const handleConfirm = useCallback(async () => {
    if (!resolved || isConfirming) return;
    setIsConfirming(true);
    try { onConfirm(resolved); } finally { setIsConfirming(false); }
  }, [isConfirming, onConfirm, resolved]);

  const chipTitle = isResolving ? locatingLabel : (resolved?.mainText || fallbackLabel);
  const chipSubtitle = !isResolving ? resolved?.secondaryText : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Map
        ref={mapRef}
        initialRegion={initialRegion}
        onPanDrag={() => { hasPendingGesture.current = true; }}
        onRegionChangeComplete={handleRegionComplete}
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
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={[
              styles.headerButton,
              { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
            ]}
          >
            <Icon type="Ionicons" name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View pointerEvents="none" style={styles.centerMarkerWrap}>
          <View style={[styles.addressChip, { backgroundColor: colors.surface, shadowColor: colors.shadowColor }]}>
            <Text variant="caption" weight="semiBold" numberOfLines={1} style={styles.chipTitle}>
              {chipTitle}
            </Text>
            {chipSubtitle ? (
              <Text variant="caption" numberOfLines={2} style={styles.chipSubtitle} color={colors.mutedText}>
                {chipSubtitle}
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
            onPress={handleCurrentLocation}
            isLoading={isLoadingCurrentLocation}
            style={styles.currentLocationBtn}
          />
          <Button
            label={confirmLabel}
            onPress={handleConfirm}
            isLoading={isConfirming}
            disabled={!resolved || isResolving}
            style={styles.confirmBtn}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(AddressChooseOnMap);

const styles = StyleSheet.create({
  addressChip: {
    borderRadius: 8,
    elevation: 4,
    maxWidth: 300,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  centerMarkerWrap: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chipSubtitle: { marginTop: 2, textAlign: 'center' },
  chipTitle: { textAlign: 'center' },
  confirmBtn: {
    borderRadius: 6,
    borderWidth: 0,
    elevation: 4,
    minHeight: 44,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },
  container: { flex: 1 },
  currentLocationBtn: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 40,
  },
  footer: { gap: 12, paddingHorizontal: 16 },
  header: { left: 16, position: 'absolute', zIndex: 2 },
  headerButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: 40,
  },
  markerDotInner: {
    borderColor: '#FFFFFF',
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  markerDotOuter: {
    alignItems: 'center',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  markerHalo: {
    borderRadius: 27,
    bottom: -18,
    height: 54,
    position: 'absolute',
    width: 54,
  },
  markerStem: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 20,
    marginTop: -2,
    width: 4,
  },
  markerStack: { alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
});
