import React from 'react';
import SearchMainContainer from '../../../components/search/SearchMainContainer';
import useMainSearchFlow from '../../hooks/useMainSearchFlow';

export default function MultiVendorSearchContainer() {
  return <SearchMainContainer {...useMainSearchFlow()} />;
}
