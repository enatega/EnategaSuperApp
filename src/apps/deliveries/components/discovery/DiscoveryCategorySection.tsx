import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import DiscoveryCategoryCard from './DiscoveryCategoryCard';
import DiscoveryCategorySkeleton from './DiscoveryCategorySkeleton';
import type { DeliveryDiscoveryCategoryItem } from './types';

type Props = {
  items: DeliveryDiscoveryCategoryItem[];
  isPending: boolean;
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onItemPress?: (item: DeliveryDiscoveryCategoryItem) => void;
};

export default function DiscoveryCategorySection({
  items,
  isPending,
  title,
  actionLabel,
  onActionPress,
  onItemPress,
}: Props) {
  const { typography } = useTheme();

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
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <DiscoveryCategoryCard
              imageUrl={item.imageUrl}
              title={item.name}
              onPress={onItemPress ? () => onItemPress(item) : undefined}
            />
          )}
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
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
