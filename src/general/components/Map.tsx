import React, { forwardRef, memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  LatLng,
  Marker,
  MapMarkerProps,
  Polyline,
  MapPolylineProps,
  MapViewProps,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const HIDDEN_COORDINATE: LatLng = { latitude: 0, longitude: 0 };

export type MapMarker = {
  id: string;
  coordinate: LatLng;
  active?: boolean;
  opacity?: number;
  image?: MapMarkerProps['image'];
  icon?: MapMarkerProps['icon'];
  title?: string;
  description?: string;
  anchor?: MapMarkerProps['anchor'];
  zIndex?: number;
  rotation?: number;
  draggable?: boolean;
  tappable?: boolean;
  onPress?: MapMarkerProps['onPress'];
  tracksViewChanges?: boolean;
  render?: React.ReactNode;
  keyOverride?: string | number;
};

export type MapPolyline = {
  id: string;
  coordinates: LatLng[];
  strokeWidth?: number;
  strokeColor?: string;
  geodesic?: boolean;
  lineDashPattern?: number[];
  lineCap?: MapPolylineProps['lineCap'];
  lineJoin?: MapPolylineProps['lineJoin'];
  miterLimit?: number;
  tappable?: boolean;
  onPress?: MapPolylineProps['onPress'];
  zIndex?: number;
};

type Props = Omit<MapViewProps, 'children'> & {
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  useGoogleProvider?: boolean;
  children?: React.ReactNode;
};

function MapMarkerItem({ marker }: { marker: MapMarker }) {
  const isActive = marker.active !== false;
  const coordinate = isActive ? marker.coordinate : HIDDEN_COORDINATE;
  const opacity = isActive ? marker.opacity ?? 1 : 0;
  const tappable = isActive ? marker.tappable : false;
  const tracksViewChanges = marker.tracksViewChanges ?? Boolean(marker.render);

  return (
    <Marker
      coordinate={coordinate}
      opacity={opacity}
      title={marker.title}
      description={marker.description}
      anchor={marker.anchor}
      zIndex={marker.zIndex}
      rotation={marker.rotation}
      draggable={marker.draggable}
      tappable={tappable}
      onPress={marker.onPress}
      tracksViewChanges={tracksViewChanges}
      image={marker.render ? undefined : marker.image}
      icon={marker.render ? undefined : marker.icon}
    >
      {marker.render}
    </Marker>
  );
}

const MemoizedMarker = memo(MapMarkerItem, (prev, next) => {
  const a = prev.marker;
  const b = next.marker;
  if (a === b) return true;
  if (a.id !== b.id) return false;
  if ((a.active ?? true) !== (b.active ?? true)) return false;
  if ((a.opacity ?? 1) !== (b.opacity ?? 1)) return false;
  if (a.coordinate.latitude !== b.coordinate.latitude) return false;
  if (a.coordinate.longitude !== b.coordinate.longitude) return false;
  if (a.title !== b.title) return false;
  if (a.description !== b.description) return false;
  if (a.anchor !== b.anchor) return false;
  if (a.zIndex !== b.zIndex) return false;
  if (a.rotation !== b.rotation) return false;
  if (a.draggable !== b.draggable) return false;
  if (a.tappable !== b.tappable) return false;
  if (a.onPress !== b.onPress) return false;
  if (a.tracksViewChanges !== b.tracksViewChanges) return false;
  if (a.image !== b.image) return false;
  if (a.icon !== b.icon) return false;
  if (a.render !== b.render) return false;
  if (a.keyOverride !== b.keyOverride) return false;
  return true;
});

function MapPolylineItem({ polyline }: { polyline: MapPolyline }) {
  return (
    <Polyline
      coordinates={polyline.coordinates}
      strokeWidth={polyline.strokeWidth}
      strokeColor={polyline.strokeColor}
      geodesic={polyline.geodesic}
      lineDashPattern={polyline.lineDashPattern}
      lineCap={polyline.lineCap}
      lineJoin={polyline.lineJoin}
      miterLimit={polyline.miterLimit}
      tappable={polyline.tappable}
      onPress={polyline.onPress}
      zIndex={polyline.zIndex}
    />
  );
}

const MemoizedPolyline = memo(MapPolylineItem, (prev, next) => {
  const a = prev.polyline;
  const b = next.polyline;
  if (a === b) return true;
  if (a.id !== b.id) return false;
  if (a.coordinates.length !== b.coordinates.length) return false;
  for (let i = 0; i < a.coordinates.length; i += 1) {
    if (a.coordinates[i].latitude !== b.coordinates[i].latitude) return false;
    if (a.coordinates[i].longitude !== b.coordinates[i].longitude) return false;
  }
  if (a.strokeWidth !== b.strokeWidth) return false;
  if (a.strokeColor !== b.strokeColor) return false;
  if (a.geodesic !== b.geodesic) return false;
  if (a.lineDashPattern !== b.lineDashPattern) return false;
  if (a.lineCap !== b.lineCap) return false;
  if (a.lineJoin !== b.lineJoin) return false;
  if (a.miterLimit !== b.miterLimit) return false;
  if (a.tappable !== b.tappable) return false;
  if (a.onPress !== b.onPress) return false;
  if (a.zIndex !== b.zIndex) return false;
  return true;
});

const Map = forwardRef<MapView, Props>(function Map(
  { markers, polylines, useGoogleProvider, children, style, provider, ...props },
  ref,
) {
  const resolvedProvider = provider ?? (useGoogleProvider ? PROVIDER_GOOGLE : undefined);
  const sortedPolylines = useMemo(
    () => [...(polylines ?? [])].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
    [polylines],
  );

  return (
    <MapView ref={ref} style={[styles.map, style]} provider={resolvedProvider} {...props}>
      {markers?.map((marker) => (
        <MemoizedMarker key={marker.keyOverride ?? marker.id} marker={marker} />
      ))}
      {sortedPolylines.map((polyline) => (
        <MemoizedPolyline key={polyline.id} polyline={polyline} />
      ))}
      {children}
    </MapView>
  );
});

export default memo(Map);

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
