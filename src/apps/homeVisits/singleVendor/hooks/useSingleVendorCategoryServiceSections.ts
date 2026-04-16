import {
  useQueries,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorCategory,
  HomeVisitsSingleVendorCategoryService,
} from '../api/types';

type SingleVendorCategoryServiceSectionResult = UseQueryResult<
  HomeVisitsSingleVendorCategoryService[],
  ApiError
> & {
  category: HomeVisitsSingleVendorCategory;
};

const FEATURED_SINGLE_VENDOR_CATEGORIES_LIMIT = 5;
const SINGLE_VENDOR_CATEGORY_SERVICES_LIMIT = 10;

export default function useSingleVendorCategoryServiceSections(
  categories: HomeVisitsSingleVendorCategory[],
): SingleVendorCategoryServiceSectionResult[] {
  const featuredCategories = categories.slice(
    0,
    FEATURED_SINGLE_VENDOR_CATEGORIES_LIMIT,
  );
  const results = useQueries({
    queries: featuredCategories.map((category) => ({
      queryKey: [
        ...homeVisitsKeys.singleVendorCategoryServices(
          category.id,
          0,
          SINGLE_VENDOR_CATEGORY_SERVICES_LIMIT,
        ),
        { scope: 'featured-section' },
      ],
      queryFn: () =>
        homeVisitsSingleVendorDiscoveryService.getCategoryServices({
          categoryId: category.id,
          limit: SINGLE_VENDOR_CATEGORY_SERVICES_LIMIT,
        }),
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(category.id),
    })),
  }) as UseQueryResult<HomeVisitsSingleVendorCategoryService[], ApiError>[];

  return featuredCategories.map((category, index) => ({
    category,
    ...results[index],
  }));
}
