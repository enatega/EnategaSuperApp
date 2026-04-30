import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import VerticalList from '../VerticalList';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import type { FilterChip, GenericFilterablePaginatedListScreenProps } from './types';
import ListStateView from './ListStateView';

export default function GenericFilterablePaginatedListScreen<
  TItem,
  TChip extends FilterChip = FilterChip,
>({
  title,
  data,
  totalCount,
  isPending,
  isError,
  error,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isRefetching,
  itemKeyExtractor,
  chips = [],
  clearAllLabel,
  onRemoveChip,
  onClearAll,
  renderSelectedFilters,
  emptyTitle,
  emptyDescription,
  loadingComponent,
  paginationLoadingComponent,
  header,
  filterSheet,
  listContentContainerStyle,
  renderItemCard,
}: GenericFilterablePaginatedListScreenProps<TItem, TChip>) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');

  void totalCount;
  void error;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const keyExtractor = useCallback(
    (item: TItem, index: number) =>
      itemKeyExtractor ? itemKeyExtractor(item, index) : String(index),
    [itemKeyExtractor],
  );

  const renderItem = useCallback(
    ({ item }: { item: TItem }) => renderItemCard(item),
    [renderItemCard],
  );

  const items = useMemo(() => data ?? [], [data]);
  const isInitialLoading = isPending && items.length === 0;
  const hasInitialError = isError && items.length === 0;
  const isEmpty = !isInitialLoading && !isError && items.length === 0;
  const canRenderChips = chips.length > 0 && onRemoveChip && onClearAll;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      {header}
      <View style={styles.content}>
        {canRenderChips && renderSelectedFilters ? (
          renderSelectedFilters({
            chips,
            clearAllLabel: clearAllLabel ?? t('clear_all'),
            onRemoveChip,
            onClearAll,
          })
        ) : null}

        <Text
          weight="extraBold"
          style={{
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
            marginBottom: 12,
            marginTop: canRenderChips ? 16 : 4,
          }}
        >
          {title}
        </Text>

        {isInitialLoading ? (
          loadingComponent ?? <ListStateView variant="loading" />
        ) : hasInitialError ? (
          <ListStateView
            variant="error"
            title={t('generic_list_error_title')}
            description={t('generic_list_error_description')}
            actionLabel={t('generic_list_retry')}
            onActionPress={() => {
              void refetch();
            }}
          />
        ) : isEmpty ? (
          <ListStateView
            variant="empty"
            title={emptyTitle ?? t('generic_list_empty_title')}
            description={emptyDescription ?? t('generic_list_empty_description')}
          />
        ) : (
          <VerticalList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[styles.listContent, listContentContainerStyle]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.35}
            refreshing={isRefetching && !isPending}
            onRefresh={handleRefresh}
            onScrollBeginDrag={Keyboard.dismiss}
            ListFooterComponent={
              isFetchingNextPage ? (
                paginationLoadingComponent ? (
                  <View style={styles.footerContent}>{paginationLoadingComponent}</View>
                ) : (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )
              ) : null
            }
          />
        )}
      </View>

      {filterSheet}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  footerLoader: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 8,
  },
  footerContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  screen: {
    flex: 1,
  },
  separator: {
    height: 10,
  },
});
