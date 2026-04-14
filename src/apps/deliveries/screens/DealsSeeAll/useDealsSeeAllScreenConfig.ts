import type { ApiError } from '../../../../general/api/apiClient';
import type {
  DeliveryDealItem,
  DeliveryDealsTabType,
} from '../../api/dealsServiceTypes';
import type { DeliveryShopTypeProduct } from '../../api/types';
import type { GenericListFilters } from '../../components/filters/types';
import { useDealsListing } from '../../hooks';
import type { DealsSeeAllSource } from '../../navigation/types';
import useChainDeals from '../../chain/hooks/useChainDeals';
import useSingleVendorDeals from '../../singleVendor/hooks/useSingleVendorDeals';

type DealsSeeAllListQueryResult = {
  data: DeliveryDealItem[];
  totalCount?: number;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown> | unknown;
  isRefetching: boolean;
};

type UseDealsSeeAllScreenConfigParams = {
  source: DealsSeeAllSource;
  filters: GenericListFilters;
  search: string;
  selectedTab: DeliveryDealsTabType;
};

type UseDealsSeeAllScreenConfigResult = DealsSeeAllListQueryResult & {
  isTabsVisible: boolean;
};

function normalizeSingleVendorDealItem(
  item: DeliveryShopTypeProduct,
): DeliveryDealItem {
  return {
    dealId: `${item.productId}-${item.storeId}`,
    id: item.productId,
    name: item.productName,
    imageUrl: item.productImage,
    price: item.price,
    deal: item.deal,
    dealType: item.dealType,
    discountType: item.dealType,
    discountValue: item.dealAmount,
  };
}

function normalizeMultiVendorQuery(
  query: ReturnType<typeof useDealsListing>,
): DealsSeeAllListQueryResult {
  return {
    data: query.data ?? [],
    totalCount: query.totalCount,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isRefetching: query.isRefetching,
  };
}

function normalizeSingleVendorQuery(
  query: ReturnType<typeof useSingleVendorDeals>,
): DealsSeeAllListQueryResult {
  return {
    data: (query.data ?? []).map(normalizeSingleVendorDealItem),
    totalCount: query.totalCount,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isRefetching: query.isRefetching,
  };
}

function normalizeChainVendorQuery(
  query: ReturnType<typeof useChainDeals>,
): DealsSeeAllListQueryResult {
  return {
    data: (query.data ?? []).map(normalizeSingleVendorDealItem),
    totalCount: query.totalCount,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isRefetching: query.isRefetching,
  };
}

export default function useDealsSeeAllScreenConfig({
  source,
  filters,
  search,
  selectedTab,
}: UseDealsSeeAllScreenConfigParams): UseDealsSeeAllScreenConfigResult {
  const multiVendorQuery = useDealsListing({
    mode: 'paginated',
    enabled: source === 'multi-vendor',
    filters,
    search,
    tab: selectedTab,
  });
  const singleVendorQuery = useSingleVendorDeals({
    mode: 'paginated',
    search,
    tab: 'all',
    enabled: source === 'single-vendor',
  });
  const chainVendorQuery = useChainDeals({
    mode: 'paginated',
    search,
    tab: 'all',
    enabled: source === 'chain-vendor',
  });

  if (source === 'single-vendor') {
    return {
      ...normalizeSingleVendorQuery(singleVendorQuery),
      isTabsVisible: false,
    };
  }

  if (source === 'chain-vendor') {
    return {
      ...normalizeChainVendorQuery(chainVendorQuery),
      isTabsVisible: false,
    };
  }

  return {
    ...normalizeMultiVendorQuery(multiVendorQuery),
    isTabsVisible: true,
  };
}
