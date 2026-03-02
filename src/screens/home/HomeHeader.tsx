import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Text from '../../general/components/Text';
import Card from '../../general/components/Card';
import BannerSwiper from '../../general/components/BannerSwiper';
import { useTheme } from '../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type BannerItem = {
  id: string;
  title: string;
  discountLabel: string;
  description: string;
  percent: string;
};

type Props = {
  items: BannerItem[];
};

export default function HomeHeader({ items }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const { width } = useWindowDimensions();
  const bannerSidePadding = 8;
  const bannerWidth = width - 20 - bannerSidePadding * 2;
  const [bannerIndex, setBannerIndex] = useState(0);

  return (
    <View style={styles.root}>
      <View style={styles.heroContent}>
        <Text variant="caption" 
        weight='bold'
        
        >
          {t('greeting')}
        </Text>
        <Text
          variant="subtitle"
          weight="bold"
          style={{ fontSize: typography.size.xl, lineHeight: typography.lineHeight.lg }}
        >
          {t('home_question')}
        </Text>
      </View>

      <View style={[styles.bannerWrapper, { width: bannerWidth + bannerSidePadding * 2 }]}> 
        <BannerSwiper
          data={items}
          renderItem={({ item }) => (
            <View style={{ width: bannerWidth, marginHorizontal: bannerSidePadding }}>
              <Card style={[styles.bannerCard, { backgroundColor: colors.primary }]}> 
                <View style={styles.bannerContent}>
                  <Text variant="caption" color={colors.white} style={styles.bannerLabel}>
                    {item.discountLabel}
                  </Text>
                  <Text variant="subtitle" weight="semiBold" color={colors.white} style={styles.bannerTitle}>
                    {item.title}
                  </Text>
                  <Text variant="caption" color={colors.white} style={styles.bannerDescription}>
                    {item.description}
                  </Text>
                </View>
                <Text variant="subtitle" weight="bold" color={colors.white} style={styles.bannerPercent}>
                  {item.percent}
                </Text>
              </Card>
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
                { backgroundColor: index === bannerIndex ? colors.mutedText : colors.border },
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  heroContent: {
    paddingTop: 6,
    gap: 8,
  },
  bannerWrapper: {
    alignSelf: 'center',
  },
  bannerSwiper: {
    marginTop: 8,
  },
  bannerCard: {
    padding: 22,
    minHeight: 124,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 18,
  },
  bannerLabel: {
    opacity: 0.98,
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: 19,
    lineHeight: 25,
    marginTop: 2,
    fontWeight: '700',
  },
  bannerContent: {
    flex: 1,
    gap: 6,
  },
  bannerDescription: {
    maxWidth: 210,
    opacity: 0.95,
    lineHeight: 18,
    marginTop: 14,
  },
  bannerPercent: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  bannerDot: {
    height: 6,
    borderRadius: 999,
  },
  bannerDotActive: {
    width: 16,
  },
  bannerDotInactive: {
    width: 6,
  },
});
