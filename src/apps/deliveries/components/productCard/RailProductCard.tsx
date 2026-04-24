import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryShopTypeProduct } from '../../api/types';
import CartCountBadge from '../cart/CartCountBadge';
import StoreDeliveryInfo from '../storeCard/subComponents/StoreDeliveryInfo';
import StoreImage from '../storeCard/subComponents/StoreImage';
import StoreInfo from '../storeCard/subComponents/StoreInfo';
import StoreRating from '../storeCard/subComponents/StoreRating';
import { styles as storeCardStyles } from '../storeCard/styles';
import type { ProductCardControlState } from './types';
import { useTranslations } from '../../../../general/localization/LocalizationProvider';

type Props = {
  isFullWidth?: boolean;
  onPress: () => void;
  product: DeliveryShopTypeProduct;
  state: ProductCardControlState;
};

export default function RailProductCard({
  isFullWidth = false,
  onPress,
  product,
  state,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslations('deliveries')
  const imageUrl =
    product.productImage ??
    product.storeImage ??
    product.storeLogo ??
    'https://placehold.co/400x400.png';
  
  const resolvedOffer = product?.dealType === 'percentage' ? product?.dealAmount + ' % ' + t("off") : product?.dealAmount + t('off');

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        storeCardStyles.container,
        isFullWidth
          ? storeCardStyles.fullWidthContainer
          : storeCardStyles.compactContainer,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <StoreImage
        actionSlot={state.shouldShowCountBadge ? (
          <CartCountBadge count={state.totalQuantity} style={styles.countBadge} />
        ) : undefined}
        imageUrl={imageUrl}
        offer={resolvedOffer ?? undefined}
      />

      <View style={storeCardStyles.content}>
        <StoreInfo name={product.productName} />
        <StoreRating
          rating={product.averageRating ?? undefined}
          reviewCount={product.reviewCount ?? undefined}
          cuisine={product.storeName ?? undefined}
        />
        <View style={[storeCardStyles.line, { backgroundColor: colors.border }]} />
        <StoreDeliveryInfo
          price={product.price ?? 0}
          deliveryTime={product.deliveryTime ?? ''}
          distance={product.distanceKm ?? 0}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  countBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
});
