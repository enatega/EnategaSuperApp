import React from "react";
import SearchMainContainer from "../../../../../general/components/search/SearchMainContainer";
import useMultiVendorSearchFlow from "../../hooks/useMultiVendorSearchFlow";
import SearchResults from "../../../components/search/SearchResults";

export default function MultiVendorSearchContainer() {
  const searchFlow = useMultiVendorSearchFlow();
  return (
    <SearchMainContainer {...searchFlow}>
      <SearchResults
        isSearchActive={searchFlow?.isSearchActive}
        shouldSearchStores={searchFlow?.shouldSearchStores}
        isSearchLoading={searchFlow?.isSearchLoading}
        hasNoResults={searchFlow?.hasNoResults}
        products={searchFlow?.products}
        stores={searchFlow?.stores}
        isFetchingMoreProducts={searchFlow?.isFetchingMoreProducts}
        isFetchingMoreStores={searchFlow?.isFetchingMoreStores}
        onLoadMoreProducts={searchFlow?.handleLoadMoreProducts}
        onLoadMoreStores={searchFlow?.handleLoadMoreStores}
      />
    </SearchMainContainer>
  );
}
