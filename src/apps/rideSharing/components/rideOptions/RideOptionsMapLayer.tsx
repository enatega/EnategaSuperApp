import React, { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import Map, { MapMarker } from '../../../../general/components/Map';
import type { RideAddressSelection } from '../../api/types';
import type { CachedAddress } from './types';
import { useNearbyDrivers } from '../../hooks/useRideQueries';

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
  fromAddress?: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress?: RideAddressSelection;
};

function getRegionFromCoordinates(coordinates: LatLng): Region {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    ...LOCATION_DELTA,
  };
}

function RideOptionsMapLayer({
  currentCoordinates,
  cachedAddresses,
  fromAddress,
  stopAddresses = [],
  toAddress,
}: Props) {
  const { colors } = useTheme();
  const mapRef = useRef<MapView | null>(null);
  const firstCachedCoordinates = cachedAddresses.find((item) => item.coordinates)?.coordinates ?? null;
  const tripPoints = useMemo(
    () => [fromAddress, ...stopAddresses, toAddress].filter(Boolean) as RideAddressSelection[],
    [fromAddress, stopAddresses, toAddress],
  );
  const nearbyDriversLatitude = currentCoordinates?.latitude
    ?? firstCachedCoordinates?.latitude
    ?? DEFAULT_REGION.latitude;
  const nearbyDriversLongitude = currentCoordinates?.longitude
    ?? firstCachedCoordinates?.longitude
    ?? DEFAULT_REGION.longitude;
  const nearbyDriversCenterRef = useRef({
    latitude: nearbyDriversLatitude,
    longitude: nearbyDriversLongitude,
  });
  const nearbyDriversQuery = useNearbyDrivers(
    nearbyDriversCenterRef.current.latitude,
    nearbyDriversCenterRef.current.longitude,
    NEARBY_RADIUS_KM,
    {
      placeholderData: (previousData) => previousData,
    },
  );

  const markers = useMemo<MapMarker[]>(
    () =>
      [
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
    [colors.shadowColor, colors.surface, colors.text, nearbyDriversQuery.data]
  );

  const initialRegion = tripPoints.length
    ? getRegionFromCoordinates(tripPoints[0].coordinates)
    : currentCoordinates
      ? getRegionFromCoordinates(currentCoordinates)
      : firstCachedCoordinates
        ? getRegionFromCoordinates(firstCachedCoordinates)
        : DEFAULT_REGION;

  useEffect(() => {
    if (tripPoints.length) {
      mapRef.current?.fitToCoordinates(
        tripPoints.map((point) => point.coordinates),
        {
          edgePadding: {
            top: 120,
            right: 60,
            bottom: 240,
            left: 60,
          },
          animated: true,
        },
      );
      return;
    }

    if (currentCoordinates) {
      mapRef.current?.animateToRegion(getRegionFromCoordinates(currentCoordinates), 350);
      return;
    }

    if (firstCachedCoordinates) {
      mapRef.current?.animateToRegion(getRegionFromCoordinates(firstCachedCoordinates), 350);
    }
  }, [currentCoordinates, firstCachedCoordinates, tripPoints]);

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
