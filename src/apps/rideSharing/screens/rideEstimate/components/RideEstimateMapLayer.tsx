import React, { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, LatLng } from 'react-native-maps';
import { useTheme } from '../../../../../general/theme/theme';
import Map, {
  MapMarker,
  MapPolyline,
} from '../../../../../general/components/Map';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  routeCoordinates: LatLng[];
  searchRadiusKm?: number;
  isInteractionEnabled?: boolean;
};

function RideEstimateMapLayer({
  fromAddress,
  stopAddresses = [],
  toAddress,
  routeCoordinates,
  searchRadiusKm,
  isInteractionEnabled = true,
}: Props) {
  const { colors } = useTheme();
  const mapRef = useRef<MapView | null>(null);

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
      ...stopAddresses.map((stopAddress, index) => ({
        id: stopAddress.placeId,
        coordinate: stopAddress.coordinates,
        render: (
          <View style={[styles.stopPin, { borderColor: '#FBBF24', backgroundColor: colors.surface }]}>
            <View style={[styles.stopPinDot, { backgroundColor: '#F59E0B' }]} />
          </View>
        ),
        title: `Stop ${index + 1}`,
        description: stopAddress.description,
      })),
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
    [colors.surface, fromAddress.coordinates, stopAddresses, toAddress.coordinates],
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
    const tripPoints = [fromAddress, ...stopAddresses, toAddress];
    const latitudeValues = tripPoints.map((point) => point.coordinates.latitude);
    const longitudeValues = tripPoints.map((point) => point.coordinates.longitude);
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
  }, [fromAddress, stopAddresses, toAddress]);

  const region = useMemo(() => {
    if (!searchRadiusKm || searchRadiusKm <= 0) {
      return initialRegion;
    }

    const radiusDiameterKm = searchRadiusKm * 2;
    const radiusLatitudeDelta = (radiusDiameterKm / 111) * 1.3;
    const latitudeInRadians = (fromAddress.coordinates.latitude * Math.PI) / 180;
    const longitudeScale = Math.max(Math.cos(latitudeInRadians), 0.2);
    const radiusLongitudeDelta = (radiusLatitudeDelta / longitudeScale) * 1.3;

    return {
      ...initialRegion,
      latitudeDelta: Math.max(initialRegion.latitudeDelta, radiusLatitudeDelta),
      longitudeDelta: Math.max(initialRegion.longitudeDelta, radiusLongitudeDelta),
    };
  }, [fromAddress.coordinates.latitude, initialRegion, searchRadiusKm]);

  useEffect(() => {
    if (!searchRadiusKm || !mapRef.current) {
      return;
    }

    mapRef.current.animateToRegion(region, 250);
  }, [region, searchRadiusKm]);

  return (
    <Map
      ref={mapRef}
      initialRegion={region}
      markers={markers}
      polylines={polylines}
      scrollEnabled={isInteractionEnabled}
      zoomEnabled={isInteractionEnabled}
      rotateEnabled={isInteractionEnabled}
      pitchEnabled={isInteractionEnabled}
      showsCompass={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
      useGoogleProvider
    >
      {searchRadiusKm ? (
        <Circle
          center={fromAddress.coordinates}
          radius={searchRadiusKm * 1000}
          strokeWidth={2}
          strokeColor="rgba(15, 142, 199, 0.35)"
          fillColor="rgba(15, 142, 199, 0.10)"
        />
      ) : null}
    </Map>
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
  stopPin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopPinDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
