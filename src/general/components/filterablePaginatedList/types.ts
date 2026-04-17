import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type QueryBuilderContext<TPageParam, TFilters = Record<string, unknown>> = {
  filters: TFilters;
  pageParam: TPageParam;
  staticParams?: Record<string, unknown>;
};

export type SupportedCardType =
  | 'store'
  | 'product'
  | 'top-brand'
  | 'shop-type';

export type FilterChip = {
  id: string;
  label: string;
};

export type GenericListQueryConfig<
  TItem,
  TResponse,
  TQueryParams extends object,
  TPageParam,
  TFilters = Record<string, unknown>,
> = {
  queryKey: readonly unknown[];
  queryFn: (params: TQueryParams) => Promise<TResponse>;
  buildQueryParams?: (
    context: QueryBuilderContext<TPageParam, TFilters>,
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

export type GenericListHookParams<TFilters = Record<string, unknown>> = {
  filters: TFilters;
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
  renderSearchInput: (params: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    editable: boolean;
  }) => ReactNode;
};

export type GenericFilterablePaginatedListScreenProps<
  TItem,
  TChip extends FilterChip = FilterChip,
> = {
  title: string;
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
  chips?: TChip[];
  clearAllLabel?: string;
  onRemoveChip?: (chip: TChip) => void;
  onClearAll?: () => void;
  renderSelectedFilters?: (params: {
    chips: TChip[];
    clearAllLabel: string;
    onRemoveChip: (chip: TChip) => void;
    onClearAll: () => void;
  }) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingComponent?: ReactNode;
  paginationLoadingComponent?: ReactNode;
  header?: ReactNode;
  filterSheet?: ReactNode;
  listContentContainerStyle?: StyleProp<ViewStyle>;
  renderItemCard: (item: TItem) => ReactElement | null;
};
