import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';

const mapImage = 'https://www.figma.com/api/mcp/asset/ab9e442d-958a-4c29-971c-78fa74c7c7ec';
const mapMarkerIcon = 'https://www.figma.com/api/mcp/asset/ceda917e-cfee-4f0b-84bc-2fcb6e8865b5';
const pickupMarkerIcon = 'https://www.figma.com/api/mcp/asset/e71a825a-9a77-4f55-9458-a571fb6334e0';

const LOCATE_BUTTON_OFFSET = 300;

type Props = {
  onBackPress: () => void;
};

function RideOptionsMapLayer({ onBackPress }: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('rideSharing');

  return (
    <>
      <Image source={{ uri: mapImage }} style={styles.mapImage} resizeMode="cover" />

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

      <View
        style={[
          styles.pickupBubble,
          { shadowColor: colors.shadowColor, backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.pickupText}>
          <Text weight="medium" style={{ color: colors.mutedText, fontSize: typography.size.xxs }}>
            {t('ride_pickup_point_label')}
          </Text>
          <Text weight="semiBold" style={{ color: colors.text, fontSize: typography.size.xs2 }}>
            {t('ride_pickup_point_value')}
          </Text>
        </View>
        <Icon type="Feather" name="chevron-right" size={16} color={colors.mutedText} />
      </View>

      <View style={styles.markerWrap}>
        <Image source={{ uri: mapMarkerIcon }} style={styles.markerIcon} />
      </View>

      <View style={styles.pickupMarkerWrap}>
        <Image source={{ uri: pickupMarkerIcon }} style={styles.pickupMarkerIcon} />
      </View>

      <Pressable
        style={[
          styles.locateButton,
          { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
        ]}
      >
        <Icon type="Feather" name="crosshair" size={18} color={colors.text} />
      </Pressable>
    </>
  );
}

export default memo(RideOptionsMapLayer);

const styles = StyleSheet.create({
  mapImage: {
    ...StyleSheet.absoluteFillObject,
  },
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
  markerWrap: {
    position: 'absolute',
    left: '45%',
    top: 290,
  },
  markerIcon: {
    width: 20,
    height: 20,
  },
  pickupMarkerWrap: {
    position: 'absolute',
    left: '48%',
    top: 245,
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
