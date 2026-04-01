import type {
  DeliveryOrderAgainItem,
  DeliveryShopTypeProduct,
  DeliveryStoreDetailsProduct,
} from '../api/types';
import type { ProductInfoResponse } from '../api/productInfoServiceTypes';
import type { CartSelectionInput } from '../api/cartServiceTypes';

export type CartProductSource =
  | 'productInfo'
  | 'productMiniCard'
  | 'shopTypeProduct'
  | 'storeDetailsProduct'
  | 'orderAgain';

export type CartProductReference = {
  source: CartProductSource;
  productId: string;
  storeId: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  basePrice: number | null;
};

export type ConfiguredCartProductReference = CartProductReference & {
  quantity?: number;
  selectedOptions?: CartSelectionInput[];
};

export type ShopTypeProductCartReferenceInput = DeliveryShopTypeProduct & {
  source?: Extract<CartProductSource, 'productMiniCard' | 'shopTypeProduct'>;
};

export type StoreDetailsProductCartReferenceInput = {
  product: DeliveryStoreDetailsProduct;
  storeId?: string | null;
};

export type OrderAgainCartReferenceInput = DeliveryOrderAgainItem;

export type ProductInfoCartReferenceInput = ProductInfoResponse;
