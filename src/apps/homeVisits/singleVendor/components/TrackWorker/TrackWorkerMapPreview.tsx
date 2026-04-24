import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LatLng, Region } from 'react-native-maps';
import Map, { type MapMarker, type MapPolyline } from '../../../../../general/components/Map';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  variant?: 'card' | 'full';
  workerLocation?: LatLng | null;
  customerLocation?: LatLng | null;
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
}: Props) {
  const { colors } = useTheme();
  const isFull = variant === 'full';

  const region = useMemo<Region>(() => {
    if (workerLocation && customerLocation) {
      const latitude = (workerLocation.latitude + customerLocation.latitude) / 2;
      const longitude = (workerLocation.longitude + customerLocation.longitude) / 2;
      const latitudeDelta = Math.max(
        Math.abs(workerLocation.latitude - customerLocation.latitude) * 1.8,
        isFull ? 0.035 : 0.02,
      );
      const longitudeDelta = Math.max(
        Math.abs(workerLocation.longitude - customerLocation.longitude) * 1.8,
        isFull ? 0.035 : 0.02,
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
        latitudeDelta: isFull ? 0.02 : 0.012,
        longitudeDelta: isFull ? 0.02 : 0.012,
      };
    }

    if (customerLocation) {
      return {
        latitude: customerLocation.latitude,
        longitude: customerLocation.longitude,
        latitudeDelta: isFull ? 0.02 : 0.012,
        longitudeDelta: isFull ? 0.02 : 0.012,
      };
    }

    return FALLBACK_REGION;
  }, [customerLocation, isFull, workerLocation]);

  const markers = useMemo<MapMarker[]>(() => {
    const next: MapMarker[] = [];

    if (workerLocation) {
      next.push({
        id: 'worker-location',
        coordinate: workerLocation,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 3,
        render: (
          <View style={[styles.workerMarkerWrap, { backgroundColor: colors.surface }]}>
            <MaterialCommunityIcons color={colors.text} name="car" size={14} />
          </View>
        ),
      });
    }

    if (customerLocation) {
      next.push({
        id: 'customer-location',
        coordinate: customerLocation,
        anchor: { x: 0.5, y: 0.8 },
        zIndex: 2,
        render: (
          <View style={styles.markerStack}>
            <View style={[styles.markerMain, { backgroundColor: '#DBEAFE' }]}>
              <MaterialCommunityIcons color={colors.primary} name="map-marker" size={20} />
            </View>
            <View style={[styles.markerSmall, { backgroundColor: '#DBEAFE' }]}>
              <MaterialCommunityIcons color={colors.primary} name="account" size={11} />
            </View>
          </View>
        ),
      });
    }

    return next;
  }, [colors.primary, colors.surface, colors.text, customerLocation, workerLocation]);

  const polylines = useMemo<MapPolyline[]>(() => {
    if (!workerLocation || !customerLocation) {
      return [];
    }

    return [
      {
        id: 'route-path',
        coordinates: [
          workerLocation,
          {
            latitude: (workerLocation.latitude * 0.7) + (customerLocation.latitude * 0.3),
            longitude: (workerLocation.longitude * 0.7) + (customerLocation.longitude * 0.3),
          },
          {
            latitude: (workerLocation.latitude * 0.35) + (customerLocation.latitude * 0.65),
            longitude: (workerLocation.longitude * 0.35) + (customerLocation.longitude * 0.65),
          },
          customerLocation,
        ],
        strokeColor: colors.warning,
        strokeWidth: 4,
        zIndex: 1,
      },
    ];
  }, [colors.warning, customerLocation, workerLocation]);

  return (
    <View
      style={[
        styles.mapArea,
        isFull ? styles.fullMap : styles.cardMap,
        { backgroundColor: colors.backgroundTertiary },
      ]}
    >
      <Map
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
  markerMain: {
    alignItems: 'center',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  markerSmall: {
    alignItems: 'center',
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    marginTop: -6,
    width: 22,
  },
  markerStack: {
    alignItems: 'center',
  },
  workerMarkerWrap: {
    alignItems: 'center',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 30,
  },
});
