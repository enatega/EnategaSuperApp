import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryOrderAgainItem } from '../../api/types';
import CartActionControl from '../cart/CartActionControl';
import CartCountBadge from '../cart/CartCountBadge';
import type { ProductCardControlState } from './types';

type Props = {
  onPress: () => void;
  product: DeliveryOrderAgainItem;
  state: ProductCardControlState;
};

export default function OrderAgainProductCard({ onPress, product, state }: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const imageUri =
    product.productImage?.trim() ||
    product.storeImage?.trim() ||
    product.storeLogo?.trim() ||
    'https://placehold.co/400x400.png';
  const formattedPrice =
    typeof product.price === 'number'
      ? `€ ${product.price.toFixed(2)}`
      : t('multi_vendor_order_again_price_unavailable');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

        {product.deal ? (
          <View style={[styles.badge, { backgroundColor: colors.blue800 }]}>
            <Icon type="Feather" name="tag" size={12} color={colors.white} />
            <Text
              color={colors.white}
              weight="medium"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {product.deal}
            </Text>
          </View>
        ) : null}

        <View style={styles.action}>
          <CartActionControl
            accessibilityLabel={t('multi_vendor_order_again_add_item')}
            count={state.controlCount}
            disabled={state.isDisabled}
            mode={state.controlMode}
            onAdd={state.handleAdd}
            onDecrement={state.handleDecrement}
            onIncrement={state.handleIncrement}
            size="small"
          />
        </View>

        {state.shouldShowCountBadge ? (
          <CartCountBadge count={state.totalQuantity} style={styles.countBadge} />
        ) : null}
      </View>

      <View style={styles.content}>
        <Text
          weight="medium"
          color={colors.primary}
          style={{
            fontSize: typography.size.xxs,
            lineHeight: typography.lineHeight.xxs,
          }}
        >
          {formattedPrice}
        </Text>

        <Text
          weight="semiBold"
          numberOfLines={1}
          style={{
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {product.productName}
        </Text>

        {product.storeName ? (
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={{
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.xxs,
            }}
          >
            {product.storeName}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 4,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: 6,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: 120,
  },
  content: {
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  countBadge: {
    left: 6,
    position: 'absolute',
    top: 42,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageWrapper: {
    height: 76,
    overflow: 'hidden',
    position: 'relative',
  },
});
