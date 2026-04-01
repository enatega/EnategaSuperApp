import type {
  OrderAgainCartReferenceInput,
  ProductInfoCartReferenceInput,
  ShopTypeProductCartReferenceInput,
  StoreDetailsProductCartReferenceInput,
} from './cartProductTypes';
import type { CartProductReference } from './cartProductTypes';

const FALLBACK_CARD_SOURCE = 'shopTypeProduct';

export function mapShopTypeProductToCartReference(
  product: ShopTypeProductCartReferenceInput,
): CartProductReference {
  return {
    source: product.source ?? FALLBACK_CARD_SOURCE,
    productId: product.productId,
    storeId: product.storeId ?? null,
    name: product.productName,
    description: null,
    imageUrl: product.productImage ?? product.storeImage ?? product.storeLogo ?? null,
    basePrice: product.price ?? null,
  };
}

export function mapOrderAgainItemToCartReference(
  item: OrderAgainCartReferenceInput,
): CartProductReference {
  return {
    source: 'orderAgain',
    productId: item.productId,
    storeId: item.storeId ?? null,
    name: item.productName,
    description: item.storeName ?? null,
    imageUrl: item.productImage ?? item.storeImage ?? item.storeLogo ?? null,
    basePrice: item.price ?? null,
  };
}

export function mapStoreDetailsProductToCartReference({
  product,
  storeId,
}: StoreDetailsProductCartReferenceInput): CartProductReference {
  return {
    source: 'storeDetailsProduct',
    productId: product.id,
    storeId: storeId ?? null,
    name: product.name,
    description: product.shortDescription ?? product.description ?? null,
    imageUrl: product.imageUrl ?? null,
    basePrice: product.price ?? null,
  };
}

export function mapProductInfoToCartReference(
  product: ProductInfoCartReferenceInput,
): CartProductReference {
  return {
    source: 'productInfo',
    productId: product.productId,
    storeId: product.storeId ?? null,
    name: product.name,
    description: product.description ?? null,
    imageUrl: product.imageUrl ?? null,
    basePrice: product.price ?? null,
  };
}
