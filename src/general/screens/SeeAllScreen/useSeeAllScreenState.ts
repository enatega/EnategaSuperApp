import { useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';

export default function useSeeAllScreenState() {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText.trim(), 500);

  return {
    searchText,
    setSearchText,
    debouncedSearch,
  };
}
