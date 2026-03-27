import React, { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import { useTheme } from '../../../../general/theme/theme';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Map, { MapMarker } from '../../../../general/components/Map';
import type { CachedAddress } from './types';
import { useNearbyDrivers } from '../../hooks/useRideQueries';

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
const NEARBY_RADIUS_KM = 7;

type Props = {
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

function RideOptionsMapLayer({ currentCoordinates, cachedAddresses }: Props) {
  const { colors } = useTheme();
  const mapRef = useRef<MapView | null>(null);
  const firstCachedCoordinates = cachedAddresses.find((item) => item.coordinates)?.coordinates ?? null;
  const nearbyDriversQuery = useNearbyDrivers(
    currentCoordinates?.latitude,
    currentCoordinates?.longitude,
    NEARBY_RADIUS_KM,
    {
      placeholderData: (previousData) => previousData,
    },
  );

  const markers = useMemo<MapMarker[]>(
    () =>
      [
        ...cachedAddresses
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
        ...(nearbyDriversQuery.data ?? []).map((driver) => ({
          id: `nearby-driver:${driver.id}`,
          coordinate: {
            latitude: driver.latitude,
            longitude: driver.longitude,
          },
          anchor: { x: 0.5, y: 0.5 },
          zIndex: 1,
          rotation: driver.heading,
          tracksViewChanges: false,
          render: (
            <View style={[styles.driverMarker, { backgroundColor: colors.surface, shadowColor: colors.shadowColor }]}>
              <Icon type="MaterialCommunityIcons" name="car" size={16} color={colors.text} />
            </View>
          ),
        })),
      ],
    [cachedAddresses, colors.shadowColor, colors.surface, colors.text, nearbyDriversQuery.data]
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
    </>
  );
}

export default memo(RideOptionsMapLayer);

const styles = StyleSheet.create({
  markerIcon: {
    width: 20,
    height: 20,
  },
  pickupMarkerIcon: {
    width: 36,
    height: 46,
  },
  driverMarker: {
    width: 28,
    height: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.16,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
