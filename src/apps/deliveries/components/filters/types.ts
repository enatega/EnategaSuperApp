import type { DeliveryProductFilterValues } from "../../api/types";

export type GenericListFilters = {
  category_ids: string[];
  price_tiers: string | null;
  address_id: string | null;
  stock: string | null;
  sort_by: string | null;
};

export type GenericListFilterData = DeliveryProductFilterValues["filters"];

export type GenericFilterChip = {
  id: string;
  label: string;
};

export type GenericListFilterSheetRenderProps = {
  visible: boolean;
  draftFilters: GenericListFilters;
  isApplyDisabled: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectPrice: (priceTier: string) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectStock: (stock: string) => void;
  onSelectSort: (sortBy: string) => void;
};
