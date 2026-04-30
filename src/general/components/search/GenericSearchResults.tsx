import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import EmptySearch from './EmptySearch';

export type GenericSearchResultsProps = {
  isSearchActive: boolean;
  isSearchLoading: boolean;
  hasNoResults: boolean;
  children?: ReactNode;
  skeletonComponent?: ReactNode;
};

export default function GenericSearchResults({
  isSearchActive,
  isSearchLoading,
  hasNoResults,
  children,
  skeletonComponent,
}: GenericSearchResultsProps) {
  if (!isSearchActive) {
    return null;
  }

  if (isSearchLoading) {
    return skeletonComponent || null;
  }

  if (hasNoResults) {
    return (
      <View style={styles.emptyContainer}>
        <EmptySearch />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  emptyContainer: {
    minHeight: 320,
    justifyContent: 'center',
  },
});