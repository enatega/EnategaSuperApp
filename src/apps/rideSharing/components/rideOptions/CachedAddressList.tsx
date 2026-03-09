import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { CachedAddress } from './types';
import CachedAddressRow from './CachedAddressRow';

type Props = {
  data: CachedAddress[];
  onSelect?: (item: CachedAddress) => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
  showsVerticalScrollIndicator?: boolean;
};

function CachedAddressList({
  data,
  onSelect,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
}: Props) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CachedAddress>) => (
      <CachedAddressRow item={item} onPress={onSelect} />
    ),
    [onSelect],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.placeId}
      renderItem={renderItem}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerStyle={[
        styles.content,
        data.length === 0 ? styles.emptyContent : null,
        contentContainerStyle,
      ]}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

export default memo(CachedAddressList);

const styles = StyleSheet.create({
  content: {
    paddingBottom: 12,
  },
  emptyContent: {
    flexGrow: 1,
  },
});
