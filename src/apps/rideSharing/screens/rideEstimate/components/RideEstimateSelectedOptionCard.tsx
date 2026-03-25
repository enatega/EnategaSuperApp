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
  onIncreaseFare?: () => void;
  onDecreaseFare?: () => void;
  isDecreaseDisabled?: boolean;
};

function RideEstimateSelectedOptionCard({
  item,
  fare,
  recommendedFare,
  onEditPress,
  onIncreaseFare,
  onDecreaseFare,
  isDecreaseDisabled = false,
}: Props) {
  const { colors } = useTheme();
  const iconSource = item.icon ? { uri: item.icon } : undefined;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSoft,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: '#D3F2FA',
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.infoBlock}>
            <View style={styles.iconWrap}>
              {iconSource ? <Image source={iconSource} style={styles.icon} /> : null}
            </View>
            <View style={styles.metaRow}>
              <Text weight="medium" style={styles.primaryMetaText}>
                {item.title}
              </Text>
              {item.seats ? (
                <View style={styles.seatsRow}>
                  <Icon type="Feather" name="user" size={16} color="#1677A4" />
                  <Text weight="medium" style={styles.primaryMetaText}>
                    {item.seats}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Pressable onPress={onEditPress} hitSlop={8} style={styles.editButton}>
            <Icon type="Feather" name="edit-2" size={16} color="#1677A4" />
          </Pressable>
        </View>
      </View>

      <View style={styles.fareRow}>
        <Pressable
          onPress={onDecreaseFare}
          disabled={isDecreaseDisabled}
          style={[
            styles.circleButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              shadowColor: colors.shadowColor,
              opacity: isDecreaseDisabled ? 0.5 : 1,
            },
          ]}
        >
          <Icon type="Feather" name="minus" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.fareMeta}>
          <Text
            weight="extraBold"
            style={[
              styles.fareValue,
              {
                color: '#1677A4',
              },
            ]}
          >
            {formatRideCurrency(fare)}
          </Text>
          <Text weight="medium" style={styles.recommendedFare}>
            {`recommended fare: ${formatRideCurrency(recommendedFare)}`}
          </Text>
        </View>
        <Pressable
          onPress={onIncreaseFare}
          style={[
            styles.circleButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Icon type="Feather" name="plus" size={20} color={colors.text} />
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
    padding: 4,
    gap: 10,
  },
  headerCard: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  infoBlock: {
    gap: 8,
  },
  iconWrap: {
    height: 32,
    justifyContent: 'center',
  },
  icon: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryMetaText: {
    color: '#1677A4',
    fontSize: 14,
    lineHeight: 22,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  fareMeta: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  fareValue: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.48,
  },
  recommendedFare: {
    color: '#71717A',
    fontSize: 10,
    lineHeight: 14,
    marginTop: -2,
  },
});
