import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../../general/components/Icon';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsSingleVendorServiceBookingScreenResponse } from '../../types/serviceDetails';

type Props = {
  data: HomeVisitsSingleVendorServiceBookingScreenResponse;
  basePrice: string | null;
  durationLabel: string | null;
  isFavorite: boolean;
  isFavoritePending: boolean;
  onBack: () => void;

  onRatingPress?: () => void;
  onFavorite: () => void;
  onShare: () => void;
};

export default function ServiceDetailsHeroSummary({
  data,
  basePrice,
  durationLabel,
  isFavorite,
  isFavoritePending,
  onBack,

  onRatingPress,
  onFavorite,
  onShare,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const heroImageUrl = data.imageUrl ?? 'https://placehold.co/800x500.png';
  const averageRating = data.rating?.average ?? 0;
  const reviewCount = data.rating?.count ?? 0;
  const favoriteIconName = isFavorite ? 'heart' : 'heart-outline';

  return (
    <>
      <View style={styles.heroContainer}>
        <Image source={{ uri: heroImageUrl }} style={styles.heroImage} />
        <View
          style={[
            styles.heroOverlay,
            {
              backgroundColor: colors.overlayDark20,
            },
          ]}
        />

        <View
          style={[
            styles.heroActions,
            {
              paddingTop: insets.top + 12,
            },
          ]}
        >
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onBack}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <View
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.backgroundTertiary,
                  shadowColor: colors.shadowColor,
                },
              ]}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </View>
          </Pressable>

          <View style={styles.rightActions}>
            <Pressable
              accessibilityLabel={t('service_details_favorite_action')}
              accessibilityRole="button"
              disabled={isFavoritePending}
              hitSlop={10}
              onPress={onFavorite}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
              <View
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colors.backgroundTertiary,
                    shadowColor: colors.shadowColor,
                  },
                ]}
              >
                {isFavoritePending ? (
                  <ActivityIndicator color={colors.text} size="small" />
                ) : (
                  <Ionicons
                    name={favoriteIconName}
                    size={24}
                    color={isFavorite ? colors.danger : colors.text}
                  />
                )}
              </View>
            </Pressable>

            <Pressable
              accessibilityLabel={t('service_details_share_action')}
              accessibilityRole="button"
              hitSlop={10}
              onPress={onShare}
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            >
              <View
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colors.backgroundTertiary,
                    shadowColor: colors.shadowColor,
                  },
                ]}
              >
                <Ionicons name="share-outline" size={24} color={colors.text} />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.sectionBody}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
            letterSpacing: -0.36,
          }}
        >
          {data.serviceName}
        </Text>

        <View style={styles.ratingRow}>
          <Icon type="AntDesign" name="star" size={14} color={colors.yellow500} />
          <Text
            weight="semiBold"
            style={{
              color: colors.text,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {averageRating.toFixed(1)}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={!onRatingPress}
            onPress={onRatingPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <Text
              weight="medium"
              style={{
                color: colors.warningText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
                textDecorationLine: 'underline',
              }}
            >
              ({reviewCount.toLocaleString()}+)
            </Text>
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          {basePrice ? (
            <Text
              weight="medium"
              style={{
                color: colors.warningText,
                fontSize: typography.size.md2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {basePrice}
            </Text>
          ) : null}
          {durationLabel ? (
            <>
              <Icon type="Entypo" name="dot-single" size={16} color={colors.iconMuted} />
              <Text
                weight="medium"
                style={{
                  color: colors.iconMuted,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {durationLabel}
              </Text>
            </>
          ) : null}
        </View>

        {data.description ? (
          <Text
            weight="regular"
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {data.description}
          </Text>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heroActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
    width: '100%',
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    width: 40,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionBody: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
