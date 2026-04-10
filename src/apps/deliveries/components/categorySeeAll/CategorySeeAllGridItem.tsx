import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import { DiscoveryCategoryCard } from '../discovery';
import type { DeliveryDiscoveryCategoryItem } from '../discovery';

type Props = {
  item: DeliveryDiscoveryCategoryItem;
  onPress: (item: DeliveryDiscoveryCategoryItem) => void;
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
    height: '100%',
    width: '100%',
  },
  imageWrap: {
    borderRadius: 14,
    height: 112,
    padding: 12,
    width: 112,
  },
  item: {
    width: '31%',
  },
});
