import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';

export interface DeliveryDiscoveryCategoryItem {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export type DiscoveryCategoryResultCardType = 'store' | 'product';

export type DiscoveryCategoryResultItem =
  | DeliveryNearbyStore
  | DeliveryShopTypeProduct;
