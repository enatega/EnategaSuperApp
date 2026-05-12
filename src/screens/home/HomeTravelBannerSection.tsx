import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import BannerSwiper from '../../general/components/BannerSwiper';
import Image from '../../general/components/Image';
import Text from '../../general/components/Text';
import { useTheme } from '../../general/theme/theme';

type BannerItem = {
  id: string;
  source: number;
};

const BANNER_IMAGE_RATIO = 361 / 156;
const ACTIVE_DOT_WIDTH = 18;
const INACTIVE_DOT_SIZE = 6;

type Props = {
  onPress?: () => void;
};

export default function HomeTravelBannerSection({ onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const { width } = useWindowDimensions();
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = useMemo<BannerItem[]>(
    () => [
      {
        id: 'trip-banner-1',
        source: require('../../apps/rideSharing/assets/images/TripBanner.png'),
      },
      {
        id: 'travel-banner-2',
        source: require('../../apps/rideSharing/assets/images/TravelBanner.png'),
      },
      {
        id: 'trip-banner-3',
        source: require('../../apps/rideSharing/assets/images/TripBanner.png'),
      },
      {
        id: 'trip-banner-4',
        source: require('../../apps/rideSharing/assets/images/TravelBanner.png'),
      },
    ],
    [],
  );

  const sectionWidth = width - 32;
  const bannerWidth = sectionWidth;
  const bannerHeight = bannerWidth / BANNER_IMAGE_RATIO;
  const activeBannerIndex = Math.min(bannerIndex, banners.length - 1);

  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t('home_drive_banners_title')}
        </Text>
      </View>
      <View style={[styles.swiperWrap, { width: sectionWidth }]}>
        <BannerSwiper
          data={banners}
          onIndexChange={setBannerIndex}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: bannerWidth }]}>
              <Pressable onPress={onPress}>
                <Image
                  source={item.source}
                  style={[styles.bannerImage, { width: bannerWidth, height: bannerHeight }]}
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          )}
        />
      </View>

      <View style={styles.dots}>
        {banners.map((banner, index) => {
          const isActive = index === activeBannerIndex;

          return (
            <View
              key={banner.id}
              style={[
                styles.dot,
                {
                  width: isActive ? ACTIVE_DOT_WIDTH : INACTIVE_DOT_SIZE,
                  height: INACTIVE_DOT_SIZE,
                  backgroundColor: isActive ? colors.iconMuted : colors.iconDisabled,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  titleWrap: {
    paddingHorizontal: 4,
  },
  swiperWrap: {
    alignSelf: 'center',
  },
  slide: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    borderRadius: 12,
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 999,
  },
});
