import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import { formatRideCurrency } from '../../../utils/rideFormatting';

type Props = {
  item: RideOptionItem;
  fare?: number;
  recommendedFare?: number;
  onEditPress?: () => void;
};

function RideEstimateSelectedOptionCard({
  item,
  fare,
  recommendedFare,
  onEditPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#D7F0FA',
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Image source={{ uri: item.icon }} style={styles.icon} />
          <View style={styles.metaRow}>
            <Text weight="medium" style={{ color: '#1677A4' }}>
              {item.title}
            </Text>
            {item.seats ? (
              <View style={styles.seatsRow}>
                <Icon type="Feather" name="user" size={14} color="#1677A4" />
                <Text weight="medium" style={{ color: '#1677A4' }}>
                  {item.seats}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <Pressable onPress={onEditPress}>
          <Icon type="Feather" name="edit-2" size={16} color="#1677A4" />
        </Pressable>
      </View>

      <View style={styles.fareRow}>
        <Pressable style={[styles.circleButton, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Icon type="Feather" name="minus" size={16} color={colors.text} />
        </Pressable>
        <View style={styles.fareMeta}>
          <Text weight="extraBold" style={styles.fareValue}>
            {formatRideCurrency(fare)}
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: 11 }}>
            {`recommended fare: ${formatRideCurrency(recommendedFare)}`}
          </Text>
        </View>
        <Pressable style={[styles.circleButton, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Icon type="Feather" name="plus" size={16} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

export default memo(RideEstimateSelectedOptionCard);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    gap: 10,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: 88,
    height: 28,
    resizeMode: 'contain',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fareMeta: {
    alignItems: 'center',
  },
  fareValue: {
    fontSize: 24,
    color: '#1677A4',
  },
});
