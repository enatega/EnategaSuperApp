import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryOrderAgainItem } from '../../api/types';
import CartRecommendationCard from './CartRecommendationCard';

type Props = {
  items: DeliveryOrderAgainItem[];
  onItemPress: (productId: string) => void;
};

export default function CartRecommendationsSection({ items, onItemPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.h5,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {t('cart_recommended_title')}
      </Text>

      <ScrollView
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item) => (
          <CartRecommendationCard
            item={item}
            key={item.productId}
            onPress={() => onItemPress(item.productId)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    gap: 12,
  },
});
