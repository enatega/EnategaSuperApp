import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import type { DeliveryDiscoveryCategoryItem } from '../../components/discovery';
import { deliveryKeys } from '../../api/queryKeys';
import { chainMenuTemplateService } from '../api/menuTemplateService';
import type {
  ChainMenuCategoriesApiResponse,
  ChainMenuCategory,
} from '../api/types';

const CHAIN_MENU_CATEGORIES_LIMIT = 10;
const EMPTY_CHAIN_MENU_CATEGORIES: DeliveryDiscoveryCategoryItem[] = [];

function mapChainMenuCategories(
  items: ChainMenuCategory[],
): DeliveryDiscoveryCategoryItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl ?? null,
  }));
}

type UseChainMenuCategoriesOptions = {
  enabled?: boolean;
  menuTemplateId?: string | null;
};

export default function useChainMenuCategories(
  options?: UseChainMenuCategoriesOptions,
) {
  const menuTemplateId = options?.menuTemplateId ?? null;

  const query = useQuery<ChainMenuCategoriesApiResponse, ApiError>({
    queryKey: deliveryKeys.chainMenuCategories(menuTemplateId ?? 'unknown', {
      offset: 0,
      limit: CHAIN_MENU_CATEGORIES_LIMIT,
    }),
    queryFn: () =>
      chainMenuTemplateService.getMenuCategoriesPage({
        menuTemplateId: menuTemplateId as string,
        offset: 0,
        limit: CHAIN_MENU_CATEGORIES_LIMIT,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(menuTemplateId) && (options?.enabled ?? true),
  });

  return {
    ...query,
    data: query.data?.items
      ? mapChainMenuCategories(query.data.items)
      : EMPTY_CHAIN_MENU_CATEGORIES,
    totalCount: query.data?.total ?? 0,
  };
}
