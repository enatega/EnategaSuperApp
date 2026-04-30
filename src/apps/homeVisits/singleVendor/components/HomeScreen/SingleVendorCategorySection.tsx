import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategoryResultsSection,
} from '../../../../../general/components/discovery';
import DiscoveryCategoryCard from '../../../../../general/components/discovery/DiscoveryCategoryCard';
import DiscoveryCategorySkeleton from '../../../../../general/components/discovery/DiscoveryCategorySkeleton';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useTheme } from '../../../../../general/theme/theme';
import useSingleVendorCategories from '../../hooks/useSingleVendorCategories';
import useSingleVendorCategoryServiceSections from '../../hooks/useSingleVendorCategoryServiceSections';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../navigation/types';
import ServicesCard from '../../../components/ServicesCard';

const CATEGORY_COLOR_TOKENS = ['cardPeach', 'cardLavender', 'cardMint', 'cardBlue'] as const;

export default function SingleVendorCategorySection() {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const { data = [], isPending } = useSingleVendorCategories();
  const serviceSections = useSingleVendorCategoryServiceSections(data);

  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('SingleVendorCategoriesSeeAll');
  }, [navigation]);

  const handleCategorySeeAllPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate('SeeAllScreen', {
        scope: 'single-vendor',
        queryType: 'category-services',
        title: categoryName,
        cardType: 'service',
        categoryId,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.content}>
      <View style={styles.categorySection}>
        <SectionActionHeader
          actionLabel={t('single_vendor_see_all')}
          title={t('single_vendor_categories_title')}
          onActionPress={handleSeeAllPress}
        />

        {isPending ? (
          <DiscoveryCategorySkeleton />
        ) : (
          <HorizontalList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item, index }) => (
              <DiscoveryCategoryCard
                imageUrl={item.imageUrl}
                title={item.name}
                onPress={() => handleCategorySeeAllPress(item.id, item.name)}
                imageWrapStyle={{
                  backgroundColor:
                    colors[CATEGORY_COLOR_TOKENS[index % CATEGORY_COLOR_TOKENS.length]],
                }}
              />
            )}
          />
        )}
      </View>

      {serviceSections.map(
        ({ category, data: services = [], error, isPending: isServicesPending }) => (
          <View key={category.id} style={styles.resultSection}>
            <DiscoveryCategoryResultsSection
              title={category.name}
              items={services}
              hasError={Boolean(error)}
              isLoading={isServicesPending}
              actionLabel={t('single_vendor_see_all')}
              keyExtractor={(item) => `${item.productId}-${item.serviceCenterId}`}
              renderItem={(item) => <ServicesCard item={item} />}
              onActionPress={() => handleCategorySeeAllPress(category.id, category.name)}
              emptyState={{
                title: t('single_vendor_home_section_empty_title'),
                message: t('single_vendor_category_services_empty'),
              }}
              errorState={{
                title: t('single_vendor_home_section_error_title'),
                message: t('single_vendor_home_section_error_message'),
              }}
            />
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  categorySection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  content: {
    gap: 12,
  },
  listContent: {
    paddingRight: 16,
  },
  resultSection: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
