import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';
import Map, { type MapMarker } from '../../../../general/components/Map';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ReviewSectionCard from './ReviewSectionCard';

type Props = {
  title: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
};

function ReviewServiceLocationSection({
  address,
  label,
  latitude,
  longitude,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  const mapRegion = useMemo<Region>(
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
        coordinate: {
          latitude,
          longitude,
        },
      },
    ],
    [latitude, longitude],
  );

  return (
    <ReviewSectionCard>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>

      <View style={[styles.mapWrap, { borderColor: colors.border }]}>
        <Map
          initialRegion={mapRegion}
          markers={markers}
          rotateEnabled={false}
          scrollEnabled={false}
          showsCompass={false}
          showsMyLocationButton={false}
          zoomEnabled={false}
        />
      </View>

      <View style={styles.addressWrap}>
        <Text
          weight="medium"
          style={{
            color: colors.iconMuted,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {label}
        </Text>
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {address}
        </Text>
      </View>
    </ReviewSectionCard>
  );
}

export default memo(ReviewServiceLocationSection);

const styles = StyleSheet.create({
  addressWrap: {
    gap: 2,
  },
  mapWrap: {
    borderRadius: 12,
    borderWidth: 1,
    height: 172,
    overflow: 'hidden',
  },
});
