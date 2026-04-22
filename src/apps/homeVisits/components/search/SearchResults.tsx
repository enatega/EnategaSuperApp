import React from 'react';
import { StyleSheet, View } from 'react-native';
import GenericSearchResults from '../../../../general/components/search/GenericSearchResults';
import SearchResultsSkeleton from './SearchResultsSkeleton';
import ServiceCardScroller from "./ServiceCardScroller"
import type { SearchResultsProps } from './types';

export default function SearchResults({
  isSearchActive,
  shouldSearchServiceCenters,
  isSearchLoading,
  hasNoResults,
  services,
  serviceCenters,
  isFetchingMoreServices,
  isFetchingMoreServiceCenters,
  onLoadMoreServices,
  onLoadMoreServiceCenters,
  horizontal = false
}: SearchResultsProps) {
  const skeletonComponent = <SearchResultsSkeleton showServiceCenters={shouldSearchServiceCenters} />;
  
  const resultsContent = (
    <>
      {services.length > 0 ? (
        <View style={styles.section}>
          <ServiceCardScroller
            services={services}
            onLoadMore={onLoadMoreServices}
            isLoadingMore={isFetchingMoreServices}
            horizontal={horizontal}
          />
        </View>
      ) : null}

      {/* Service Centers section commented out for now */}
      {/* {shouldSearchServiceCenters && serviceCenters.length > 0 ? (
        <View style={styles.section}>
          <ServiceCenterCardScroller
            serviceCenters={serviceCenters}
            onLoadMore={onLoadMoreServiceCenters}
            isLoadingMore={isFetchingMoreServiceCenters}
          />
        </View>
      ) : null} */}
    </>
  );

  return (
    <GenericSearchResults
      isSearchActive={isSearchActive}
      isSearchLoading={isSearchLoading}
      hasNoResults={hasNoResults}
      skeletonComponent={skeletonComponent}
    >
      {(services.length > 0 || serviceCenters.length > 0) ? resultsContent : null}
    </GenericSearchResults>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
});
