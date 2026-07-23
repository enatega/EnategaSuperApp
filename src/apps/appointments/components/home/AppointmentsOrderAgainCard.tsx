import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Card from '../../../../general/components/Card';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
} from '../../api/types';

type Props = {
  item: AppointmentOrderAgainItem | AppointmentMostPopularItem;
  isFullWidth?: boolean;
  isFavorite?: boolean;
  isFavoritePending?: boolean;
  onFavoritePress?: (item: AppointmentOrderAgainItem) => void;
};

export default function AppointmentsOrderAgainCard({
  item,
  isFullWidth = false,
  isFavorite = item.isFavorite ?? false,
  isFavoritePending = false,
  onFavoritePress,
}: Props) {
  const { colors, typography } = useTheme();
  const imageUri =
    item.productImage ??
    item.storeImage ??
    item.storeLogo ??
    'https://placehold.co/320x240.png';
  const rating =
    'averageRating' in item && item.averageRating > 0
      ? {
          value: item.averageRating.toFixed(1),
          reviewCount: item.reviewCount,
        }
      : null;
  const handleFavoritePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onFavoritePress?.(item);
  };

  return (
    <Card
      style={[
        styles.card,
        isFullWidth ? styles.cardFullWidth : null,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      variant="outlined"
    >
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text
            weight="bold"
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
            }}
          >
            {item.productName}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={isFavoritePending || !onFavoritePress}
            hitSlop={10}
            onPress={handleFavoritePress}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed ? styles.favoriteButtonPressed : null,
            ]}
          >
            {isFavoritePending ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <MaterialCommunityIcons
                color={isFavorite ? colors.primary : colors.iconMuted}
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
              />
            )}
          </Pressable>
        </View>
        <Text color={colors.mutedText} numberOfLines={1} style={styles.metaText}>
          {item.storeName ?? ''}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.priceWrap}>
            <MaterialCommunityIcons color={colors.primary} name="cash" size={16} />
            <Text weight="semiBold" style={styles.metaText}>
              {typeof item.price === 'number' ? `$${item.price}` : '--'}
            </Text>
          </View>
          {rating ? (
            <View style={styles.ratingWrap}>
              <MaterialCommunityIcons
                color={colors.warning}
                name="star"
                size={16}
              />
              <Text weight="semiBold" style={styles.metaText}>
                {rating.value} ({rating.reviewCount})
              </Text>
            </View>
          ) : null}
          {item.deal ? (
            <View style={[styles.badge, { backgroundColor: colors.warningSoft }]}>
              <Text color={colors.successText} style={styles.metaText} numberOfLines={1}>
                {item.deal}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  card: {
    padding: 0,
    width: 250,
  },
  cardFullWidth: {
    width: '100%',
  },
  copy: {
    gap: 6,
    padding: 14,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  favoriteButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  favoriteButtonPressed: {
    opacity: 0.7,
  },
  image: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 136,
    width: '100%',
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
  },
  priceWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  ratingWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
