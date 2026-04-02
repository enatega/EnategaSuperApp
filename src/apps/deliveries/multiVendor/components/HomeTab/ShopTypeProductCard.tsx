import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DeliveryShopTypeProduct } from '../../../api/types';
import { mapShopTypeProductToProductActionTarget } from '../../../cart/productActionMappers';
import type { DeliveryProductActionBinding } from '../../../cart/productActionTypes';
import StoreCard from '../../../components/storeCard/StoreCard';
import type { MultiVendorStackParamList } from '../../navigation/types';

type Props = {
  product: DeliveryShopTypeProduct;
  productAction?: DeliveryProductActionBinding;
};

type NavProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function ShopTypeProductCard({ product, productAction }: Props) {
  const navigation = useNavigation<NavProp>();
  const resolvedProductAction =
    productAction ??
    ({
      target: mapShopTypeProductToProductActionTarget(product),
      onOpenProduct: (target) =>
        navigation.navigate('ProductInfo', { productId: target.productId }),
    } satisfies DeliveryProductActionBinding);

  return (
    <StoreCard
      imageUrl={
        product.productImage ??
        product.storeImage ??
        product.storeLogo ??
        'https://placehold.co/400x400.png'
      }
      offer={product.deal ?? undefined}
      name={product.productName}
      cuisine={product.storeName ?? undefined}
      price={product.price ?? 0}
      rating={product.averageRating ?? undefined}
      reviewCount={product.reviewCount ?? undefined}
      deliveryTime={product.deliveryTime ?? ''}
      distance={product.distanceKm ?? 0}
      onPress={() => resolvedProductAction.onOpenProduct?.(resolvedProductAction.target)}
    />
  );
}
