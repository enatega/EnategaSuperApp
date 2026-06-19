import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useMemo, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { LatLng, Region } from 'react-native-maps';
import Map, { type MapMarker, type MapPolyline } from '../../../../../general/components/Map';
import { useTheme } from '../../../../../general/theme/theme';
import storeMarker from '../../../assets/images/store-marker.png';
import personMarker from '../../../assets/images/person-marker.png';

type Props = {
  variant?: 'card' | 'full';
  workerLocation?: LatLng | null;
  customerLocation?: LatLng | null;
  routePath?: LatLng[] | null;
};

const FALLBACK_REGION: Region = {
  latitude: 25.2048,
  longitude: 55.2708,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function TrackWorkerMapPreview({
  variant = 'card',
  workerLocation,
  customerLocation,
  routePath,
}: Props) {
  const { colors } = useTheme();
  const isFull = variant === 'full';
  const mapRef = useRef<React.ElementRef<typeof Map> | null>(null);

  const displayedRoute = useMemo(() => {
    if (
      routePath &&
      routePath.length > 1 &&
      isRouteAnchoredToEndpoints(routePath, workerLocation, customerLocation)
    ) {
      return routePath;
    }

    if (workerLocation && customerLocation) {
      return buildCurvedFallbackRoute(workerLocation, customerLocation);
    }

    return null;
  }, [customerLocation, routePath, workerLocation]);

  const region = useMemo<Region>(() => {
    const routeCoordinates = displayedRoute && displayedRoute.length > 1 ? displayedRoute : null;

    if (routeCoordinates) {
      const latitudes = routeCoordinates.map((point) => point.latitude);
      const longitudes = routeCoordinates.map((point) => point.longitude);
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      const latitudeSpan = Math.max(maxLat - minLat, 0.004);
      const longitudeSpan = Math.max(maxLng - minLng, 0.004);

      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(latitudeSpan * (isFull ? 1.18 : 1.08), isFull ? 0.012 : 0.008),
        longitudeDelta: Math.max(longitudeSpan * (isFull ? 1.18 : 1.08), isFull ? 0.012 : 0.008),
      };
    }

    if (workerLocation && customerLocation) {
      const latitude = (workerLocation.latitude + customerLocation.latitude) / 2;
      const longitude = (workerLocation.longitude + customerLocation.longitude) / 2;
      const latitudeDelta = Math.max(
        Math.abs(workerLocation.latitude - customerLocation.latitude) * (isFull ? 1.18 : 1.08),
        isFull ? 0.012 : 0.008,
      );
      const longitudeDelta = Math.max(
        Math.abs(workerLocation.longitude - customerLocation.longitude) * (isFull ? 1.18 : 1.08),
        isFull ? 0.012 : 0.008,
      );

      return {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      };
    }

    if (workerLocation) {
      return {
        latitude: workerLocation.latitude,
        longitude: workerLocation.longitude,
        latitudeDelta: isFull ? 0.012 : 0.008,
        longitudeDelta: isFull ? 0.012 : 0.008,
      };
    }

    if (customerLocation) {
      return {
        latitude: customerLocation.latitude,
        longitude: customerLocation.longitude,
        latitudeDelta: isFull ? 0.012 : 0.008,
        longitudeDelta: isFull ? 0.012 : 0.008,
      };
    }

    return FALLBACK_REGION;
  }, [customerLocation, displayedRoute, isFull, workerLocation]);

  const markers = useMemo<MapMarker[]>(() => {
    const next: MapMarker[] = [];

    if (workerLocation) {
      next.push({
        id: 'worker-location',
        coordinate: workerLocation,
        anchor: { x: 0.5, y: 1 },
        zIndex: 3,
        render: <Image source={personMarker} style={styles.markerImage} />,
      });
    }

    if (customerLocation) {
      next.push({
        id: 'customer-location',
        coordinate: customerLocation,
        anchor: { x: 0.5, y: 1 },
        zIndex: 2,
        render: <Image source={storeMarker} style={styles.markerImage} />,
      });
    }

    return next;
  }, [customerLocation, workerLocation]);

  const polylines = useMemo<MapPolyline[]>(() => {
    if (displayedRoute) {
      return [
        {
          id: 'route-path',
          coordinates: displayedRoute,
          strokeColor: colors.warning,
          strokeWidth: 4,
          zIndex: 1,
        },
      ];
    }
    return [];
  }, [colors.warning, displayedRoute]);

  useEffect(() => {
    const coordinates = displayedRoute;

    if (!coordinates || coordinates.length < 2) {
      return undefined;
    }

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: isFull ? 120 : 40,
          right: isFull ? 80 : 24,
          bottom: isFull ? 320 : 24,
          left: isFull ? 80 : 24,
        },
        animated: true,
      });
    }, 80);

    return () => clearTimeout(timer);
  }, [displayedRoute, isFull]);

  return (
    <View
      style={[
        styles.mapArea,
        isFull ? styles.fullMap : styles.cardMap,
        { backgroundColor: colors.backgroundTertiary },
      ]}
    >
      <Map
        ref={mapRef}
        initialRegion={region}
        markers={markers}
        polylines={polylines}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        useGoogleProvider
        zoomEnabled
      />
      <View style={[styles.locateButton, { backgroundColor: colors.surface }]}>
        <MaterialCommunityIcons color={colors.text} name="crosshairs-gps" size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardMap: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 260,
    marginTop: 10,
  },
  fullMap: {
    borderRadius: 0,
    height: '100%',
    marginTop: 0,
  },
  locateButton: {
    alignItems: 'center',
    borderRadius: 20,
    bottom: 108,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    width: 40,
  },
  mapArea: {
    overflow: 'hidden',
    position: 'relative',
  },
  markerImage: {
    height: 42,
    resizeMode: 'contain',
    width: 42,
  },
});

function buildCurvedFallbackRoute(workerLocation: LatLng, customerLocation: LatLng): LatLng[] {
  const deltaLat = customerLocation.latitude - workerLocation.latitude;
  const deltaLng = customerLocation.longitude - workerLocation.longitude;
  const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
  const bendStrength = Math.min(0.004, Math.max(distance * 0.18, 0.0012));
  const bendDirection = deltaLng >= 0 ? 1 : -1;
  const curveLat = deltaLng * 0.08 * bendDirection;
  const curveLng = deltaLat * -0.08 * bendDirection;
  const midLat = workerLocation.latitude + deltaLat * 0.5;
  const midLng = workerLocation.longitude + deltaLng * 0.5;

  return [
    workerLocation,
    {
      latitude: workerLocation.latitude + deltaLat * 0.18 + curveLat,
      longitude: workerLocation.longitude + deltaLng * 0.18 + curveLng,
    },
    {
      latitude: midLat + bendStrength + curveLat,
      longitude: midLng - bendStrength + curveLng,
    },
    {
      latitude: midLat - bendStrength * 0.6 + curveLat,
      longitude: midLng + bendStrength * 0.75 + curveLng,
    },
    {
      latitude: workerLocation.latitude + deltaLat * 0.82 - curveLat * 0.3,
      longitude: workerLocation.longitude + deltaLng * 0.82 - curveLng * 0.3,
    },
    customerLocation,
  ];
}

function isRouteAnchoredToEndpoints(
  routePath: LatLng[],
  workerLocation: LatLng | null | undefined,
  customerLocation: LatLng | null | undefined,
) {
  if (!workerLocation || !customerLocation || routePath.length < 2) {
    return false;
  }

  const startPoint = routePath[0];
  const endPoint = routePath[routePath.length - 1];

  return (
    distanceBetween(startPoint, workerLocation) <= 0.0015 &&
    distanceBetween(endPoint, customerLocation) <= 0.0015
  );
}

function distanceBetween(a: LatLng, b: LatLng) {
  const deltaLat = a.latitude - b.latitude;
  const deltaLng = a.longitude - b.longitude;
  return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
}
