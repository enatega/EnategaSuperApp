import { useMemo, useState } from 'react';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';
import type {
  HomeVisitsFilterChip,
  HomeVisitsSeeAllFilters,
  HomeVisitsSeeAllSortBy,
  HomeVisitsSeeAllStock,
} from '../../components/filters/types';

const DEFAULT_FILTERS: HomeVisitsSeeAllFilters = {
  stock: 'all',
  priceTiers: null,
  sortBy: 'recommended',
  categoryIds: null,
  subcategoryId: null,
  tab: 'all',
};

type Params = {
  t: (key: string, options?: Record<string, unknown>) => string;
};

export default function useHomeVisitsSeeAllScreenState({ t }: Params) {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText.trim(), 400);
  const [isFilterSheetVisible, setFilterSheetVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<HomeVisitsSeeAllFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<HomeVisitsSeeAllFilters>(DEFAULT_FILTERS);

  const openFilters = () => {
    setDraftFilters(appliedFilters);
    setFilterSheetVisible(true);
  };

  const closeFilters = () => {
    setFilterSheetVisible(false);
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterSheetVisible(false);
  };

  const clearDraftFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const clearAllFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const selectStock = (value: HomeVisitsSeeAllStock) => {
    setDraftFilters((prev) => ({ ...prev, stock: value }));
  };

  const selectPriceTiers = (value: string | null) => {
    setDraftFilters((prev) => ({ ...prev, priceTiers: value }));
  };

  const selectSortBy = (sortBy: HomeVisitsSeeAllSortBy) => {
    setDraftFilters((prev) => ({ ...prev, sortBy }));
  };

  const chips = useMemo<HomeVisitsFilterChip[]>(() => {
    const next: HomeVisitsFilterChip[] = [];

    if (appliedFilters.stock !== 'all') {
      next.push({ id: 'stock', label: t('home_visits_filter_stock_in_stock') });
    }

    if (appliedFilters.priceTiers) {
      next.push({ id: 'price', label: appliedFilters.priceTiers });
    }

    if (appliedFilters.sortBy !== 'recommended') {
      next.push({ id: 'sort', label: t(`home_visits_filter_sort_${appliedFilters.sortBy}`) });
    }

    return next;
  }, [appliedFilters, t]);

  const removeChip = (chip: HomeVisitsFilterChip) => {
    if (chip.id === 'stock') {
      setAppliedFilters((prev) => ({ ...prev, stock: 'all' }));
      return;
    }

    if (chip.id === 'price') {
      setAppliedFilters((prev) => ({ ...prev, priceTiers: null }));
      return;
    }

    if (chip.id === 'sort') {
      setAppliedFilters((prev) => ({ ...prev, sortBy: 'recommended' }));
    }
  };

  const hasAppliedFilters =
    appliedFilters.stock !== 'all' ||
    appliedFilters.priceTiers !== null ||
    appliedFilters.sortBy !== 'recommended';

  const hasDraftFilters =
    draftFilters.stock !== 'all' ||
    draftFilters.priceTiers !== null ||
    draftFilters.sortBy !== 'recommended';

  return {
    searchText,
    setSearchText,
    debouncedSearch,
    isFilterSheetVisible,
    openFilters,
    closeFilters,
    applyFilters,
    clearDraftFilters,
    clearAllFilters,
    draftFilters,
    appliedFilters,
    selectStock,
    selectPriceTiers,
    selectSortBy,
    chips,
    removeChip,
    hasAppliedFilters,
    hasDraftFilters,
  };
}
