import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryDealItem } from '../../api/dealsServiceTypes';
import type { DeliveryStoreDetailsProduct } from '../../api/types';
import CartActionControl from '../cart/CartActionControl';
import CartCountBadge from '../cart/CartCountBadge';
import type { ProductCardControlState } from './types';

type Props = {
  onPress: () => void;
  product: DeliveryStoreDetailsProduct | DeliveryDealItem;
  state: ProductCardControlState;
};

function formatPrice(price?: number | null) {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : null;
}

export default function StoreMenuProductCard({ onPress, product, state }: Props) {
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();
  const badgeText = product.deal ?? product.dealType ?? null;
  const priceLabel = formatPrice(product.price);
  const productImageUri = product.imageUrl || 'https://placehold.co/400x400.png';
  const imageBackgroundColor = badgeText
    ? colors.storeMenuAccentOrange
    : colors.storeMenuAccentLime;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={[styles.imageArea, { backgroundColor: imageBackgroundColor }]}>
          <Image
            resizeMode="cover"
            source={{ uri: productImageUri }}
            style={styles.backgroundImage}
          />

          <View style={styles.header}>
            <View style={styles.badgeSlot}>
              {badgeText ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Icon color={colors.white} name="pricetag-outline" size={11} type="Ionicons" />
                  <Text style={[styles.badgeText, { color: colors.white }]} weight="medium">
                    {badgeText}
                  </Text>
                </View>
              ) : null}
            </View>

            <CartActionControl
              accessibilityLabel={t('store_details_add_product', { item: product.name })}
              count={state.controlCount}
              disabled={state.isDisabled}
              mode={state.controlMode}
              onAdd={state.handleAdd}
              onDecrement={state.handleDecrement}
              onIncrement={state.handleIncrement}
              size="medium"
              style={styles.action}
            />
          </View>

          {state.shouldShowCountBadge ? (
            <CartCountBadge count={state.totalQuantity} style={styles.countBadge} />
          ) : null}
        </View>

        <View style={styles.content}>
          {priceLabel ? (
            <Text style={[styles.price, { color: colors.primary }]} weight="medium">
              {priceLabel}
            </Text>
          ) : null}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} weight="semiBold">
            {product.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    flexShrink: 0,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeSlot: {
    flex: 1,
    paddingRight: 8,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  container: {
    flexShrink: 0,
    marginVertical: 6,
    width: '48%',
  },
  content: {
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  countBadge: {
    bottom: 8,
    left: 10,
    position: 'absolute',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageArea: {
    aspectRatio: 1.15,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  price: {
    fontSize: 12,
    lineHeight: 18,
  },
  title: {
    fontSize: 14,
    lineHeight: 22,
  },
});
