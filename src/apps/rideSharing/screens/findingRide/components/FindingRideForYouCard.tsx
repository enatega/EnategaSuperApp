import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import type { RideForYouRestaurant } from '../types/forYou';

type Props = {
  item: RideForYouRestaurant;
  onPress?: () => void;
};

function FindingRideForYouCard({ item, onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const imageUrl = item.coverImage ?? item.logo ?? 'https://placehold.co/420x220.png';
  const ratingLabel = typeof item.averageRating === 'number' ? item.averageRating.toFixed(1) : '0.0';
  const reviewsLabel = typeof item.reviewCount === 'number' ? `(${item.reviewCount.toLocaleString()}+)` : '(0+)';
  const feeLabel = typeof item.baseFee === 'number' ? `$${item.baseFee}` : '$0';
  const timeLabel = item.deliveryTime ? `${item.deliveryTime} mins` : '30 mins';
  const distanceLabel = typeof item.distanceKm === 'number' ? `${item.distanceKm.toFixed(1)} km` : '1.0 km';

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.coverImage} />

      <View style={styles.content}>
        <Text weight="semiBold" style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.ratingRow}>
          <Icon type="MaterialCommunityIcons" name="star" size={14} color={colors.yellow500} />
          <Text style={[styles.meta, { color: colors.text }]}>{ratingLabel}</Text>
          <Text style={[styles.meta, { color: colors.mutedText }]}>{reviewsLabel}</Text>
          <Text style={[styles.meta, { color: colors.mutedText }]} numberOfLines={1}>
            {item.shopTypeName ?? t('ride_finding_for_you_cuisine_fallback')}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon type="Feather" name="truck" size={13} color={colors.mutedText} />
            <Text style={[styles.meta, { color: colors.mutedText }]}>{feeLabel}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon type="Feather" name="clock" size={13} color={colors.mutedText} />
            <Text style={[styles.meta, { color: colors.mutedText }]}>{timeLabel}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon type="Feather" name="map-pin" size={13} color={colors.mutedText} />
            <Text style={[styles.meta, { color: colors.mutedText }]}>{distanceLabel}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default memo(FindingRideForYouCard);

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 96,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontSize: 12,
    lineHeight: 18,
  },
});
