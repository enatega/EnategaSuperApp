import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useTheme } from '../../../../../general/theme/theme';
import Map, {
  MapMarker,
  MapPolyline,
} from '../../../../../general/components/Map';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  routeCoordinates: LatLng[];
};

function RideEstimateMapLayer({
  fromAddress,
  toAddress,
  routeCoordinates,
}: Props) {
  const { colors } = useTheme();

  const markers = useMemo<MapMarker[]>(
    () => [
      {
        id: 'pickup',
        coordinate: fromAddress.coordinates,
        render: (
          <View style={[styles.pin, { borderColor: '#10B981', backgroundColor: colors.surface }]}>
            <View style={[styles.pinDot, { backgroundColor: '#10B981' }]} />
          </View>
        ),
      },
      {
        id: 'dropoff',
        coordinate: toAddress.coordinates,
        render: (
          <View style={[styles.pin, { borderColor: '#F87171', backgroundColor: colors.surface }]}>
            <View style={[styles.pinDot, { backgroundColor: '#F87171' }]} />
          </View>
        ),
      },
    ],
    [colors.surface, fromAddress.coordinates, toAddress.coordinates],
  );

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
    const latitudeValues = [fromAddress.coordinates.latitude, toAddress.coordinates.latitude];
    const longitudeValues = [fromAddress.coordinates.longitude, toAddress.coordinates.longitude];
    const minLatitude = Math.min(...latitudeValues);
    const maxLatitude = Math.max(...latitudeValues);
    const minLongitude = Math.min(...longitudeValues);
    const maxLongitude = Math.max(...longitudeValues);

    return {
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
      latitudeDelta: Math.max(maxLatitude - minLatitude, 0.02) * 1.8,
      longitudeDelta: Math.max(maxLongitude - minLongitude, 0.02) * 1.8,
    };
  }, [fromAddress.coordinates, toAddress.coordinates]);

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

export default memo(RideEstimateMapLayer);

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
});
