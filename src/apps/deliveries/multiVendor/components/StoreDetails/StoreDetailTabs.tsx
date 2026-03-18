import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import type { DeliveryStoreDetailsFilterItem } from '../../../api/types';

type Props = {
  activeCategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
  onSelect: (categoryId: string) => void;
};

export default function StoreDetailTabs({ activeCategoryId, categories, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;

          return (
            <Pressable
              key={category.id}
              onPress={() => onSelect(category.id)}
              style={[
                styles.tab,
                isActive && {
                  backgroundColor: colors.blue100,
                  borderBottomColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.primary : colors.mutedText },
                ]}
                weight="medium"
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  content: {
    minWidth: '100%',
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    minWidth: 78,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
  },
});
