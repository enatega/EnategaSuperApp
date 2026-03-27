import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import type { DeliveryStoreDetailsFilterItem } from '../../../api/types';

type Props = {
  activeSubcategoryId: string | null;
  onSelect: (subcategoryId: string) => void;
  subcategories: DeliveryStoreDetailsFilterItem[];
};

export default function StoreDetailSubcategory({
  activeSubcategoryId,
  onSelect,
  subcategories,
}: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {subcategories.map((subcategory) => {
        const isActive = subcategory.id === activeSubcategoryId;

        return (
          <Pressable
            key={subcategory.id}
            onPress={() => onSelect(subcategory.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.blue100 : colors.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.text : colors.mutedText },
              ]}
              weight="medium"
            >
              {subcategory.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
  },
});
