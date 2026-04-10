import {
  useQueries,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type { DeliveryShopTypeProduct } from '../../api/types';
import { singleVendorDiscoveryService } from '../api/discoveryService';
import type { SingleVendorCategory } from '../api/types';

type SingleVendorCategoryProductSectionResult = UseQueryResult<
  DeliveryShopTypeProduct[],
  ApiError
> & {
  category: SingleVendorCategory;
};

const FEATURED_SINGLE_VENDOR_CATEGORIES_LIMIT = 5;
const SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT = 10;

export default function useSingleVendorCategoryProductSections(
  categories: SingleVendorCategory[],
): SingleVendorCategoryProductSectionResult[] {
  const featuredCategories = categories.slice(
    0,
    FEATURED_SINGLE_VENDOR_CATEGORIES_LIMIT,
  );
  const results = useQueries({
    queries: featuredCategories.map((category) => ({
      queryKey: [
        ...deliveryKeys.singleVendorCategoryProducts(
          category.id,
          0,
          SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT,
        ),
        { scope: 'featured-section' },
      ],
      queryFn: () =>
        singleVendorDiscoveryService.getCategoryProducts({
          categoryId: category.id,
          limit: SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT,
        }),
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(category.id),
    })),
  }) as UseQueryResult<DeliveryShopTypeProduct[], ApiError>[];

  return featuredCategories.map((category, index) => ({
    category,
    ...results[index],
  }));
}
