import { useCallback, useMemo, useState } from 'react';
import type {
  GenericFilterChip,
  GenericListFilterData,
  GenericListFilters,
} from '../../components/filters/types';
import {
  buildFilterChips,
  createGenericListFilters,
  EMPTY_FILTERS,
  hasActiveFilters,
  removeChipFromFilters,
} from '../../components/filters/utils';

type Props = {
  filterData?: GenericListFilterData;
  initialFilters?: Partial<GenericListFilters>;
};

export default function useGenericListFilters({ filterData, initialFilters }: Props) {
  const initialState = useMemo(
    () => createGenericListFilters(initialFilters),
    [initialFilters],
  );
  const [appliedFilters, setAppliedFilters] = useState<GenericListFilters>(initialState);
  const [draftFilters, setDraftFilters] = useState<GenericListFilters>(initialState);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  const openFilters = useCallback(() => {
    setDraftFilters(appliedFilters);
    setIsFilterSheetVisible(true);
  }, [appliedFilters]);

  const closeFilters = useCallback(() => {
    setDraftFilters(appliedFilters);
    setIsFilterSheetVisible(false);
  }, [appliedFilters]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setIsFilterSheetVisible(false);
  }, [draftFilters]);

  const clearAllFilters = useCallback(() => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }, []);

  const clearDraftFilters = useCallback(() => {
    setDraftFilters(EMPTY_FILTERS);
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setDraftFilters((current) => {
      const isSelected = current.category_ids.includes(categoryId);

      return {
        ...current,
        category_ids: isSelected
          ? current.category_ids.filter((id) => id !== categoryId)
          : [...current.category_ids, categoryId],
      };
    });
  }, []);

  const selectPrice = useCallback((priceTier: string) => {
    setDraftFilters((current) => ({
      ...current,
      price_tiers: current.price_tiers === priceTier ? null : priceTier,
    }));
  }, []);

  const selectAddress = useCallback((addressId: string) => {
    setDraftFilters((current) => ({
      ...current,
      address_id: current.address_id === addressId ? null : addressId,
    }));
  }, []);

  const selectStock = useCallback((stock: string) => {
    setDraftFilters((current) => ({
      ...current,
      stock: current.stock === stock ? null : stock,
    }));
  }, []);

  const selectSort = useCallback((sortBy: string) => {
    setDraftFilters((current) => ({
      ...current,
      sort_by: current.sort_by === sortBy ? null : sortBy,
    }));
  }, []);

  const removeChip = useCallback((chip: GenericFilterChip) => {
    setAppliedFilters((current) => removeChipFromFilters(current, chip.id));
  }, []);

  const chips = useMemo(
    () => buildFilterChips(appliedFilters, filterData),
    [appliedFilters, filterData],
  );

  return {
    appliedFilters,
    draftFilters,
    isFilterSheetVisible,
    openFilters,
    closeFilters,
    applyFilters,
    clearAllFilters,
    clearDraftFilters,
    toggleCategory,
    selectPrice,
    selectAddress,
    selectStock,
    selectSort,
    removeChip,
    chips,
    hasAppliedFilters: hasActiveFilters(appliedFilters),
    hasDraftFilters: hasActiveFilters(draftFilters),
  };
}
