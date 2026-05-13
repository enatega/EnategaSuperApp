import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { useNearbyStores } from '../../../hooks';

function formatTime(value?: number | string | null) {
  if (value == null) {
    return '30 mins';
  }

  if (typeof value === 'number') {
    return `${value} mins`;
  }

  return value.toLowerCase().includes('min') ? value : `${value} mins`;
}

function formatDistance(value?: number | null) {
  if (value == null) {
    return '1.7 km';
  }

  return `${value.toFixed(1)} km`;
}

function formatFee(value?: number | null) {
  if (value == null) {
    return '$2';
  }

  return `$${Math.round(value)}`;
}

export default function AllInOneRecommendedRestaurants() {
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();
  const { data: stores = [] } = useNearbyStores();
  const displayStores = stores.slice(0, 4);

  if (displayStores.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: colors.text }]} weight="bold">
        {t('multi_vendor_recommended_restaurants_title')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {displayStores.map((store) => {
          const imageUri = store.coverImage || store.logo || null;

          return (
            <View
              key={store.storeId}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor }]}
            >
              <View style={styles.imageWrap}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={[styles.imageFallback, { backgroundColor: colors.blue50 }]}>
                    <Ionicons name="restaurant-outline" size={28} color={colors.primary} />
                  </View>
                )}
              </View>

              <View style={styles.content}>
                <Text style={[styles.name, { color: colors.text }]} weight="semiBold" numberOfLines={1}>
                  {store.name}
                </Text>

                <View style={styles.metaRow}>
                  <Ionicons name="star" size={14} color={colors.yellow500} />
                  <Text style={[styles.metaStrong, { color: colors.text }]} weight="semiBold">
                    {(store.averageRating ?? 4.1).toFixed(1)}
                  </Text>
                  <Text style={[styles.metaMuted, { color: colors.iconMuted }]}>
                    {store.reviewCount ? `(${store.reviewCount}+)` : t('multi_vendor_nearby_store_review_count')}
                  </Text>
                  <Text style={[styles.metaMuted, { color: colors.iconMuted }]} numberOfLines={1}>
                    {store.shopTypeName ?? t('multi_vendor_nearby_store_category_fast_food')}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Ionicons name="bicycle-outline" size={14} color={colors.iconMuted} />
                    <Text style={[styles.infoText, { color: colors.iconMuted }]}>{formatFee(store.baseFee)}</Text>
                  </View>
                  <View style={[styles.dot, { backgroundColor: colors.border }]} />
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={14} color={colors.iconMuted} />
                    <Text style={[styles.infoText, { color: colors.iconMuted }]}>{formatTime(store.deliveryTime)}</Text>
                  </View>
                  <View style={[styles.dot, { backgroundColor: colors.border }]} />
                  <View style={styles.infoItem}>
                    <Ionicons name="location-outline" size={14} color={colors.iconMuted} />
                    <Text style={[styles.infoText, { color: colors.iconMuted }]}>{formatDistance(store.distanceKm)}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
  },
  row: {
    gap: 12,
    paddingRight: 16,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    width: 280,
  },
  imageWrap: {
    height: 140,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    gap: 6,
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  name: {
    fontSize: 14,
    lineHeight: 22,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaStrong: {
    fontSize: 12,
    lineHeight: 18,
  },
  metaMuted: {
    fontSize: 12,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  infoItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  dot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
});
