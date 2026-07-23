import React, { type ReactNode } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { StyleSheet, View } from 'react-native';
import Card from '../../../../general/components/Card';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentProvider } from '../../api/types';
import AppointmentsProviderRailCard from './AppointmentsProviderRailCard';

type Props = {
  provider: AppointmentProvider;
  isFullWidth?: boolean;
  variant?: 'default' | 'compact';
  actionSlot?: ReactNode;
};

export default function AppointmentsProviderCard({
  provider,
  isFullWidth = false,
  variant = 'default',
  actionSlot,
}: Props) {
  const { colors, typography } = useTheme();

  if (variant === 'default') {
    return (
      <AppointmentsProviderRailCard
        provider={provider}
        isFullWidth={isFullWidth}
      />
    );
  }

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
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {provider.name}
          </Text>
          {actionSlot ?? (
            <View
              style={[
                styles.favoriteButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons color={colors.iconMuted} name="heart-outline" size={20} />
            </View>
          )}
        </View>

        <Text color={colors.mutedText} numberOfLines={1} style={styles.metaText}>
          {provider.address ?? provider.shopTypeName ?? ''}
        </Text>

        {hasDistance || hasRating ? (
          <View style={styles.metaRow}>
            {hasDistance ? (
              <View style={styles.metaItem}>
                <SimpleLineIcons color={colors.primary} name="location-pin" size={20} />
                <Text color={colors.text} style={styles.compactMetaText}>
                  {`${provider.distanceKm?.toFixed(1)} km`}
                </Text>
              </View>
            ) : null}
            {hasRating ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons color={colors.warning} name="star" size={20} />
                <Text weight="semiBold" style={styles.compactMetaText}>
                  {provider.averageRating?.toFixed(1)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 22,
    flexDirection: 'row',
    minHeight: 106,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 250,
  },
  cardFullWidth: {
    width: '100%',
  },
  compactMetaText: {
    fontSize: 13,
    lineHeight: 18,
  },
  copy: {
    flex: 1,
    gap: 6,
    paddingLeft: 12,
  },
  favoriteButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  image: {
    borderRadius: 18,
    height: 82,
    width: 82,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
