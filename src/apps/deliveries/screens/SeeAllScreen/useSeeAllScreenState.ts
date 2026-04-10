import { useState } from 'react';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';
import { useFilterValues } from '../../hooks';
import useGenericListFilters from '../../hooks/filterablePaginatedList/useGenericListFilters';

export default function useSeeAllScreenState() {
  const { data: filterValues } = useFilterValues();
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
