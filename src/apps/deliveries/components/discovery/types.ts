import type { DiscoveryCategoryItem } from '../../../../general/components/discovery';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';

export type DeliveryDiscoveryCategoryItem = DiscoveryCategoryItem;

export type DiscoveryCategoryResultCardType = 'store' | 'product';

export type DiscoveryCategoryResultItem =
  | DeliveryNearbyStore
  | DeliveryShopTypeProduct;
