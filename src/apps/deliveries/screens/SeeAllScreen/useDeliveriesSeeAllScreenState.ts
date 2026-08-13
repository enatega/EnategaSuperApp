import { useState } from 'react';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';
import { useFilterValues } from '../../hooks';
import useGenericListFilters from '../../hooks/filterablePaginatedList/useGenericListFilters';

export default function useDeliveriesSeeAllScreenState(categoryId?: string) {
  const { data: filterValues } = useFilterValues({ categoryId });
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText.trim(), 500);
  const filterState = useGenericListFilters({
    filterData: filterValues?.filters,
  });

  return {
    filterValues,
    searchText,
    setSearchText,
    debouncedSearch,
    ...filterState,
  };
}
