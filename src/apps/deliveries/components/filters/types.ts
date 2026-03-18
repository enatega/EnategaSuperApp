import type { IconType } from "../../../../general/components/Icon";

export type FilterOption = {
  id: string;
  label: string;
};

export type AddressFilterOption = {
  id: string;
  label: string;
  description?: string;
  iconName?: string;
  iconType?: IconType;
};

export type GenericListFilters = {
  categoryIds: string[];
  priceId: string | null;
  addressId: string | null;
  sortId: string | null;
};

export type GenericListFilterGroup = {
  categoryOptions?: FilterOption[];
  priceOptions?: FilterOption[];
  addressOptions?: AddressFilterOption[];
  sortOptions?: FilterOption[];
};

export type GenericFilterChip = {
  id: string;
  label: string;
};

export type GenericListFilterSheetRenderProps = {
  visible: boolean;
  draftFilters: GenericListFilters;
  resultCount?: number;
  isApplyDisabled: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectPrice: (priceId: string) => void;
  onSelectAddress: (addressId: string) => void;
  onSelectSort: (sortId: string) => void;
  clearAllLabel: string;
};
