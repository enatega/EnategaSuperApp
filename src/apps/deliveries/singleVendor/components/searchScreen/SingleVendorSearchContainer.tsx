import React from 'react';
import SearchMainContainer from '../../../components/search/SearchMainContainer';
import useSingleVendorSearchFlow from '../../hooks/useSingleVendorSearchFlow';

export default function SingleVendorSearchContainer() {
  return <SearchMainContainer {...useSingleVendorSearchFlow()} />;
}
