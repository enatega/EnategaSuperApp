import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import type { HomeVisitsMultiVendorNearbyService } from '../../multiVendor/api/types';
import { homeVisitsChainMenuTemplateService } from '../api/menuTemplateService';
import type { ChainMenuCategory } from '../api/types';

type ChainCategoryServiceSectionResult = UseQueryResult<
  HomeVisitsMultiVendorNearbyService[],
  ApiError
> & {
  category: ChainMenuCategory;
};

const FEATURED_CHAIN_CATEGORIES_LIMIT = 5;
const CHAIN_CATEGORY_SERVICES_LIMIT = 10;

export default function useChainCategoryServiceSections(
  categories: ChainMenuCategory[],
  menuTemplateId: string | null,
): ChainCategoryServiceSectionResult[] {
  const featuredCategories = categories.slice(0, FEATURED_CHAIN_CATEGORIES_LIMIT);
  const results = useQueries({
    queries: featuredCategories.map((category) => ({
      queryKey: [
        ...homeVisitsKeys.chainMenuCategoryServices(
          menuTemplateId ?? 'unknown',
          category.id,
          { limit: CHAIN_CATEGORY_SERVICES_LIMIT },
        ),
        { scope: 'featured-section' },
      ],
      queryFn: () =>
        homeVisitsChainMenuTemplateService.getMenuCategoryServices({
          menuTemplateId: menuTemplateId as string,
          categoryId: category.id,
          limit: CHAIN_CATEGORY_SERVICES_LIMIT,
        }),
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(menuTemplateId && category.id),
    })),
  }) as UseQueryResult<HomeVisitsMultiVendorNearbyService[], ApiError>[];

  return featuredCategories.map((category, index) => ({
    category,
    ...results[index],
  }));
}
