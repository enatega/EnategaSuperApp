import React, { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { type LatLng } from 'react-native-maps';
import { useQueries, useQuery } from '@tanstack/react-query';
import Map, { type MapMarker, type MapPolyline } from '../../../../../general/components/Map';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import { useTheme } from '../../../../../general/theme/theme';
import type { RideAddressSelection } from '../../../api/types';
import { rideKeys } from '../../../api/queryKeys';
import { rideService } from '../../../api/rideService';

type Props = {
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  statusCode?: string;
  driverCoordinate?: LatLng;
  driverHeading?: number;
};

function isRideInProgress(statusCode?: string) {
  return statusCode === 'IN_PROGRESS' || statusCode === 'DRIVER_REACHED';
}

function toRouteKeyValue(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'unknown';
  }

  return value.toFixed(4);
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
  const targetAddress = isRideInProgress(statusCode) ? toAddress : fromAddress;
  const driverRouteQuery = useQuery({
    queryKey: [
      ...rideKeys.route(
        `driver:${toRouteKeyValue(driverCoordinate?.latitude)}:${toRouteKeyValue(driverCoordinate?.longitude)}`,
        targetAddress.placeId,
      ),
      statusCode ?? 'unknown',
    ],
    enabled: Boolean(driverCoordinate),
    staleTime: 5 * 1000,
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
          <View style={[styles.stopPin, { borderColor: '#FBBF24', backgroundColor: colors.surface }]}>
            <Icon type="MaterialCommunityIcons" name="map-marker" size={12} color="#D97706" />
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

    if (driverCoordinate) {
      nextMarkers.push({
        id: 'driver',
        coordinate: driverCoordinate,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 3,
        rotation: driverHeading,
        render: (
          <View style={[styles.driverMarker, {  shadowColor: colors.shadowColor }]}>
            <Image
              source={require('../../../assets/images/car.png')}
              style={styles.driverMarkerImage}
              resizeMode="contain"
            />
          </View>
        ),
      });
    }

    return nextMarkers;
  }, [colors.shadowColor, colors.surface, colors.text, driverCoordinate, driverHeading, fromAddress.coordinates, stopAddresses, toAddress.coordinates]);

  const driverApproachPolyline = useMemo<MapPolyline | null>(() => {
    if (!driverCoordinate) {
      return null;
    }

    const routedCoordinates =
      (driverRouteQuery.data?.length ?? 0) >= 2
        ? driverRouteQuery.data!
        : [driverCoordinate, targetAddress.coordinates];

    return {
      id: 'driver-progress',
      coordinates: routedCoordinates,
      strokeColor: isRideInProgress(statusCode) ? '#16A34A' : '#22C55E',
      strokeWidth: 4,
      zIndex: 3,
    };
  }, [driverCoordinate, driverRouteQuery.data, statusCode, targetAddress.coordinates]);

  const tripPolyline = useMemo<MapPolyline | null>(() => {
    const segmentCoordinates = tripSegmentQueries
      .map((query) => query.data ?? [])
      .filter((coordinates) => coordinates.length > 0);

    if (!segmentCoordinates.length) {
      return null;
    }

    const mergedCoordinates = segmentCoordinates.flatMap((coordinates, index) => {
      if (index === 0) {
        return coordinates;
      }

      return coordinates.slice(1);
    });

    if (mergedCoordinates.length < 2) {
      return null;
    }

    return {
      id: 'trip-route',
      coordinates: mergedCoordinates,
      strokeColor: '#0F8EC7',
      strokeWidth: 5,
      zIndex: 1,
    };
  }, [tripSegmentQueries]);

  const polylines = useMemo<MapPolyline[]>(
    () => [tripPolyline, driverApproachPolyline].filter(Boolean) as MapPolyline[],
    [driverApproachPolyline, tripPolyline],
  );

  const initialRegion = useMemo(() => {
    const coordinates = orderedTripPoints.map((point) => point.coordinates);
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
  }, [driverCoordinate, orderedTripPoints]);

  useEffect(() => {
    const coordinates = orderedTripPoints.map((point) => point.coordinates);
    if (driverCoordinate) {
      coordinates.push(driverCoordinate);
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
  }, [driverCoordinate, orderedTripPoints, statusCode]);

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
