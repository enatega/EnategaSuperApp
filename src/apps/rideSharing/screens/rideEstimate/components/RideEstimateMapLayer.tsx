import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../../general/theme/theme';
import Map, {
  MapMarker,
  MapPolyline,
} from '../../../../../general/components/Map';
import Icon from '../../../../../general/components/Icon';
import type { RideAddressSelection } from '../../../api/types';

type Props = {
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  routeCoordinates: LatLng[];
  onBackPress: () => void;
};

function RideEstimateMapLayer({
  fromAddress,
  toAddress,
  routeCoordinates,
  onBackPress,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

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
    <>
      <Map
        initialRegion={initialRegion}
        markers={markers}
        polylines={polylines}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        useGoogleProvider
      />

      <View style={[styles.backButtonWrap, { top: insets.top + 124 }]}>
        <Pressable
          onPress={onBackPress}
          style={[
            styles.backButton,
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
    </>
  );
}

export default memo(RideEstimateMapLayer);

const styles = StyleSheet.create({
  backButtonWrap: {
    position: 'absolute',
    left: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
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
