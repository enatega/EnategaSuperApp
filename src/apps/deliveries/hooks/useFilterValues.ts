import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { filterService } from '../api/filterService';
import { deliveryKeys } from '../api/queryKeys';
import type { DeliveryProductFilterValues } from '../api/types';

type UseFilterValuesOptions = {
  enabled?: boolean;
  storeId?: string;
};

export function useFilterValues(options?: UseFilterValuesOptions) {
  return useQuery<DeliveryProductFilterValues, ApiError>({
    queryKey: deliveryKeys.filterValues(options?.storeId),
    queryFn: () =>
      filterService.getRestaurantProductFilterValues({
        storeId: options?.storeId,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
}
