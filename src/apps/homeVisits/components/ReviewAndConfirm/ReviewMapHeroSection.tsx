import React, { memo, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import Map, { type MapMarker, type MapPolyline } from '../../../../general/components/Map';
import { addressService } from '../../../../general/api/addressService';
import storeMarker from '../../assets/images/store-marker.png';
import personMarker from '../../assets/images/person-marker.png';

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

  const hasValidRouteCoordinates = Number.isFinite(userLatitude)
    && Number.isFinite(userLongitude)
    && Number.isFinite(resolvedServiceCenterLatitude)
    && Number.isFinite(resolvedServiceCenterLongitude);

  const routeQuery = useQuery({
    queryKey: [
      'homeVisitsReviewRoutePath',
      userLatitude.toFixed(5),
      userLongitude.toFixed(5),
      resolvedServiceCenterLatitude.toFixed(5),
      resolvedServiceCenterLongitude.toFixed(5),
    ],
    enabled: hasValidRouteCoordinates,
    staleTime: 15 * 1000,
    queryFn: () =>
      addressService.getRoutePath(
        { lat: resolvedServiceCenterLatitude, lng: resolvedServiceCenterLongitude },
        { lat: userLatitude, lng: userLongitude },
      ),
  });

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
        anchor: { x: 0.5, y: 1 },
        zIndex: 3,
        tracksViewChanges: false,
        render: <Image source={personMarker} style={styles.markerImage} />,
      },
      {
        id: 'service-center-location',
        coordinate: {
          latitude: resolvedServiceCenterLatitude,
          longitude: resolvedServiceCenterLongitude,
        },
        anchor: { x: 0.5, y: 1 },
        zIndex: 2,
        tracksViewChanges: false,
        render: <Image source={storeMarker} style={styles.markerImage} />,
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
        coordinates:
          routeQuery.data && routeQuery.data.length > 1
            ? routeQuery.data
            : [
                {
                  latitude: resolvedServiceCenterLatitude,
                  longitude: resolvedServiceCenterLongitude,
                },
                {
                  latitude:
                    (resolvedServiceCenterLatitude * 0.72) + (userLatitude * 0.28),
                  longitude:
                    (resolvedServiceCenterLongitude * 0.66) + (userLongitude * 0.34),
                },
                {
                  latitude:
                    (resolvedServiceCenterLatitude * 0.48) + (userLatitude * 0.52),
                  longitude:
                    (resolvedServiceCenterLongitude * 0.42) + (userLongitude * 0.58),
                },
                {
                  latitude:
                    (resolvedServiceCenterLatitude * 0.24) + (userLatitude * 0.76),
                  longitude:
                    (resolvedServiceCenterLongitude * 0.18) + (userLongitude * 0.82),
                },
                { latitude: userLatitude, longitude: userLongitude },
              ],
        strokeColor: '#FC9401',
        strokeWidth: 3,
      },
    ],
    [
      routeQuery.data,
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
        useGoogleProvider
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
  markerImage: {
    height: 34,
    resizeMode: 'contain',
    width: 34,
  },
});
