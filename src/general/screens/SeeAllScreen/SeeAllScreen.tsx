import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GenericFilterablePaginatedListScreen,
  type FilterChip,
  type GenericFilterablePaginatedListScreenProps,
} from '../../components/filterablePaginatedList';

type Props<TItem, TChip extends FilterChip = FilterChip> =
  GenericFilterablePaginatedListScreenProps<TItem, TChip>;

export default function SeeAllScreen<TItem, TChip extends FilterChip = FilterChip>(
  props: Props<TItem, TChip>,
) {
  return (
    <View style={styles.screen}>
      <GenericFilterablePaginatedListScreen {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
