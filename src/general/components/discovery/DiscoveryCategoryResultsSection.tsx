import React from 'react';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../HorizontalList';
import SectionActionHeader from '../SectionActionHeader';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import DiscoveryResultsSkeleton from './DiscoveryResultsSkeleton';
import DiscoverySectionState from './DiscoverySectionState';

type StateCopy = {
  message?: string;
  title?: string;
};

type Props<T> = {
  title: string;
  items: T[];
  isLoading: boolean;
  hasError: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  renderItem: (item: T) => ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  loadingComponent?: ReactNode;
  emptyState?: StateCopy;
  errorState?: StateCopy;
};

export default function DiscoveryCategoryResultsSection<T>({
  title,
  items,
  isLoading,
  hasError,
  actionLabel,
  onActionPress,
  renderItem,
  keyExtractor,
  loadingComponent,
  emptyState,
  errorState,
}: Props<T>) {
  const { typography } = useTheme();
  const isEmpty = !isLoading && !hasError && items.length === 0;

  return (
    <View style={styles.section}>
      {actionLabel ? (
        <SectionActionHeader
          actionLabel={actionLabel}
          onActionPress={onActionPress}
          title={title}
        />
      ) : (
        <Text
          weight="extraBold"
          style={{
            fontSize: typography.size.h5,
            letterSpacing: -0.36,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {title}
        </Text>
      )}

      {isLoading ? (
        loadingComponent ?? <DiscoveryResultsSkeleton />
      ) : hasError ? (
        <DiscoverySectionState
          tone="error"
          title={errorState?.title}
          message={errorState?.message}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={emptyState?.title}
          message={emptyState?.message}
        />
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => renderItem(item)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
  },
  separator: {
    width: 12,
  },
});
