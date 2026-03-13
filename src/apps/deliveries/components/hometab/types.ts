import type { DeliveryNearbyStore } from '../../api/types';

export interface NearbyStoreListProps {
  onRestaurantPress?: (store: DeliveryNearbyStore) => void;
}
