import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../../general/components/Icon';
import Image from '../../../../../general/components/Image';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { HomeVisitsSingleVendorCategoryService } from '../../api/types';

type Props = {
  service: HomeVisitsSingleVendorCategoryService;
  onPress?: () => void;
};

function formatPrice(price?: number | null) {
  if (typeof price !== 'number') {
    return null;
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);
}

export default function HomeVisitServiceCard({ service, onPress }: Props) {
  const { colors, typography } = useTheme();
  const imageUrl =
    service.productImage ??
    service.storeImage ??
    service.storeLogo ??
    'https://placehold.co/600x400/png';
  const priceLabel = formatPrice(service.price);
  const reviewCount =
    typeof service.reviewCount === 'number'
      ? `(${service.reviewCount.toLocaleString()})`
      : null;

  return (
    <Pressable
      accessibilityLabel={service.productName}
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {service.deal ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text
              weight="semiBold"
              style={{
                color: colors.white,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {service.deal}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text
          numberOfLines={2}
          weight="semiBold"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
          }}
        >
          {service.productName}
        </Text>

        {service.storeName ? (
          <Text
            numberOfLines={1}
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
            }}
          >
            {service.storeName}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            {typeof service.averageRating === 'number' ? (
              <>
                <Icon
                  type="AntDesign"
                  name="star"
                  size={14}
                  color={colors.yellow500}
                />
                <Text
                  weight="semiBold"
                  style={{
                    color: colors.text,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.sm2,
                  }}
                >
                  {service.averageRating.toFixed(1)}
                </Text>
              </>
            ) : null}

            {reviewCount ? (
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.sm2,
                }}
              >
                {reviewCount}
              </Text>
            ) : null}
          </View>

          {service.priceTier ? (
            <Text
              weight="medium"
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.sm2,
              }}
            >
              {service.priceTier}
            </Text>
          ) : null}
        </View>

        {priceLabel ? (
          <Text
            weight="extraBold"
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            }}
          >
            {priceLabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    top: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: 280,
  },
  content: {
    gap: 8,
    padding: 14,
  },
  image: {
    height: 160,
    width: '100%',
  },
  imageWrap: {
    overflow: 'hidden',
    position: 'relative',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});
