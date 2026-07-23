import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { StyleSheet, View } from 'react-native';
import Card from '../../../../general/components/Card';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentProvider } from '../../api/types';

type Props = {
  provider: AppointmentProvider;
  isFullWidth: boolean;
};

export default function AppointmentsProviderRailCard({ provider, isFullWidth }: Props) {
  const { colors, typography } = useTheme();
  const imageUri =
    provider.coverImage ?? provider.logo ?? 'https://placehold.co/400x240.png';
  const hasDistance = typeof provider.distanceKm === 'number';
  const hasRating = typeof provider.averageRating === 'number' && provider.averageRating > 0;

  return (
    <Card
      style={[
        styles.card,
        isFullWidth ? styles.cardFullWidth : null,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
      variant="outlined"
    >
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text
            weight="bold"
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {provider.name}
          </Text>
          {!hasRating && provider.shopTypeName ? (
            <Text
              color={colors.mutedText}
              numberOfLines={1}
              style={[styles.metaText, styles.shopType]}
            >
              {provider.shopTypeName}
            </Text>
          ) : null}
        </View>

        {hasRating ? (
          <View style={styles.providerMetaRow}>
            <View style={styles.ratingWrap}>
              <MaterialCommunityIcons
                color={colors.warning}
                name="star-outline"
                size={16}
              />
              <Text weight="semiBold" style={styles.metaText}>
                {provider.averageRating?.toFixed(1)}
              </Text>
              {typeof provider.reviewCount === 'number' && provider.reviewCount > 0 ? (
                <Text color={colors.mutedText} style={styles.metaText}>
                  ({provider.reviewCount.toLocaleString()}+)
                </Text>
              ) : null}
            </View>

            {provider.shopTypeName ? (
              <Text
                color={colors.mutedText}
                numberOfLines={1}
                style={[styles.metaText, styles.shopType]}
              >
                {provider.shopTypeName}
              </Text>
            ) : null}
          </View>
        ) : null}

        {provider.address ? (
          <Text color={colors.mutedText} numberOfLines={1} style={styles.metaText}>
            {provider.address}
          </Text>
        ) : null}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.bottomRow}>
        {hasDistance ? (
          <View style={styles.footerMeta}>
            <SimpleLineIcons color={colors.iconMuted} name="location-pin" size={16} />
            <Text color={colors.mutedText} style={styles.metaText}>
              {`${provider.distanceKm?.toFixed(1)} km`}
            </Text>
          </View>
        ) : null}
        {hasDistance ? <View style={[styles.dot, { backgroundColor: colors.border }]} /> : null}
        <Text color={colors.mutedText} style={styles.metaText}>
          {provider.priceTier ?? '$$$'}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 250,
  },
  cardFullWidth: {
    width: '100%',
  },
  details: {
    gap: 4,
    minHeight: 80,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  dot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  footerMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  image: {
    height: 136,
    width: '100%',
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
  },
  providerMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  shopType: {
    flexShrink: 1,
    marginLeft: 12,
    textAlign: 'right',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
