import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../../../general/components/discovery';
import useSingleVendorCategories from '../../hooks/useSingleVendorCategories';
import useSingleVendorCategoryServiceSections from '../../hooks/useSingleVendorCategoryServiceSections';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../navigation/types';
import ServicesCard from '../../../components/ServicesCard';


export default function SingleVendorCategorySection() {
  const { t } = useTranslation('homeVisits');
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
      <DiscoveryCategorySection
        actionLabel={t('single_vendor_see_all')}
        items={data}
        isPending={isPending}
        onActionPress={handleSeeAllPress}
        title={t('single_vendor_categories_title')}
      />

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
  content: {
    gap: 12,
  },
  resultSection: {
    paddingHorizontal: 16,
  },
});
