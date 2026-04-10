import type { GenericListFilters } from "../components/filters/types";
import type { DeliveryDealsListingParams } from "../api/dealsServiceTypes";

export type UseDealsMode = "preview" | "paginated";

export type UseDealsOptions = {
  mode?: UseDealsMode;
  enabled?: boolean;
  search?: string;
  tab?: DeliveryDealsListingParams["tab"];
  filters?: GenericListFilters;
  requestParams?: Omit<
    DeliveryDealsListingParams,
    "offset" | "limit" | "search" | "tab"
  >;
};
