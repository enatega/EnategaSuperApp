import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { type LatLng } from 'react-native-maps';
import { useQueries, useQuery } from '@tanstack/react-query';
import Map, { type MapMarker, type MapPolyline } from '../../../../../general/components/Map';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import { useTheme } from '../../../../../general/theme/theme';
import type { RideAddressSelection } from '../../../api/types';
import { rideKeys } from '../../../api/queryKeys';
import { rideService } from '../../../api/rideService';
import {
  getActiveRideDriverPolylineColor,
  getActiveRideTripSegmentColor,
  isRideInProgressStatus,
} from '../../../utils/activeRideMapper';

type Props = {
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  statusCode?: string;
  driverCoordinate?: LatLng;
  driverHeading?: number;
};

function getNearestCoordinateOnPath(point: LatLng, path: LatLng[]) {
  if (path.length === 0) {
    return point;
  }

  let nearestPoint = path[0];
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;

  for (const candidate of path) {
    const latitudeDiff = candidate.latitude - point.latitude;
    const longitudeDiff = candidate.longitude - point.longitude;
    const distanceSquared = (latitudeDiff * latitudeDiff) + (longitudeDiff * longitudeDiff);

    if (distanceSquared < nearestDistanceSquared) {
      nearestDistanceSquared = distanceSquared;
      nearestPoint = candidate;
    }
  }

  return nearestPoint;
}

function toSnappedRouteKeyValue(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'unknown';
  }

  // 3 decimal places ~= 111m. This prevents route refetch on every tiny GPS tick.
  return value.toFixed(3);
}

function normalizeHeading(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined;
  }

  const normalized = value % 360;
  return normalized >= 0 ? normalized : normalized + 360;
}

function ActiveRideMapLayer({
  fromAddress,
  stopAddresses = [],
  toAddress,
  statusCode,
  driverCoordinate,
  driverHeading,
}: Props) {
  const { colors } = useTheme();
  const mapRef = useRef<MapView | null>(null);
  const orderedTripPoints = useMemo(
    () => [fromAddress, ...stopAddresses, toAddress],
    [fromAddress, stopAddresses, toAddress],
  );
  const tripSegments = useMemo(
    () =>
      orderedTripPoints.slice(0, -1).map((point, index) => ({
        id: `${point.placeId}:${orderedTripPoints[index + 1]?.placeId ?? index}`,
        origin: point,
        destination: orderedTripPoints[index + 1],
      })),
    [orderedTripPoints],
  );
  const targetAddress = isRideInProgressStatus(statusCode) ? toAddress : fromAddress;
  const driverRouteQuery = useQuery({
    queryKey: [
      ...rideKeys.route(
        `driver:${toSnappedRouteKeyValue(driverCoordinate?.latitude)}:${toSnappedRouteKeyValue(driverCoordinate?.longitude)}`,
        targetAddress.placeId,
      ),
      statusCode ?? 'unknown',
    ],
    enabled: Boolean(driverCoordinate),
    staleTime: 20 * 1000,
    refetchOnWindowFocus: false,
    queryFn: () =>
      rideService.getRoutePath(
        {
          lat: driverCoordinate!.latitude,
          lng: driverCoordinate!.longitude,
        },
        {
          lat: targetAddress.coordinates.latitude,
          lng: targetAddress.coordinates.longitude,
        },
      ),
  });
  const tripSegmentQueries = useQueries({
    queries: tripSegments.map((segment) => ({
      queryKey: rideKeys.route(segment.origin.placeId, segment.destination.placeId),
      queryFn: () =>
        rideService.getRoutePath(
          {
            lat: segment.origin.coordinates.latitude,
            lng: segment.origin.coordinates.longitude,
          },
          {
            lat: segment.destination.coordinates.latitude,
            lng: segment.destination.coordinates.longitude,
          },
        ),
      staleTime: 5 * 60 * 1000,
    })),
  });
  const routedDriverPath = useMemo(
    () => ((driverRouteQuery.data?.length ?? 0) >= 2 ? driverRouteQuery.data! : []),
    [driverRouteQuery.data],
  );
  const normalizedDriverHeading = useMemo(
    () => normalizeHeading(driverHeading),
    [driverHeading],
  );
  const snappedDriverCoordinate = useMemo(() => {
    if (!driverCoordinate) {
      return undefined;
    }

    if (routedDriverPath.length < 2) {
      return driverCoordinate;
    }

    return getNearestCoordinateOnPath(driverCoordinate, routedDriverPath);
  }, [driverCoordinate, routedDriverPath]);

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
      ...stopAddresses.map((stopAddress, index) => ({
        id: stopAddress.placeId,
        coordinate: stopAddress.coordinates,
        zIndex: 2,
        render: (
          <View
            style={[
              styles.stopPin,
              {
                borderColor: getActiveRideTripSegmentColor(index),
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="map-marker"
              size={12}
              color={getActiveRideTripSegmentColor(index)}
            />
          </View>
        ),
        title: `Stop ${index + 1}`,
        description: stopAddress.description,
      })),
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

    if (snappedDriverCoordinate) {
      nextMarkers.push({
        id: 'driver',
        coordinate: snappedDriverCoordinate,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 3,
        rotation: normalizedDriverHeading,
        flat: true,
        ...(Platform.OS === 'android'
          ? {
              image: require('../../../assets/images/car.png'),
              tracksViewChanges: false,
            }
          : {
              render: (
                <View style={[styles.driverMarker, { shadowColor: colors.shadowColor }]}>
                  <Image
                    source={require('../../../assets/images/car.png')}
                    style={styles.driverMarkerImage}
                    resizeMode="contain"
                  />
                </View>
              ),
            }),
      });
    }

    return nextMarkers;
  }, [colors.shadowColor, colors.surface, colors.text, fromAddress.coordinates, normalizedDriverHeading, snappedDriverCoordinate, stopAddresses, toAddress.coordinates]);

  const driverApproachPolyline = useMemo<MapPolyline | null>(() => {
    if (!snappedDriverCoordinate) {
      return null;
    }

    const routedCoordinates = routedDriverPath.length >= 2
      // Force live start point so the green line keeps contracting with location updates.
      ? [snappedDriverCoordinate, ...routedDriverPath.slice(1)]
      : [snappedDriverCoordinate, targetAddress.coordinates];

    return {
      id: 'driver-progress',
      coordinates: routedCoordinates,
      strokeColor: getActiveRideDriverPolylineColor(statusCode),
      strokeWidth: 4,
      zIndex: 3,
    };
  }, [routedDriverPath, snappedDriverCoordinate, statusCode, targetAddress.coordinates]);

  const tripPolylines = useMemo<MapPolyline[]>(
    () =>
      tripSegmentQueries.flatMap((query, index) => {
        const coordinates = query.data ?? [];

        if (coordinates.length < 2) {
          return [];
        }

        return [{
          id: `trip-route:${tripSegments[index]?.id ?? index}`,
          coordinates,
          strokeColor: getActiveRideTripSegmentColor(index),
          strokeWidth: 5,
          zIndex: 1,
        }];
      }),
    [tripSegmentQueries, tripSegments],
  );

  const polylines = useMemo<MapPolyline[]>(
    () => [...tripPolylines, ...(driverApproachPolyline ? [driverApproachPolyline] : [])],
    [driverApproachPolyline, tripPolylines],
  );

  const initialRegion = useMemo(() => {
    const coordinates = orderedTripPoints.map((point) => point.coordinates);
    if (snappedDriverCoordinate) {
      coordinates.push(snappedDriverCoordinate);
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
  }, [orderedTripPoints, snappedDriverCoordinate]);

  useEffect(() => {
    const coordinates = orderedTripPoints.map((point) => point.coordinates);
    if (snappedDriverCoordinate) {
      coordinates.push(snappedDriverCoordinate);
    }

    if (coordinates.length < 2) {
      return;
    }

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 120,
        right: 60,
        bottom: 320,
        left: 60,
      },
      animated: true,
    });
  }, [orderedTripPoints, snappedDriverCoordinate, statusCode]);

  return (
    <Map
      ref={mapRef}
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
  stopPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  driverMarkerImage: {
    width: 30,
    height: 30,
  },
});
