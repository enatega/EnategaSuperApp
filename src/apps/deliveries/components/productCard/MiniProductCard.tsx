import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import CartCountBadge from '../cart/CartCountBadge';
import type { SearchProductItem } from '../../api/searchServiceTypes';
import type { DeliveryShopTypeProduct } from '../../api/types';
import type { ProductCardControlState } from './types';

type Props = {
  onPress: () => void;
  product: SearchProductItem | DeliveryShopTypeProduct;
  state: ProductCardControlState;
};

export default function MiniProductCard({ onPress, product, state }: Props) {
  const { colors, typography } = useTheme();
  const imageUri =
    product.productImage ??
    ('storeImage' in product ? product.storeImage ?? null : null) ??
    ('storeLogo' in product ? product.storeLogo ?? null : null) ??
    undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageUri ? { uri: imageUri } : undefined}
          style={styles.image}
          resizeMode="cover"
        />
        {state.shouldShowCountBadge ? (
          <CartCountBadge count={state.totalQuantity} style={styles.countBadge} />
        ) : null}
      </View>

      <Text
        weight="semiBold"
        style={{
          color: colors.text,
          fontSize: typography.size.xxs,
          lineHeight: 12,
        }}
        numberOfLines={2}
      >
        {product.productName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    borderRadius: 8,
    padding: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 6,
  },
  countBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
});
