import type { GenericListHookResult } from '../../components/filterablePaginatedList';

type Params<TItem> = {
  listQuery: GenericListHookResult<TItem>;
  itemKeyExtractor: (item: TItem, index: number) => string;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
};

export default function useSeeAllScreenConfig<TItem>({
  listQuery,
  itemKeyExtractor,
  loadingComponent,
  paginationLoadingComponent,
}: Params<TItem>) {
  return {
    listQuery,
    itemKeyExtractor,
    loadingComponent,
    paginationLoadingComponent,
  };
}
