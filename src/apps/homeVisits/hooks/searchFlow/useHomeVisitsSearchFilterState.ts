import { useMemo, useState } from 'react';
import type { SearchFilters } from '../../../../general/components/search/types';
import type { HomeVisitsFilterChip } from '../../components/filters/types';

const DEFAULT_FILTERS: SearchFilters = {
  sortBy: 'best_match',
  ratings: null,
  availability: null,
};

type Params = {
  t: (key: string, options?: Record<string, unknown>) => string;
};

export default function useHomeVisitsSearchFilterState({ t }: Params) {
  const [isFilterSheetVisible, setFilterSheetVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

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

  const selectSortBy = (sortBy: SearchFilters['sortBy']) => {
    setDraftFilters((prev) => ({ ...prev, sortBy }));
  };

  const selectRatings = (ratings: number | null) => {
    setDraftFilters((prev) => ({ ...prev, ratings }));
  };

  const selectAvailability = (availability: SearchFilters['availability']) => {
    setDraftFilters((prev) => ({ ...prev, availability }));
  };

  const chips = useMemo<HomeVisitsFilterChip[]>(() => {
    const next: HomeVisitsFilterChip[] = [];

    // Only show chips for applied filters, not draft filters
    if (appliedFilters.sortBy !== 'best_match') {
      next.push({ 
        id: 'sortBy', 
        label: t(`search_filter_sort_${appliedFilters.sortBy}`) 
      });
    }

    if (appliedFilters.ratings !== null) {
      next.push({ 
        id: 'ratings', 
        label: `${appliedFilters.ratings}+ ${t('search_filter_stars')}` 
      });
    }

    if (appliedFilters.availability !== null) {
      next.push({ 
        id: 'availability', 
        label: t(`search_filter_availability_${appliedFilters.availability}`) 
      });
    }

    return next;
  }, [appliedFilters, t]); // Only depend on appliedFilters, not draftFilters

  const removeChip = (chip: HomeVisitsFilterChip) => {
    if (chip.id === 'sortBy') {
      setAppliedFilters((prev) => ({ ...prev, sortBy: 'best_match' }));
      setDraftFilters((prev) => ({ ...prev, sortBy: 'best_match' }));
      return;
    }

    if (chip.id === 'ratings') {
      setAppliedFilters((prev) => ({ ...prev, ratings: null }));
      setDraftFilters((prev) => ({ ...prev, ratings: null }));
      return;
    }

    if (chip.id === 'availability') {
      setAppliedFilters((prev) => ({ ...prev, availability: null }));
      setDraftFilters((prev) => ({ ...prev, availability: null }));
    }
  };

  const hasAppliedFilters =
    appliedFilters.sortBy !== 'best_match' ||
    appliedFilters.ratings !== null ||
    appliedFilters.availability !== null;

  const hasDraftFilters =
    draftFilters.sortBy !== 'best_match' ||
    draftFilters.ratings !== null ||
    draftFilters.availability !== null;

  return {
    appliedFilters,
    draftFilters,
    isFilterSheetVisible,
    openFilters,
    closeFilters,
    applyFilters,
    clearDraftFilters,
    clearAllFilters,
    selectSortBy,
    selectRatings,
    selectAvailability,
    chips,
    removeChip,
    hasAppliedFilters,
    hasDraftFilters,
  };
}