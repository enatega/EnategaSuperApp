import React, { memo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import { placeholderImages } from '../../../../../general/assets/images';
import type { DeliveryNearbyStore } from '../../../api/types';

type Props = {
  store: DeliveryNearbyStore;
  freeDeliveryLabel: string;
  addToFavLabel: string;
  removeFromFavLabel: string;
  isTogglingFavourite?: boolean;
  onPress: () => void;
  onFavouritePress: () => void;
};

function FavouriteStoreCard({
  store,
  freeDeliveryLabel,
  addToFavLabel,
  removeFromFavLabel,
  isTogglingFavourite = false,
  onPress,
  onFavouritePress,
}: Props) {
  const { colors } = useTheme();

  const dealLabel =
    store.deal && store.dealAmount
      ? store.dealType === 'PERCENTAGE'
        ? `${store.dealAmount}% off`
        : `${store.dealAmount} off`
      : null;

  const feeLabel =
    store.baseFee != null && store.baseFee > 0
      ? `${store.baseFee}`
      : freeDeliveryLabel;

  const distanceLabel =
    store.distanceKm != null ? `${store.distanceKm} km` : null;

  // || falls through on both null and "" — use local fallback when no remote URL
  const imageUri = store.coverImage || undefined;
  const [imgError, setImgError] = useState(false);

  const favA11yLabel = store.isFavorite ? removeFromFavLabel : addToFavLabel;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>

      {/* Image area — pressable for store navigation */}
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={store.name}>
        <View style={[styles.imageWrapper, { backgroundColor: colors.border }]}>
          <Image
            source={!imgError && imageUri ? { uri: imageUri } : placeholderImages.store}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
          {dealLabel ? (
            <View style={[styles.dealBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="pricetag" size={10} color={colors.white} />
              <Text variant="caption" weight="medium" color={colors.white} style={styles.badgeText}>
                {dealLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      {/* Heart — sibling of image wrapper, NOT inside overflow:hidden */}
      <Pressable
        onPress={onFavouritePress}
        accessibilityRole="button"
        accessibilityLabel={favA11yLabel}
        hitSlop={12}
        disabled={isTogglingFavourite}
        style={[styles.heartButton, { backgroundColor: colors.surface }]}
      >
        {isTogglingFavourite ? (
          <ActivityIndicator size="small" color={colors.danger} />
        ) : (
          <Ionicons
            name={store.isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={colors.danger}
          />
        )}
      </Pressable>

      {/* Store info */}
      <Pressable onPress={onPress} style={styles.info}>
        <View style={styles.nameRow}>
          <Text weight="semiBold" style={styles.name} numberOfLines={1}>
            {store.name}
          </Text>
          {store.shopTypeName ? (
            <Text style={[styles.category, { color: colors.mutedText }]} numberOfLines={1}>
              {store.shopTypeName}
            </Text>
          ) : null}
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={colors.yellow500} />
          <Text weight="semiBold" style={styles.ratingValue}>
            {store.averageRating?.toFixed(1) ?? '0.0'}
          </Text>
          <Text style={[styles.ratingCount, { color: colors.mutedText }]}>
            ({store.reviewCount ?? 0})
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.metaRow}>
          <Ionicons name="bicycle-outline" size={14} color={colors.mutedText} />
          <Text style={[styles.metaText, { color: colors.mutedText }]}>{feeLabel}</Text>
          {store.deliveryTime ? (
            <>
              <View style={[styles.dot, { backgroundColor: colors.mutedText }]} />
              <Ionicons name="time-outline" size={14} color={colors.mutedText} />
              <Text style={[styles.metaText, { color: colors.mutedText }]}>
                {store.deliveryTime}
              </Text>
            </>
          ) : null}
          {distanceLabel ? (
            <>
              <View style={[styles.dot, { backgroundColor: colors.mutedText }]} />
              <Ionicons name="location-outline" size={14} color={colors.mutedText} />
              <Text style={[styles.metaText, { color: colors.mutedText }]}>{distanceLabel}</Text>
            </>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

export default memo(FavouriteStoreCard);

const styles = StyleSheet.create({
  badgeText: { fontSize: 11 },
  card: { borderRadius: 8, borderWidth: 1, position: 'relative' },
  category: { flexShrink: 1, fontSize: 12 },
  dealBadge: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 2,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: 8,
  },
  divider: { height: 1, marginVertical: 4 },
  dot: { borderRadius: 2, height: 3, width: 3 },
  heartButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
    zIndex: 10,
  },
  image: { height: 140, width: '100%' },
  imageWrapper: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  info: { gap: 4, padding: 8 },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  metaText: { fontSize: 12 },
  name: { flex: 1, fontSize: 14 },
  nameRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  ratingCount: { fontSize: 12 },
  ratingRow: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  ratingValue: { fontSize: 12 },
});
