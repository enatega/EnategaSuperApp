import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  GenericFilterChip,
  GenericListFilters,
} from '../filters/types';

export type QueryBuilderContext<TPageParam> = {
  filters: GenericListFilters;
  pageParam: TPageParam;
  staticParams?: Record<string, unknown>;
};

export type SupportedCardType =
  | 'store'
  | 'product'
  | 'top-brand'
  | 'shop-type';

export type GenericListQueryConfig<
  TItem,
  TResponse,
  TQueryParams extends object,
  TPageParam,
> = {
  queryKey: readonly unknown[];
  queryFn: (params: TQueryParams) => Promise<TResponse>;
  buildQueryParams?: (
    context: QueryBuilderContext<TPageParam>,
  ) => TQueryParams;
  extractItemsFromResponse: (response: TResponse) => TItem[];
  extractNextPageParam: (
    lastPage: TResponse,
    allPages: TResponse[],
  ) => TPageParam | undefined;
  extractTotalCountFromResponse?: (response: TResponse) => number | undefined;
  initialPageParam: TPageParam;
  staticParams?: Record<string, unknown>;
  enabled?: boolean;
};

export type GenericListHookResult<TItem> = {
  data: TItem[];
  totalCount?: number;
  isPending: boolean;
  isError: boolean;
  error?: Error | null;
  refetch: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown> | unknown;
  isRefetching: boolean;
};

export type GenericListHookParams = {
  filters: GenericListFilters;
  search: string;
};

export type GenericListSearchProps = {
  placeholder?: string;
  value?: string;
  onPress?: () => void;
  isEditable?: boolean;
  debounceMs?: number;
};

export type GenericListHeaderRenderProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChangeText: (text: string) => void;
  onSearchPress?: () => void;
  isSearchEditable: boolean;
  onOpenFilters: () => void;
  onMapPress: () => void;
  isSearchVisible: boolean;
  isFilterVisible: boolean;
  isMapVisible: boolean;
};

export type GenericFilterablePaginatedListScreenProps<
  TItem,
  TCardType extends SupportedCardType,
> = {
  title: string;
  cardType: TCardType;
  data: TItem[];
  totalCount?: number;
  isPending: boolean;
  isError: boolean;
  error?: Error | null;
  refetch: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown> | unknown;
  isRefetching: boolean;
  itemKeyExtractor?: (item: TItem, index: number) => string;
  chips?: GenericFilterChip[];
  clearAllLabel?: string;
  onRemoveChip?: (chip: GenericFilterChip) => void;
  onClearAll?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingComponent?: ReactNode;
  paginationLoadingComponent?: ReactNode;
  header?: ReactNode;
  filterSheet?: ReactNode;
  listContentContainerStyle?: StyleProp<ViewStyle>;
  onItemPress?: (item: TItem) => void;
  estimatedItemSize?: number;
};
