import React from 'react';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Platform, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryTopBrand } from '../../api/types';

type Props = {
  brand: DeliveryTopBrand;
  cardStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
};

export default function TopBrandCard({
  brand,
  cardStyle,
  imageContainerStyle,
  imageStyle,
  contentStyle,
  badgeStyle,
  titleStyle,
  subtitleStyle,
}: Props) {
  const { colors, typography } = useTheme();
  const badgeLabel =
    brand.dealAmount && brand.dealType === 'percentage'
      ? `${brand.dealAmount}%`
      : brand.dealAmount
        ? String(brand.dealAmount)
        : undefined;
  const subtitle = badgeLabel ? undefined : brand.deal ?? undefined;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: 'rgba(16, 24, 40, 0.08)',
          shadowColor: '#101828',
        },
        cardStyle,
      ]}
    >
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: colors.surfaceSoft },
          imageContainerStyle,
        ]}
      >
        <Image
          source={{ uri: brand.logo ?? '' }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />

        {badgeLabel ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.blue800, shadowColor: colors.shadowColor },
              badgeStyle,
            ]}
          >
            <Icon type="Feather" name="tag" size={12} color={colors.white} />
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
        ) : null}
      </View>

      <View
        style={[
          styles.content,
          { borderTopColor: 'rgba(0, 0, 0, 0.04)', shadowColor: '#000000' },
          contentStyle,
        ]}
      >
        <Text
          weight="semiBold"
          numberOfLines={1}
          style={[
            {
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.xxs,
            },
            titleStyle,
          ]}
        >
          {brand.name}
        </Text>

        {subtitle ? (
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={[
              {
                fontSize: typography.size.xxs,
                lineHeight: typography.lineHeight.xxs,
              },
              subtitleStyle,
            ]}
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
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.select({ ios: 0.12, android: 0.18 }),
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
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    top: 8,
  },
  content: {
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 0,
    minHeight: 40,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
