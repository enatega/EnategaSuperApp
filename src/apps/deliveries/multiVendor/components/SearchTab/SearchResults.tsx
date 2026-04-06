import React from 'react';
import DeliverySearchResults from '../../../components/search/SearchResults';
import type { SearchResultsProps } from '../../../components/search/types';

export default function SearchResults(props: SearchResultsProps) {
  return <DeliverySearchResults {...props} />;
}
