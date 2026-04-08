import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import type { DeliveryTopBrand } from '../../../api/types';
import TopBrandCard from '../../../components/storeCard/TopBrandCard';

type Props = {
  brand: DeliveryTopBrand;
  onPress: (brand: DeliveryTopBrand) => void;
};

export default function TopBrandsSeeAllItem({ brand, onPress }: Props) {
  const { typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={brand.name}
      onPress={() => onPress(brand)}
      style={styles.item}
    >
      <TopBrandCard
        brand={brand}
        cardStyle={styles.card}
        imageContainerStyle={styles.imageContainer}
        contentStyle={styles.content}
        badgeStyle={styles.badge}
        titleStyle={{
          fontSize: typography.size.md2,
          lineHeight: typography.lineHeight.md2,
        }}
        subtitleStyle={{
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.sm2,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    top: 10,
  },
  card: {
    borderRadius: 14,
    width: '100%',
  },
  content: {
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  imageContainer: {
    height: 156,
    width: '100%',
  },
  item: {
    width: '48%',
  },
});
