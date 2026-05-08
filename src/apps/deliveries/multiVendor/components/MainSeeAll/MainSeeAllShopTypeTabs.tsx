import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { DeliveryShopType } from '../../../api/types';

type Props = {
  items: DeliveryShopType[];
  selectedShopTypeId: string | null;
  onSelectShopType: (shopTypeId: string) => void;
};

export default function MainSeeAllShopTypeTabs({
  items,
  selectedShopTypeId,
  onSelectShopType,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}> 
      <ScrollView
        horizontal
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((shopType) => {
          const isSelected = selectedShopTypeId === shopType.id;

          return (
            <Pressable
              key={shopType.id}
              onPress={() => onSelectShopType(shopType.id)}
              style={[
                styles.tab,
                {
                  borderBottomColor: isSelected ? colors.primary : 'transparent',
                },
              ]}
            >
              <Text
                weight={isSelected ? 'semiBold' : 'medium'}
                style={{
                  color: isSelected ? colors.primary : colors.mutedText,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {shopType.name}
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
    paddingHorizontal: 16,
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 3,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
});
