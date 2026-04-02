import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DeliveryProductActionTarget } from '../../cart/productActionTypes';
import { useProductCardCartState } from '../../hooks/useProductCardCartState';
import type { MultiVendorStackParamList } from '../../multiVendor/navigation/types';
import type { SearchProductItem } from '../../api/searchServiceTypes';
import type {
  DeliveryOrderAgainItem,
  DeliveryShopTypeProduct,
  DeliveryStoreDetailsProduct,
} from '../../api/types';
import MiniProductCard from './MiniProductCard';
import OrderAgainProductCard from './OrderAgainProductCard';
import RailProductCard from './RailProductCard';
import StoreMenuProductCard from './StoreMenuProductCard';
import type {
  ProductCardActionOverrides,
  ProductCardData,
  ProductCardVariant,
} from './types';
import { isStoreDetailsProduct } from './types';

type Props = {
  product: ProductCardData;
  variant: ProductCardVariant;
  storeId?: string | null;
  onPress?: () => void;
  productAction?: ProductCardActionOverrides;
};

type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

function buildTarget(
  product: ProductCardData,
  variant: ProductCardVariant,
  storeId?: string | null,
): DeliveryProductActionTarget {
  if (isStoreDetailsProduct(product)) {
    return {
      source: 'storeDetailsProduct',
      productId: product.id,
      storeId: storeId ?? null,
      name: product.name,
      description: product.description ?? product.shortDescription ?? null,
      imageUrl: product.imageUrl ?? null,
      basePrice: product.price ?? null,
      storeName: null,
    };
  }

  return {
    source:
      variant === 'orderAgain'
        ? 'orderAgain'
        : variant === 'mini'
          ? 'productMiniCard'
          : 'shopTypeProduct',
    productId: product.productId,
    storeId: product.storeId ?? null,
    name: product.productName,
    description: null,
    imageUrl:
      product.productImage ??
      ('storeImage' in product ? product.storeImage ?? null : null) ??
      ('storeLogo' in product ? product.storeLogo ?? null : null),
    basePrice: product.price ?? null,
    storeName: 'storeName' in product ? product.storeName ?? null : null,
  };
}

export default function ProductCard({
  product,
  variant,
  storeId,
  onPress,
  productAction,
}: Props) {
  const navigation = useNavigation<NavigationProp>();
  const target = React.useMemo(
    () => buildTarget(product, variant, storeId),
    [product, storeId, variant],
  );
  const resolvedProductAction = React.useMemo(
    () => ({
      target,
      onOpenProduct:
        productAction?.onOpenProduct ??
        ((nextTarget: DeliveryProductActionTarget) => {
          navigation.navigate('ProductInfo', { productId: nextTarget.productId });
        }),
      onRequestCartAction: productAction?.onRequestCartAction,
    }),
    [navigation, productAction?.onOpenProduct, productAction?.onRequestCartAction, target],
  );
  const state = useProductCardCartState({ productAction: resolvedProductAction });

  const handleCardPress = React.useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }

    resolvedProductAction.onOpenProduct?.(resolvedProductAction.target);
  }, [onPress, resolvedProductAction]);

  if (variant === 'mini') {
    return (
      <MiniProductCard
        onPress={handleCardPress}
        product={product as SearchProductItem | DeliveryShopTypeProduct}
        state={state}
      />
    );
  }

  if (variant === 'orderAgain') {
    return (
      <OrderAgainProductCard
        onPress={handleCardPress}
        product={product as DeliveryOrderAgainItem}
        state={state}
      />
    );
  }

  if (variant === 'storeMenu') {
    return (
      <StoreMenuProductCard
        onPress={handleCardPress}
        product={product as DeliveryStoreDetailsProduct}
        state={state}
      />
    );
  }

  return (
    <RailProductCard
      onPress={handleCardPress}
      product={product as DeliveryShopTypeProduct}
      state={state}
    />
  );
}
