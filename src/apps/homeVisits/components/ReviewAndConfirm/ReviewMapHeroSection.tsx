import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';
import Map, { type MapMarker, type MapPolyline } from '../../../../general/components/Map';

type Props = {
  latitude: number;
  longitude: number;
};

function ReviewMapHeroSection({ latitude, longitude }: Props) {
  const region = useMemo<Region>(
    () => ({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [latitude, longitude],
  );

  const markers = useMemo<MapMarker[]>(
    () => [
      {
        id: 'service-location',
        coordinate: { latitude, longitude },
      },
      {
        id: 'worker-location',
        coordinate: {
          latitude: latitude + 0.0015,
          longitude: longitude + 0.0018,
        },
        opacity: 0.8,
      },
    ],
    [latitude, longitude],
  );

  const polylines = useMemo<MapPolyline[]>(
    () => [
      {
        id: 'route',
        coordinates: [
          { latitude: latitude + 0.0015, longitude: longitude + 0.0018 },
          { latitude: latitude + 0.0007, longitude: longitude + 0.0008 },
          { latitude, longitude },
        ],
        strokeColor: '#FC9401',
        strokeWidth: 3,
      },
    ],
    [latitude, longitude],
  );

  return (
    <View style={styles.container}>
      <Map
        initialRegion={region}
        markers={markers}
        polylines={polylines}
        rotateEnabled={false}
        scrollEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        zoomEnabled={false}
      />
    </View>
  );
}

export default memo(ReviewMapHeroSection);

const styles = StyleSheet.create({
  container: {
    height: 200,
    overflow: 'hidden',
    width: '100%',
  },
});
