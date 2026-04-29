import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { DiscoveryCategoryCard } from '../../../../general/components/discovery';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsSingleVendorCategory } from '../../singleVendor/api/types';

type Props = {
  item: HomeVisitsSingleVendorCategory;
  onPress: (item: HomeVisitsSingleVendorCategory) => void;
};

export default function CategorySeeAllGridItem({ item, onPress }: Props) {
  const { typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      onPress={() => onPress(item)}
      style={styles.item}
    >
      <DiscoveryCategoryCard
        imageUrl={item.imageUrl}
        title={item.name}
        containerStyle={styles.cardContainer}
        imageWrapStyle={styles.imageWrap}
        imageStyle={styles.image}
        titleStyle={{
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    width: '100%',
  },
  image: {
    borderRadius: 8,
    height: '72%',
    width: '72%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageWrap: {
    borderRadius: 14,
    height: 116,
    padding: 12,
    width: '100%',
  },
  item: {
    width: '100%',
  },
});
