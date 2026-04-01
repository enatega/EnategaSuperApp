import type { SearchProductItem } from '../api/searchServiceTypes';
import type { DeliveryProductActionTarget } from './productActionTypes';
import {
  mapOrderAgainItemToCartReference,
  mapProductInfoToCartReference,
  mapShopTypeProductToCartReference,
  mapStoreDetailsProductToCartReference,
} from './cartProductMappers';
import type {
  OrderAgainCartReferenceInput,
  ProductInfoCartReferenceInput,
  ShopTypeProductCartReferenceInput,
  StoreDetailsProductCartReferenceInput,
} from './cartProductTypes';

export function mapShopTypeProductToProductActionTarget(
  product: ShopTypeProductCartReferenceInput,
): DeliveryProductActionTarget {
  return {
    ...mapShopTypeProductToCartReference(product),
    storeName: product.storeName ?? null,
  };
}

export function mapSearchProductToProductActionTarget(
  product: SearchProductItem,
): DeliveryProductActionTarget {
  return {
    ...mapShopTypeProductToCartReference({
      ...product,
      source: 'productMiniCard',
    }),
    storeName: product.storeName ?? null,
  };
}

export function mapOrderAgainItemToProductActionTarget(
  item: OrderAgainCartReferenceInput,
): DeliveryProductActionTarget {
  return {
    ...mapOrderAgainItemToCartReference(item),
    storeName: item.storeName ?? null,
  };
}

export function mapStoreDetailsProductToProductActionTarget(
  input: StoreDetailsProductCartReferenceInput,
): DeliveryProductActionTarget {
  return {
    ...mapStoreDetailsProductToCartReference(input),
    storeName: null,
  };
}

export function mapProductInfoToProductActionTarget(
  product: ProductInfoCartReferenceInput,
): DeliveryProductActionTarget {
  return {
    ...mapProductInfoToCartReference(product),
    storeName: null,
  };
}
