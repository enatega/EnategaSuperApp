import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../HorizontalList';
import SectionActionHeader from '../SectionActionHeader';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import DiscoveryCategoryCard from './DiscoveryCategoryCard';
import DiscoveryCategorySkeleton from './DiscoveryCategorySkeleton';
import type { DiscoveryCategoryItem } from './types';

type Props = {
  items: DiscoveryCategoryItem[];
  isPending: boolean;
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onItemPress?: (item: DiscoveryCategoryItem) => void;
  numberOfRows?: number;
};

export default function DiscoveryCategorySection({
  items,
  isPending,
  title,
  actionLabel,
  onActionPress,
  onItemPress,
  numberOfRows = 1,
}: Props) {
  const { typography } = useTheme();
  const columns = useMemo(() => {
    const result: DiscoveryCategoryItem[][] = [];

    for (let index = 0; index < items.length; index += numberOfRows) {
      result.push(items.slice(index, index + numberOfRows));
    }

    return result;
  }, [items, numberOfRows]);

  return (
    <View style={styles.section}>
      {actionLabel ? (
        <SectionActionHeader
          actionLabel={actionLabel}
          title={title}
          onActionPress={onActionPress}
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

      {isPending ? (
        <DiscoveryCategorySkeleton />
      ) : (
        <HorizontalList
          data={columns}
          keyExtractor={(column) => column[0].id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: column }) => (
            <View style={styles.column}>
              {column.map((item) => (
                <DiscoveryCategoryCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  title={item.name}
                  onPress={onItemPress ? () => onItemPress(item) : undefined}
                />
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    gap: 12,
  },
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
