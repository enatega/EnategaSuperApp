import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import type { DeliveryStoreDetailsFilterItem } from '../../../api/types';
import { useStoreDetailTabsScroll } from '../../hooks/useStoreDetailPager';

type Props = {
  activeCategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
  onSelect: (categoryId: string | null) => void;
};

export default function StoreDetailTabs({ activeCategoryId, categories, onSelect }: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation('deliveries');
  const isOffersActive = !activeCategoryId;
  const { registerTabLayout, scrollViewRef } = useStoreDetailTabsScroll({
    activeCategoryId,
    screenWidth: width,
  });

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          onLayout={(event) => {
            const { width: tabWidth, x } = event.nativeEvent.layout;
            registerTabLayout(null, { width: tabWidth, x });
          }}
          onPress={() => onSelect(null)}
          style={[
            styles.tab,
            isOffersActive && {
              backgroundColor: colors.blue100,
              borderBottomColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: isOffersActive ? colors.primary : colors.mutedText },
            ]}
            weight="medium"
          >
            {t('store_details_tab_offers')}
          </Text>
        </Pressable>

        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;

          return (
            <Pressable
              key={category.id}
              onLayout={(event) => {
                const { width: tabWidth, x } = event.nativeEvent.layout;
                registerTabLayout(category.id, { width: tabWidth, x });
              }}
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
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
  },
});
