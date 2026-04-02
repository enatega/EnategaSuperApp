import type { SearchProductItem } from '../../api/searchServiceTypes';
import type {
  DeliveryOrderAgainItem,
  DeliveryShopTypeProduct,
  DeliveryStoreDetailsProduct,
} from '../../api/types';
import type { DeliveryProductActionTarget } from '../../cart/productActionTypes';

export type ProductCardVariant = 'mini' | 'orderAgain' | 'rail' | 'storeMenu';

export type ProductCardData =
  | SearchProductItem
  | DeliveryShopTypeProduct
  | DeliveryOrderAgainItem
  | DeliveryStoreDetailsProduct;

export type ProductCardActionOverrides = {
  onOpenProduct?: (target: DeliveryProductActionTarget) => void;
  onRequestCartAction?: (target: DeliveryProductActionTarget) => void;
};

export type ProductCardControlState = {
  controlCount: number;
  controlMode: 'add' | 'quantity';
  handleAdd: () => void;
  handleDecrement?: () => void;
  handleIncrement?: () => void;
  isDisabled: boolean;
  shouldShowCountBadge: boolean;
  totalQuantity: number;
};

export function isStoreDetailsProduct(
  product: ProductCardData,
): product is DeliveryStoreDetailsProduct {
  return 'id' in product && 'name' in product && !('productId' in product);
}
