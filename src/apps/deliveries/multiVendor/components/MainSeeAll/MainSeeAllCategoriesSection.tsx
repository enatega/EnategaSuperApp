import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import {
  DiscoveryCategoryCard,
  DiscoveryCategorySkeleton,
  DiscoverySectionState,
} from '../../../components/discovery';
import type { DeliveryShopTypeCategory } from '../../../api/categoriesServicesTypes';
import { useTheme } from '../../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type Props = {
  categories: DeliveryShopTypeCategory[];
  isPending: boolean;
  isError?: boolean;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onSeeAllPress: () => void;
  sectionTitle: string;
  actionLabel: string;
};

export default function MainSeeAllCategoriesSection({
  categories,
  isPending,
  isError = false,
  selectedCategoryId,
  onSelectCategory,
  onSeeAllPress,
  sectionTitle,
  actionLabel,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const isEmpty = !isPending && !isError && categories.length === 0;

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={sectionTitle}
        actionLabel={actionLabel}
        onActionPress={onSeeAllPress}
      />

      {isPending ? (
        <DiscoveryCategorySkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('multi_vendor_home_section_error_title')}
          message={t('multi_vendor_shop_type_stores_error')}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_shop_types_empty')}
        />
      ) : (
        <HorizontalList
          data={categories}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isSelected = selectedCategoryId === item.id;
            return (
                <DiscoveryCategoryCard
                  imageUrl={item.imageUrl}
                  title={item.name}
                  onPress={() => onSelectCategory(item.id)}
                  imageWrapStyle={
                    isSelected ? { ...styles.selectedImageWrap, borderColor: colors.primary } : undefined
                  }
                  titleStyle={isSelected ? { ...styles.selectedTitle, color: colors.primary } : undefined}
                />
              );
          }}
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
  selectedImageWrap: {
    borderWidth: 2,
  },
  selectedTitle: {},
  separator: {
    width: 8,
  },
});
