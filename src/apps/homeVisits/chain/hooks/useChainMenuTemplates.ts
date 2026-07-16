import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsChainMenuTemplateService } from '../api/menuTemplateService';
import type {
  ChainMenuTemplate,
  ChainMenuTemplatesApiResponse,
} from '../api/types';

const CHAIN_MENU_TEMPLATES_LIMIT = 10;
const EMPTY_CHAIN_MENU_TEMPLATES: ChainMenuTemplate[] = [];

export default function useChainMenuTemplates(options?: { enabled?: boolean }) {
  const query = useQuery<ChainMenuTemplatesApiResponse, ApiError>({
    queryKey: homeVisitsKeys.chainMenuTemplates({
      limit: CHAIN_MENU_TEMPLATES_LIMIT,
    }),
    queryFn: () =>
      homeVisitsChainMenuTemplateService.getMenuTemplatesPage({
        offset: 0,
        limit: CHAIN_MENU_TEMPLATES_LIMIT,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    data: query.data?.items ?? EMPTY_CHAIN_MENU_TEMPLATES,
    totalCount: query.data?.total ?? 0,
  };
}
