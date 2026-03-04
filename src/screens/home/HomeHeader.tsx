import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../../general/components/Text';
import BannerSwiper from '../../general/components/BannerSwiper';
import Image from '../../general/components/Image';
import { useTheme } from '../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homePatterns } from '../../general/assets/images';

const doodleLines = 'https://www.figma.com/api/mcp/asset/903ad3ca-275a-49f4-a3e3-b7b90c360b96';
const doodleSplines = 'https://www.figma.com/api/mcp/asset/08bf846b-8b15-4164-920e-5e2179f67dbe';
const doodleCircles = 'https://www.figma.com/api/mcp/asset/829d08ad-f239-4503-b7c6-e638a01dac31';
const doodleTriangles = 'https://www.figma.com/api/mcp/asset/1883caab-8f5b-421f-a5c2-825d2dbaa071';
type BannerItem = {
  id: string;
  title: string;
  discountLabel: string;
  description: string;
  note: string;
  percent: string;
};

type Props = {
  backgroundVariant?: 'gradient' | 'solid';
};

export default function HomeHeader({ backgroundVariant = 'gradient' }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bannerSidePadding = 16;
  const bannerWidth = width - bannerSidePadding * 2;
  const [bannerIndex, setBannerIndex] = useState(0);
  const items: BannerItem[] = [
    {
      id: 'banner-1',
      title: t('special_title'),
      discountLabel: t('special_offer_label'),
      description: t('special_description'),
      note: t('special_note'),
      percent: t('special_percent'),
    },
    {
      id: 'banner-2',
      title: t('special_title'),
      discountLabel: t('special_offer_label'),
      description: t('special_description'),
      note: t('special_note'),
      percent: t('special_percent'),
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.heroBackground}>
        <Image
          source={homePatterns.header}
          style={styles.heroBackgroundImage}
          resizeMode="stretch"
          pointerEvents="none"
        />
      </View>
      <View style={styles.heroContent}>
        <Text
          weight="semiBold"
          style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.sm2 }}
        >
          {t('greeting')}
        </Text>
        <Text
          weight="semiBold"
          style={{ fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }}
        >
          {t('home_question')}
        </Text>
      </View>

      <View style={[styles.bannerWrapper, { width: bannerWidth + bannerSidePadding * 2 }]}>
        <BannerSwiper
          data={items}
          renderItem={({ item }) => (
            <View style={{ width: bannerWidth, marginHorizontal: bannerSidePadding }}>
              <View style={styles.bannerCard}>
                <LinearGradient
                  colors={[colors.bannerGradientStart, colors.bannerGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bannerGradient}
                />
                <Image
                  source={homePatterns.banner}
                  style={styles.bannerDoodles}
                  resizeMode="stretch"
                  pointerEvents="none"
                />
               
                <View style={styles.bannerContent}>
                  <Text
                    weight="semiBold"
                    color={colors.white}
                    style={{ fontSize: typography.size.xs2, lineHeight: typography.lineHeight.xs2 }}
                  >
                    {item.discountLabel}
                  </Text>
                  <Text
                    weight="extraBold"
                    color={colors.white}
                    style={{ fontSize: typography.size.lg, lineHeight: typography.lineHeight.md }}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.bannerDescription}>
                    <Text
                      weight="medium"
                      color={colors.white}
                      style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.sm2 }}
                    >
                      {item.description}
                    </Text>
                    <Text
                      weight="medium"
                      color={colors.white}
                      style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.sm2 }}
                    >
                      {item.note}
                    </Text>
                  </View>
                </View>
                <Text
                  weight="extraBold"
                  color={colors.white}
                  style={{ fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5, zIndex: 3 }}
                >
                  {item.percent}
                </Text>
              </View>
            </View>
          )}
          style={styles.bannerSwiper}
          onIndexChange={setBannerIndex}
        />
        <View style={styles.bannerDots}>
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.bannerDot,
                index === bannerIndex ? styles.bannerDotActive : styles.bannerDotInactive,
                { backgroundColor: index === bannerIndex ? colors.iconMuted : colors.iconDisabled },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 210,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  heroBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    gap: 4,
  },
  bannerWrapper: {
    alignSelf: 'center',
  },
  bannerCard: {
    padding: 16,
    height: 156,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bannerDoodles: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  bannerSwiper: {},
  bannerContent: {
    flex: 1,
    gap: 8,
    zIndex: 3,
  },
  bannerDescription: {
    gap: 0,
    marginTop:10

  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  bannerDot: {
    height: 6,
    borderRadius: 999,
  },
  bannerDotActive: {
    width: 18,
  },
  bannerDotInactive: {
    width: 6,
  },
  doodleWrap: {
    position: 'absolute',
    right: 0,
    opacity: 0.5,
    borderRadius: 400,
    overflow: 'hidden',
    zIndex: 2,
  },
  doodleLines: {
    position: 'absolute',
    width: 399.413,
    height: 430.006,
    left: -36.93,
    top: -7.61,
  },
  doodleSplines: {
    position: 'absolute',
    width: 385.558,
    height: 444.84,
    left: -31.38,
    top: -8.82,
  },
  doodleCircles: {
    position: 'absolute',
    width: 119.477,
    height: 420.508,
    left: 100.02,
    top: -17,
  },
  doodleTriangles: {
    position: 'absolute',
    width: 309.557,
    height: 360.944,
    left: 1.03,
    top: -8.83,
  },
  doodleRing: {
    position: 'absolute',
    borderWidth: 9.152,
    borderRadius: 92.593,
  },
  doodleRingOne: {
    width: 39.891,
    height: 39.891,
    left: 149.37,
    top: 241.54,
    transform: [{ rotate: '-5.74deg' }],
  },
  doodleRingTwo: {
    width: 31.705,
    height: 31.705,
    left: 307.89,
    top: 153.95,
    transform: [{ rotate: '10.65deg' }],
  },
  doodleRingThree: {
    width: 52.799,
    height: 52.799,
    left: 308.22,
    top: -21.25,
    transform: [{ rotate: '24.81deg' }],
  },
  doodleRingFour: {
    width: 52.799,
    height: 52.799,
    left: 308.22,
    top: 331.75,
    transform: [{ rotate: '24.81deg' }],
  },
  doodleRingFive: {
    width: 52.799,
    height: 52.799,
    left: -44.78,
    top: -21.25,
    transform: [{ rotate: '24.81deg' }],
  },
  doodleRingSix: {
    width: 52.799,
    height: 52.799,
    left: -44.78,
    top: 331.75,
    transform: [{ rotate: '24.81deg' }],
  },
});
