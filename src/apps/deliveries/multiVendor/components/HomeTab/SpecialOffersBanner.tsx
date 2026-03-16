import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import BannerSwiper from '../../../../../general/components/BannerSwiper';
import { useTheme } from '../../../../../general/theme/theme';
import { useMobileBanners } from '../../../hooks';
import SpecialOffersBannerSkeleton from './HomeTabSkeletons/SpecialOffersBannerSkeleton';
import SpecialOffersBannerCard from './SpecialOffersBannerCard';

export default function SpecialOffersBanner() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [bannerIndex, setBannerIndex] = useState(0);
  const { data: banners = [], isPending } = useMobileBanners();
  const bannerSidePadding = 20;
  const bannerWidth = width - bannerSidePadding * 2;
  const activeBannerIndex =
    banners.length > 0 ? Math.min(bannerIndex, banners.length - 1) : 0;

  if (isPending) {
    return <SpecialOffersBannerSkeleton />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={[styles.wrapper, { width: bannerWidth + bannerSidePadding * 2 }]}>
      <BannerSwiper
        data={banners}
        onIndexChange={setBannerIndex}
        renderItem={({ item }) => (
          <SpecialOffersBannerCard
            banner={item}
            sidePadding={bannerSidePadding}
            width={bannerWidth}
          />
        )}
      />

      <View style={styles.bannerDots}>
        {banners.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.bannerDot,
              index === activeBannerIndex ? styles.bannerDotActive : styles.bannerDotInactive,
              {
                backgroundColor:
                  index === activeBannerIndex ? colors.iconMuted : colors.iconDisabled,
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
  bannerDots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  bannerDot: {
    borderRadius: 999,
    height: 8,
  },
  bannerDotActive: {
    width: 24,
  },
  bannerDotInactive: {
    width: 8,
  },
});
