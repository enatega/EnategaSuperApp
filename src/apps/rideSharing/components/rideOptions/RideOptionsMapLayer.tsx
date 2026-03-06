import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Map, { MapMarker } from '../../../../general/components/Map';

const mapMarkerIcon = 'https://www.figma.com/api/mcp/asset/ceda917e-cfee-4f0b-84bc-2fcb6e8865b5';
const pickupMarkerIcon = 'https://www.figma.com/api/mcp/asset/e71a825a-9a77-4f55-9458-a571fb6334e0';

const LOCATE_BUTTON_OFFSET = 300;
const INITIAL_REGION = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type Props = {
  onBackPress: () => void;
};

function RideOptionsMapLayer({ onBackPress }: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('rideSharing');

  const markers = useMemo<MapMarker[]>(
    () => [
      {
        id: 'dropoff',
        coordinate: { latitude: 24.8683, longitude: 67.0032 },
        active: true,
        tracksViewChanges: true,
        render: <Image source={{ uri: mapMarkerIcon }} style={styles.markerIcon} />,
      },
      {
        id: 'pickup',
        coordinate: { latitude: 24.8642, longitude: 66.9989 },
        active: true,
        tracksViewChanges: true,
        render: <Image source={{ uri: pickupMarkerIcon }} style={styles.pickupMarkerIcon} />,
      },
    ],
    []
  );

  return (
    <>
      <Map
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={false}
        toolbarEnabled={false}
        markers={markers}
        
      />

      <View style={[styles.header, { top: insets.top + 8 }]}>
        <Pressable
          style={[
            styles.headerButton,
            { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
          ]}
          onPress={onBackPress}
        >
          <Icon type="Feather" name="menu" size={20} color={colors.text} />
        </Pressable>
      </View>

     
     
    </>
  );
}

export default memo(RideOptionsMapLayer);

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pickupBubble: {
    position: 'absolute',
    top: 160,
    left: 130,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pickupText: {
    gap: 2,
  },
  markerIcon: {
    width: 20,
    height: 20,
  },
  pickupMarkerIcon: {
    width: 36,
    height: 46,
  },
  locateButton: {
    position: 'absolute',
    right: 16,
    bottom: LOCATE_BUTTON_OFFSET,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
