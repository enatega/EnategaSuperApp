import { useCallback, useMemo, useState } from 'react';
import type {
  GenericFilterChip,
  GenericListFilterGroup,
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
  filterOptions?: GenericListFilterGroup;
  initialFilters?: Partial<GenericListFilters>;
};

export default function useGenericListFilters({ filterOptions, initialFilters }: Props) {
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
      const isSelected = current.categoryIds.includes(categoryId);

      return {
        ...current,
        categoryIds: isSelected
          ? current.categoryIds.filter((id) => id !== categoryId)
          : [...current.categoryIds, categoryId],
      };
    });
  }, []);

  const selectPrice = useCallback((priceId: string) => {
    setDraftFilters((current) => ({
      ...current,
      priceId: current.priceId === priceId ? null : priceId,
    }));
  }, []);

  const selectAddress = useCallback((addressId: string) => {
    setDraftFilters((current) => ({
      ...current,
      addressId: current.addressId === addressId ? null : addressId,
    }));
  }, []);

  const selectSort = useCallback((sortId: string) => {
    setDraftFilters((current) => ({
      ...current,
      sortId: current.sortId === sortId ? null : sortId,
    }));
  }, []);

  const removeChip = useCallback((chip: GenericFilterChip) => {
    setAppliedFilters((current) => removeChipFromFilters(current, chip.id));
  }, []);

  const chips = useMemo(
    () => buildFilterChips(appliedFilters, filterOptions),
    [appliedFilters, filterOptions],
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
    selectSort,
    removeChip,
    chips,
    hasAppliedFilters: hasActiveFilters(appliedFilters),
    hasDraftFilters: hasActiveFilters(draftFilters),
  };
}
