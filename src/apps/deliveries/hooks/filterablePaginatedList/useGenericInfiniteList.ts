import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../api';
import type { GenericListFilters } from '../../components/filters/types';
import { buildQueryFilterPayload } from '../../components/filters/utils';
import type { QueryBuilderContext } from '../../components/filterablePaginatedList/types';

type Props<TResponse, TQueryParams extends object, TPageParam> = {
  queryKey: readonly unknown[];
  queryFn: (params: TQueryParams) => Promise<TResponse>;
  buildQueryParams?: (
    context: QueryBuilderContext<TPageParam>,
  ) => TQueryParams;
  extractNextPageParam: (
    lastPage: TResponse,
    allPages: TResponse[],
  ) => TPageParam | undefined;
  filters: GenericListFilters;
  staticParams?: Record<string, unknown>;
  initialPageParam: TPageParam;
  enabled?: boolean;
};

export default function useGenericInfiniteList<
  TResponse,
  TQueryParams extends object,
  TPageParam,
>({
  queryKey,
  queryFn,
  buildQueryParams,
  extractNextPageParam,
  filters,
  staticParams,
  initialPageParam,
  enabled = true,
}: Props<TResponse, TQueryParams, TPageParam>) {
  return useInfiniteQuery<TResponse, ApiError>({
    queryKey: [
      ...queryKey,
      {
        filters,
        staticParams,
      },
    ],
    queryFn: ({ pageParam }) => {
      if (buildQueryParams) {
        return queryFn(
          buildQueryParams({
            filters,
            pageParam: pageParam as TPageParam,
            staticParams,
          }),
        );
      }

      return queryFn({
        ...(staticParams ?? {}),
        pageParam,
        ...buildQueryFilterPayload(filters),
      } as unknown as TQueryParams);
    },
    initialPageParam,
    getNextPageParam: (lastPage, allPages) =>
      extractNextPageParam(lastPage, allPages),
    enabled,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
