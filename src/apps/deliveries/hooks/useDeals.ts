import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiError } from "../../../general/api/apiClient";
import { dealsService } from "../api/dealsService";
import type { DeliveryDealItem } from "../api/dealsServiceTypes";
import { deliveryKeys } from "../api/queryKeys";
import type { PaginatedDeliveryResponse } from "../api/types";
import useAddress from "../../../general/hooks/useAddress";
import type { UseDealsOptions } from "./useDealsTypes";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeCategoryIds(categorySelections?: string[]) {
  if (!categorySelections?.length) {
    return undefined;
  }

  const validCategoryIds = categorySelections
    .map((categorySelection) => categorySelection.trim())
    .filter(Boolean)
    .filter((categoryId) => UUID_PATTERN.test(categoryId));

  return validCategoryIds.length > 0
    ? Array.from(new Set(validCategoryIds))
    : undefined;
}

export default function useDeals(options?: UseDealsOptions) {
  const mode = options?.mode ?? "preview";
  const limit = 10;
  const { latitude, longitude } = useAddress();
  const normalizedSearch = options?.search?.trim() ?? "";
  const requestParams = {
    // ...options?.requestParams,
    // latitude: options?.requestParams?.latitude ?? latitude,
    // longitude: options?.requestParams?.longitude ?? longitude,
    // category_ids: normalizeCategoryIds(options?.filters?.category_ids),
    price_tiers: options?.filters?.price_tiers
      ? [options.filters.price_tiers]
      : undefined,
    sort_by: options?.filters?.sort_by ?? undefined,
  };

  const query = useInfiniteQuery<
    PaginatedDeliveryResponse<DeliveryDealItem>,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.dealsListing({
        limit,
        search: normalizedSearch,
        tab: options?.tab ?? "all",
      }),
      {
        filters: options?.filters,
        mode,
        requestParams,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      dealsService.getDealsPage({
        offset: pageParam as number,
        limit,
        search: normalizedSearch || undefined,
        tab: options?.tab ?? "all",
        ...requestParams,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: mode === "preview" ? items.slice(0, limit) : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
