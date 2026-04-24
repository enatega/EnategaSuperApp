import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';
import Map, { type MapMarker, type MapPolyline } from '../../../../general/components/Map';

type Props = {
  userLatitude: number;
  userLongitude: number;
  serviceCenterLatitude?: number | null;
  serviceCenterLongitude?: number | null;
};

function ReviewMapHeroSection({
  serviceCenterLatitude,
  serviceCenterLongitude,
  userLatitude,
  userLongitude,
}: Props) {
  const resolvedServiceCenterLatitude = serviceCenterLatitude ?? userLatitude;
  const resolvedServiceCenterLongitude = serviceCenterLongitude ?? userLongitude;
  const centerLatitude = (userLatitude + resolvedServiceCenterLatitude) / 2;
  const centerLongitude = (userLongitude + resolvedServiceCenterLongitude) / 2;
  const latitudeDelta = Math.max(Math.abs(userLatitude - resolvedServiceCenterLatitude) * 2, 0.01);
  const longitudeDelta = Math.max(
    Math.abs(userLongitude - resolvedServiceCenterLongitude) * 2,
    0.01,
  );

  const region = useMemo<Region>(
    () => ({
      latitude: centerLatitude,
      longitude: centerLongitude,
      latitudeDelta,
      longitudeDelta,
    }),
    [centerLatitude, centerLongitude, latitudeDelta, longitudeDelta],
  );

  const markers = useMemo<MapMarker[]>(
    () => [
      {
        id: 'user-location',
        coordinate: { latitude: userLatitude, longitude: userLongitude },
      },
      {
        id: 'service-center-location',
        coordinate: {
          latitude: resolvedServiceCenterLatitude,
          longitude: resolvedServiceCenterLongitude,
        },
        opacity: 0.95,
      },
    ],
    [
      resolvedServiceCenterLatitude,
      resolvedServiceCenterLongitude,
      userLatitude,
      userLongitude,
    ],
  );

  const polylines = useMemo<MapPolyline[]>(
    () => [
      {
        id: 'route',
        coordinates: [
          {
            latitude: resolvedServiceCenterLatitude,
            longitude: resolvedServiceCenterLongitude,
          },
          { latitude: userLatitude, longitude: userLongitude },
        ],
        strokeColor: '#FC9401',
        strokeWidth: 3,
      },
    ],
    [
      resolvedServiceCenterLatitude,
      resolvedServiceCenterLongitude,
      userLatitude,
      userLongitude,
    ],
  );

  return (
    <View style={styles.container}>
      <Map
        region={region}
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
