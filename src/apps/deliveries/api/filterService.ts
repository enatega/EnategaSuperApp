import apiClient from '../../../general/api/apiClient';
import type { DeliveryProductFilterValues } from './types';

const FILTERS_BASE = '/api/v1/apps/deliveries/restaurant-products/filter';

type DeliveryFilterValuesParams = {
  storeId?: string;
  categoryId?: string;
};

export const filterService = {
  getRestaurantProductFilterValues: (
    params: DeliveryFilterValuesParams = {},
  ): Promise<DeliveryProductFilterValues> =>
    apiClient.get<DeliveryProductFilterValues>(`${FILTERS_BASE}/values`, {
      store_id: params.storeId,
      category_id: params.categoryId,
    }),
};
