import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Map, { MapMarker } from '../../../../general/components/Map';
import type { CachedAddress } from './types';

const mapMarkerIcon = require('../../../rideSharing/assets/images/map-pin.png');
const pickupMarkerIcon = require('../../../rideSharing/assets/images/map-pin.png') //'https://www.figma.com/api/mcp/asset/e71a825a-9a77-4f55-9458-a571fb6334e0';

const DEFAULT_REGION: Region = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const LOCATION_DELTA = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

type Props = {
  onBackPress: () => void;
  currentCoordinates: LatLng | null;
  cachedAddresses: CachedAddress[];
};

function getRegionFromCoordinates(coordinates: LatLng): Region {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    ...LOCATION_DELTA,
  };
}

function RideOptionsMapLayer({ onBackPress, currentCoordinates, cachedAddresses }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const firstCachedCoordinates = cachedAddresses.find((item) => item.coordinates)?.coordinates ?? null;

  const markers = useMemo<MapMarker[]>(
    () =>
      cachedAddresses
        .filter((item) => item.coordinates)
        .slice(0, 2)
        .map((item, index) => ({
          id: item.placeId,
          coordinate: item.coordinates!,
          active: true,
          tracksViewChanges: false,
          render: (
            <Image
              source={index === 0 ? pickupMarkerIcon : mapMarkerIcon}
              style={index === 0 ? styles.pickupMarkerIcon : styles.markerIcon}
            />
          ),
        })),
    [cachedAddresses]
  );

  const initialRegion = currentCoordinates
    ? getRegionFromCoordinates(currentCoordinates)
    : firstCachedCoordinates
      ? getRegionFromCoordinates(firstCachedCoordinates)
      : DEFAULT_REGION;

  useEffect(() => {
    if (currentCoordinates) {
      mapRef.current?.animateToRegion(getRegionFromCoordinates(currentCoordinates), 350);
      return;
    }

    if (firstCachedCoordinates) {
      mapRef.current?.animateToRegion(getRegionFromCoordinates(firstCachedCoordinates), 350);
    }
  }, [currentCoordinates, firstCachedCoordinates]);

  return (
    <>
      <Map
        ref={mapRef}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        markers={markers}
        useGoogleProvider
      />

      <View style={[styles.header, { top: insets.top + 8 }]}>
        <Pressable
          style={[
            styles.headerButton,
            { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
          ]}
          onPress={onBackPress}
        >
          <Icon type="Feather" name="menu" size={20} color={colors.text} />
        </Pressable>
      </View>
    </>
  );
}

export default memo(RideOptionsMapLayer);

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 16,
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
  markerIcon: {
    width: 20,
    height: 20,
  },
  pickupMarkerIcon: {
    width: 36,
    height: 46,
  },
});
