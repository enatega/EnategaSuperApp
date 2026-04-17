import type {
  MainListFilterData,
  MainListFilters,
} from '../../../../general/components/filters';

export type GenericListFilters = MainListFilters;

export type GenericListFilterData = MainListFilterData;

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
