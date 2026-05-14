import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import BannerSwiper from '../../../../../general/components/BannerSwiper';
import Image from '../../../../../general/components/Image';
import Skeleton from '../../../../../general/components/Skeleton';
import useSingleVendorBanners from '../../hooks/useSingleVendorBanners';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { homePatterns } from '../../../../../general/assets/images';

export default function SingleVendorSpecialOffersBanner() {
  const { colors, typography } = useTheme();
  const { width } = useWindowDimensions();
  const { data: banners = [], isPending } = useSingleVendorBanners();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerSidePadding = 20;
  const bannerWidth = width - bannerSidePadding * 2;
  const activeBannerIndex =
    banners.length > 0 ? Math.min(bannerIndex, banners.length - 1) : 0;

  if (isPending) {
    return (
      <View style={styles.wrapper}>
        <Skeleton borderRadius={18} height={206} width="100%">
          <View style={styles.skeletonContent}>
            <Skeleton borderRadius={6} height={14} width={140} />
            <Skeleton borderRadius={8} height={28} width="68%" />
            <Skeleton borderRadius={7} height={16} width="82%" />
            <Skeleton borderRadius={7} height={16} width="54%" />
          </View>
        </Skeleton>
      </View>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <View style={[styles.wrapper, { width: bannerWidth + bannerSidePadding * 2 }]}>
      <BannerSwiper
        data={banners}
        onIndexChange={setBannerIndex}
        renderItem={({ item }) => {
          const imageUri =
            item.bannerImageLink?.trim() ??
            item.store?.coverImage?.trim() ??
            item.store?.storeImage?.trim() ??
            '';
          const storeAddress = item.store?.address?.trim() ?? '';
          const description = item.description?.trim() ?? '';

          return (
            <View
              style={[
                styles.card,
                { marginHorizontal: bannerSidePadding, width: bannerWidth },
              ]}
            >
              {imageUri ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: imageUri }}
                  style={styles.media}
                />
              ) : (
                <Image
                  resizeMode="stretch"
                  source={homePatterns.banner}
                  style={[styles.media, styles.fallbackMedia]}
                />
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
                    {item.title}
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
        }}
      />

      <View style={styles.bannerDots}>
        {banners.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.bannerDot,
              index === activeBannerIndex
                ? styles.bannerDotActive
                : styles.bannerDotInactive,
              {
                backgroundColor:
                  index === activeBannerIndex
                    ? colors.primary
                    : colors.iconDisabled,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  skeletonContent: {
    gap: 12,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  card: {
    alignSelf: 'stretch',
    borderRadius: 18,
    overflow: 'hidden',
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  fallbackMedia: {
    opacity: 0.55,
  },
  bannerCard: {
    borderRadius: 18,
    height: 160,
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
  bannerDots: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 10,
  },
  bannerDot: {
    borderRadius: 999,
    height: 6,
  },
  bannerDotActive: {
    width: 19,
  },
  bannerDotInactive: {
    width: 6,
  },
});
