import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { DeliveryBanner } from '../../../api/types';
import SpecialOffersBannerMedia from './SpecialOffersBannerMedia';
import SpecialOffersBannerVideo from './SpecialOffersBannerVideo';

type Props = {
  banner: DeliveryBanner;
  width: number;
  sidePadding: number;
};

export default function SpecialOffersBannerCard({ banner, width, sidePadding }: Props) {
  const { colors, typography } = useTheme();
  const videoUri = banner.bannerVideoLink?.trim() ?? '';
  const storeAddress = banner.store?.address?.trim() ?? '';
  const description = banner.description?.trim() ?? '';

  return (
    <View style={[styles.container, { marginHorizontal: sidePadding, width }]}>
        {videoUri ? (
          <SpecialOffersBannerVideo videoUri={videoUri} />
        ) : (
          <SpecialOffersBannerMedia banner={banner} />
        )}
      <View style={styles.bannerCard}>

        <LinearGradient
          colors={['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0.72)']}
          end={{ x: 0.9, y: 1 }}
          start={{ x: 0.2, y: 0 }}
          style={styles.overlay}
        />

        <View style={styles.content}>
          {storeAddress ? (
            <Text
              color={colors.white}
              weight="semiBold"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {storeAddress}
            </Text>
          ) : null}

          <Text
            color={colors.white}
            numberOfLines={2}
            weight="extraBold"
            style={{
              fontSize: typography.size.xl,
              lineHeight: typography.lineHeight.xl,
            }}
          >
            {banner.title}
          </Text>

          {description ? (
            <Text
              color={colors.white}
              numberOfLines={3}
              weight="medium"
              style={{
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderRadius: 18,
    overflow: 'hidden',
  },
  bannerCard: {
    borderRadius: 18,
    height: 206,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    gap: 8,
    zIndex: 1,
  },
});
