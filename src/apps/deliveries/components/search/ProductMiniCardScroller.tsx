import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { typography } from '../../../../general/theme/typography';
import { useTheme } from '../../../../general/theme/theme';
import ProductCard from '../productCard/ProductCard';
import { ProductMiniCardScrollerProps } from './types';

export default function ProductMiniCardScroller({
  products,
  onSeeAllPress,
  onProductPress,
  onLoadMore,
}: ProductMiniCardScrollerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <>
      <View style={styles.header}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t('products')}
        </Text>
        {onSeeAllPress ? (
          <TouchableOpacity
            style={[styles.seeAllButton, { backgroundColor: colors.blue100 }]}
            onPress={onSeeAllPress}
            activeOpacity={0.7}
          >
            <Text
              variant="body"
              weight="medium"
              style={{ color: colors.text, fontSize: typography.size.sm2 }}
            >
              {t('see_all')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            variant="mini"
            onPress={onProductPress ? () => onProductPress(item) : undefined}
          />
        )}
        keyExtractor={(item) => item.productId}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 1,
  },
  separator: {
    width: 12,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
