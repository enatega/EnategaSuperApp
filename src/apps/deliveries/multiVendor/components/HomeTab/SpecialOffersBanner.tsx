import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import BannerSwiper from '../../../../../general/components/BannerSwiper';
import Image from '../../../../../general/components/Image';
import { homePatterns } from '../../../../../general/assets/images';
import { useTheme } from '../../../../../general/theme/theme';

type BannerItem = {
  id: string;
};

const items: BannerItem[] = [{ id: 'banner-1' }, { id: 'banner-2' }, { id: 'banner-3' }];

export default function SpecialOffersBanner() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const { width } = useWindowDimensions();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerSidePadding = 20;
  const bannerWidth = width - bannerSidePadding * 2;

  return (
    <View style={[styles.wrapper, { width: bannerWidth + bannerSidePadding * 2 }]}>
      <BannerSwiper
        data={items}
        onIndexChange={setBannerIndex}
        renderItem={({ item }) => (
          <View key={item.id} style={{ marginHorizontal: bannerSidePadding, width: bannerWidth }}>
            <View style={styles.bannerCard}>
              <LinearGradient
                colors={[colors.bannerGradientStart, colors.bannerGradientEnd]}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.bannerGradient}
              />
              <Image
                resizeMode="stretch"
                source={homePatterns.banner}
                style={styles.bannerPattern}
              />
              <View style={styles.bannerContent}>
                <Text
                  color={colors.white}
                  weight="semiBold"
                  style={{
                    fontSize: typography.size.md2,
                    lineHeight: typography.lineHeight.md2,
                  }}
                >
                  {t('special_offer_label')}
                </Text>
                <Text
                  color={colors.white}
                  weight="extraBold"
                  style={{
                    fontSize: typography.size.lg,
                    lineHeight: typography.lineHeight.h5,
                  }}
                >
                  {t('special_title')}
                </Text>
                <View style={styles.bannerTextBlock}>
                  <Text
                    color={colors.white}
                    weight="medium"
                    style={{
                      fontSize: typography.size.sm2,
                    }}
                  >
                    {t('special_description')}
                  </Text>
                  <Text
                    color={colors.white}
                    weight="medium"
                    style={{
                      fontSize: typography.size.sm2,
                      lineHeight: typography.lineHeight.xl2,
                    }}
                  >
                    {t('special_note')}
                  </Text>
                </View>
              </View>
              <Text
                color={colors.white}
                weight="extraBold"
                style={{
                  fontSize: 34,
                  lineHeight: 40,
                }}
              >
                {t('special_percent')}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.bannerDots}>
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.bannerDot,
              index === bannerIndex ? styles.bannerDotActive : styles.bannerDotInactive,
              {
                backgroundColor:
                  index === bannerIndex ? colors.iconMuted : colors.iconDisabled,
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
  bannerCard: {
    borderRadius: 18,
    flexDirection: 'row',
    height: 206,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 18,
    paddingTop: 20,
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerPattern: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    opacity: 0.55,
    width: '100%',
  },
  bannerContent: {
    flex: 1,
    gap: 8,
    paddingRight: 10,
    zIndex: 1,
  },
  bannerTextBlock: {
    alignSelf: 'stretch',
    marginTop: 34,
    width: '100%',
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
