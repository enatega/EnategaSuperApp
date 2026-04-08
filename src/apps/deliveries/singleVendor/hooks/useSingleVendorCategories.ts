import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type { DeliveryDiscoveryCategoryItem } from '../../components/discovery';
import { singleVendorDiscoveryService } from '../api/discoveryService';
import type { SingleVendorCategoriesApiResponse } from '../api/types';

const SINGLE_VENDOR_CATEGORIES_LIMIT = 10;

export default function useSingleVendorCategories() {
  return useQuery<
    SingleVendorCategoriesApiResponse,
    ApiError,
    DeliveryDiscoveryCategoryItem[]
  >({
    queryKey: deliveryKeys.singleVendorCategories({
      limit: SINGLE_VENDOR_CATEGORIES_LIMIT,
    }),
    queryFn: () =>
      singleVendorDiscoveryService.getCategoriesPage({
        limit: SINGLE_VENDOR_CATEGORIES_LIMIT,
      }),
    staleTime: 5 * 60 * 1000,
    select: (response) =>
      response.items.map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl ?? null,
      })),
  });
}
