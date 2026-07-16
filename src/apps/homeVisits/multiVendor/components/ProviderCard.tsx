import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsMultiVendorProvider } from '../api/types';

type Props = {
  provider: HomeVisitsMultiVendorProvider;
  onPress?: () => void;
  layout?: 'compact' | 'fullWidth';
};

function formatPrice(value?: number | null) {
  if (value == null || !Number.isFinite(value)) {
    return null;
  }

  return `$${value.toFixed(2)}`;
}

function resolveIsClosed(value?: boolean | string | number | null) {
  return value === true || value === 'true' || value === '1' || value === 1;
}

export default function ProviderCard({ provider, onPress, layout = 'compact' }: Props) {
  const { colors, typography } = useTheme();
  const imageUrl =
    provider.coverImageUrl ||
    provider.imageUrl ||
    provider.logoUrl ||
    'https://placehold.co/480x320.png';
  const priceLabel = formatPrice(provider.startingPrice);
  const isClosed = resolveIsClosed(provider.isClosed);
  const ratingValue =
    typeof provider.averageRating === 'number' && provider.averageRating > 0
      ? provider.averageRating
      : null;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        layout === 'fullWidth' ? styles.fullWidthCard : styles.compactCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {isClosed ? (
          <View style={styles.closedOverlay}>
            <View style={[styles.closedBadge, { backgroundColor: colors.text }]}>
              <Text weight="semiBold" style={{ color: colors.surface, fontSize: 12 }}>
                Closed
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text
              numberOfLines={1}
              weight="semiBold"
              style={{
                color: colors.text,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {provider.name}
            </Text>
            {provider.categoryName ? (
              <Text
                numberOfLines={1}
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.xs,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {provider.categoryName}
              </Text>
            ) : null}
          </View>

          <View style={[styles.logoWrap, { backgroundColor: colors.backgroundTertiary }]}>
            <Image source={{ uri: provider.logoUrl || imageUrl }} style={styles.logo} />
          </View>
        </View>

        <View style={styles.metaRow}>
          {ratingValue != null ? (
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color={colors.yellow500} />
              <Text weight="medium" style={{ color: colors.text, fontSize: 12 }}>
                {ratingValue.toFixed(1)}
              </Text>
              {provider.reviewCount != null && provider.reviewCount > 0 ? (
                <Text style={{ color: colors.mutedText, fontSize: 12 }}>
                  ({provider.reviewCount.toLocaleString()})
                </Text>
              ) : null}
            </View>
          ) : null}

          {provider.distanceLabel ? (
            <View style={styles.metaItem}>
              <Ionicons name="navigate-outline" size={14} color={colors.mutedText} />
              <Text numberOfLines={1} style={{ color: colors.mutedText, fontSize: 12 }}>
                {provider.distanceLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footerRow}>
          {provider.availabilityLabel ? (
            <Text
              numberOfLines={1}
              weight="medium"
              style={{ color: isClosed ? colors.danger : colors.success, fontSize: 12 }}
            >
              {provider.availabilityLabel}
            </Text>
          ) : null}
          {priceLabel ? (
            <Text
              numberOfLines={1}
              weight="medium"
              style={{ color: colors.mutedText, fontSize: 12 }}
            >
              {priceLabel}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  compactCard: {
    width: 260,
  },
  fullWidthCard: {
    width: '100%',
  },
  content: {
    gap: 8,
    padding: 10,
  },
  closedBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'center',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageWrap: {
    height: 120,
    width: '100%',
  },
  logo: {
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  logoWrap: {
    borderRadius: 20,
    padding: 2,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    minWidth: 0,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
