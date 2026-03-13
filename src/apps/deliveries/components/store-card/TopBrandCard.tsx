import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryTopBrand } from '../../api/types';

type Props = {
  brand: DeliveryTopBrand;
};

export default function TopBrandCard({ brand }: Props) {
  console.log('brands____',brand);
  
  const { colors, typography } = useTheme();
  const subtitle = brand.deal ?? undefined;
  const badgeLabel =
    brand.dealAmount && brand.dealType === 'percentage'
      ? `${brand.dealAmount}%`
      : brand.dealAmount
        ? String(brand.dealAmount)
        : undefined;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.surfaceSoft }]}>
        <Image
          source={{ uri: brand.logo ?? '' }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* {badgeLabel ? (
          <View style={[styles.badge, { backgroundColor: colors.blue800 }]}>
            <Text
              color={colors.white}
              weight="medium"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {badgeLabel}
            </Text>
          </View>
        ) : null} */}
      </View>

      <View style={styles.content}>
        <Text
          weight="semiBold"
          numberOfLines={1}
          style={{
            fontSize: typography.size.xxs,
            lineHeight: typography.lineHeight.xxs,
          }}
        >
          {brand.name}
        </Text>

        {subtitle ? (
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={{
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.xxs,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    height: 140,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    width: 100,
  },
  imageContainer: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 100,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  badge: {
    borderRadius: 6,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    top: 8,
  },
  content: {
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});
