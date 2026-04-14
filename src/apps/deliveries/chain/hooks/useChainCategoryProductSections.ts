import {
  useQueries,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type { DeliveryShopTypeProduct } from '../../api/types';
import type { DeliveryDiscoveryCategoryItem } from '../../components/discovery';
import { chainMenuTemplateService } from '../api/menuTemplateService';

type ChainCategoryProductSectionResult = UseQueryResult<
  DeliveryShopTypeProduct[],
  ApiError
> & {
  category: DeliveryDiscoveryCategoryItem;
};

const FEATURED_CHAIN_CATEGORIES_LIMIT = 5;
const CHAIN_CATEGORY_PRODUCTS_LIMIT = 10;

export default function useChainCategoryProductSections(
  categories: DeliveryDiscoveryCategoryItem[],
  menuTemplateId: string | null,
): ChainCategoryProductSectionResult[] {
  const featuredCategories = categories.slice(0, FEATURED_CHAIN_CATEGORIES_LIMIT);
  const results = useQueries({
    queries: featuredCategories.map((category) => ({
      queryKey: [
        ...deliveryKeys.chainMenuCategoryProducts(
          menuTemplateId ?? 'unknown',
          category.id,
          0,
          CHAIN_CATEGORY_PRODUCTS_LIMIT,
        ),
        { scope: 'featured-section' },
      ],
      queryFn: () =>
        chainMenuTemplateService.getMenuCategoryProducts({
          menuTemplateId: menuTemplateId as string,
          categoryId: category.id,
          limit: CHAIN_CATEGORY_PRODUCTS_LIMIT,
        }),
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(menuTemplateId && category.id),
    })),
  }) as UseQueryResult<DeliveryShopTypeProduct[], ApiError>[];

  return featuredCategories.map((category, index) => ({
    category,
    ...results[index],
  }));
}
