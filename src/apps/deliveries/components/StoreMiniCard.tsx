import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../general/components/Image';
import Icon from '../../../general/components/Icon';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import type { DeliveryOrderAgainItem } from '../api/types';
import CartActionControl from './cart/CartActionControl';
import type { DeliveryProductActionBinding } from '../cart/productActionTypes';

type Props = {
  item: DeliveryOrderAgainItem;
  productAction?: DeliveryProductActionBinding;
};

export default function StoreMiniCard({ item, productAction }: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const imageUri =
    item.productImage?.trim() ||
    item.storeImage?.trim() ||
    item.storeLogo?.trim() ||
    'https://placehold.co/400x400.png';
  const formattedPrice =
    typeof item.price === 'number' ? `€ ${item.price.toFixed(2)}` : t('multi_vendor_order_again_price_unavailable');
  const handleCardPress = React.useCallback(() => {
    productAction?.onOpenProduct?.(productAction.target);
  }, [productAction]);
  const handleAddPress = React.useCallback(() => {
    productAction?.onRequestCartAction?.(productAction.target);
  }, [productAction]);

  return (
    <Pressable
      accessibilityRole={productAction?.onOpenProduct ? 'button' : undefined}
      disabled={!productAction?.onOpenProduct}
      onPress={handleCardPress}
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

        {item.deal ? (
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
              {item.deal}
            </Text>
          </View>
        ) : null}

        <View style={styles.addButton}>
          <CartActionControl
            accessibilityLabel={t('multi_vendor_order_again_add_item')}
            disabled={!productAction?.onRequestCartAction}
            mode="add"
            onAdd={handleAddPress}
            size="small"
          />
        </View>
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
          {item.productName}
        </Text>

        {item.storeName ? (
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={{
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.xxs,
            }}
          >
            {item.storeName}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: 120,
  },
  imageWrapper: {
    height: 76,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
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
  addButton: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  content: {
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
});
