import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import Image from '../../../../../general/components/Image';
import Icon from '../../../../../general/components/Icon';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import { formatRideEstimate } from '../../../utils/rideFormatting';

type Props = {
  item: RideOptionItem;
  fare?: number;
  isActive?: boolean;
  onPress: (id: RideOptionItem['id']) => void;
};

function RideEstimateOptionRow({ item, fare, isActive = false, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={[
        styles.row,
        isActive ? { backgroundColor: colors.blue50 } : null,
      ]}
    >
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <View style={styles.meta}>
        <Text weight="medium">{item.title}</Text>
        {item.seats ? (
          <View style={styles.seatsRow}>
            <Icon type="Feather" name="user" size={14} color={colors.mutedText} />
            <Text style={{ color: colors.mutedText }}>{item.seats}</Text>
          </View>
        ) : null}
      </View>
      <Text weight="medium">{formatRideEstimate(fare)}</Text>
    </Pressable>
  );
}

export default memo(RideEstimateOptionRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 48,
    height: 20,
    resizeMode: 'contain',
  },
  meta: {
    flex: 1,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
