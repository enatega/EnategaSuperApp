import React from 'react';
import SearchMainContainer from '../../../components/search/SearchMainContainer';
import useChainSearchFlow from '../../hooks/useChainSearchFlow';

export default function ChainSearchContainer() {
  return <SearchMainContainer {...useChainSearchFlow()} />;
}
