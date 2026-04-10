import { useState } from 'react';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';
import type { DeliveryDealsTabType } from '../../api/dealsServiceTypes';
import { useFilterValues } from '../../hooks';
import useGenericListFilters from '../../hooks/filterablePaginatedList/useGenericListFilters';
import type { DealsSeeAllSource } from '../../navigation/types';

export default function useDealsSeeAllScreenState(
  source: DealsSeeAllSource,
) {
  const isMultiVendorSource = source === 'multi-vendor';
  const { data: filterValues } = useFilterValues({
    enabled: isMultiVendorSource,
  });
  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] =
    useState<DeliveryDealsTabType>('all');
  const debouncedSearch = useDebouncedValue(searchText.trim(), 450);
  const filterState = useGenericListFilters({
    filterData: isMultiVendorSource ? filterValues?.filters : undefined,
  });

  return {
    filterValues,
    searchText,
    setSearchText,
    selectedTab,
    setSelectedTab,
    debouncedSearch,
    isMultiVendorSource,
    ...filterState,
  };
}
