import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LatLng } from 'react-native-maps';
import Map, { type MapMarker, type MapPolyline } from '../../../../../general/components/Map';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  routeCoordinates: LatLng[];
  driverCoordinate?: LatLng;
};

function ActiveRideMapLayer({
  fromAddress,
  toAddress,
  routeCoordinates,
  driverCoordinate,
}: Props) {
  const { colors } = useTheme();

  const markers = useMemo<MapMarker[]>(() => {
    const nextMarkers: MapMarker[] = [
      {
        id: 'pickup',
        coordinate: fromAddress.coordinates,
        zIndex: 2,
        render: (
          <View style={[styles.pin, { borderColor: '#6EE7B7', backgroundColor: colors.surface }]}>
            <View style={[styles.pinDot, { backgroundColor: '#34D399' }]} />
          </View>
        ),
      },
      {
        id: 'dropoff',
        coordinate: toAddress.coordinates,
        zIndex: 2,
        render: (
          <View style={[styles.pin, { borderColor: '#FCA5A5', backgroundColor: colors.surface }]}>
            <View style={[styles.pinDot, { backgroundColor: '#F87171' }]} />
          </View>
        ),
      },
    ];

    if (driverCoordinate) {
      nextMarkers.push({
        id: 'driver',
        coordinate: driverCoordinate,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 3,
        render: (
          <View style={[styles.driverMarker, { backgroundColor: colors.surface, shadowColor: colors.shadowColor }]}>
            <Icon type="MaterialCommunityIcons" name="car-sports" size={18} color={colors.text} />
          </View>
        ),
      });
    }

    return nextMarkers;
  }, [colors.shadowColor, colors.surface, colors.text, driverCoordinate, fromAddress.coordinates, toAddress.coordinates]);

  const polylines = useMemo<MapPolyline[]>(
    () =>
      routeCoordinates.length >= 2
        ? [
            {
              id: 'route',
              coordinates: routeCoordinates,
              strokeColor: '#0F8EC7',
              strokeWidth: 4,
            },
          ]
        : [],
    [routeCoordinates],
  );

  const initialRegion = useMemo(() => {
    const coordinates = [fromAddress.coordinates, toAddress.coordinates];
    if (driverCoordinate) {
      coordinates.push(driverCoordinate);
    }

    const latitudeValues = coordinates.map((coordinate) => coordinate.latitude);
    const longitudeValues = coordinates.map((coordinate) => coordinate.longitude);
    const minLatitude = Math.min(...latitudeValues);
    const maxLatitude = Math.max(...latitudeValues);
    const minLongitude = Math.min(...longitudeValues);
    const maxLongitude = Math.max(...longitudeValues);

    return {
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta: Math.max(maxLatitude - minLatitude, 0.02) * 1.9,
      longitudeDelta: Math.max(maxLongitude - minLongitude, 0.02) * 1.9,
    };
  }, [driverCoordinate, fromAddress.coordinates, toAddress.coordinates]);

  return (
    <Map
      initialRegion={initialRegion}
      markers={markers}
      polylines={polylines}
      showsCompass={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      useGoogleProvider
    />
  );
}

export default memo(ActiveRideMapLayer);

const styles = StyleSheet.create({
  pin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  driverMarker: {
    width: 34,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
