import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../../../general/components/discovery';
import useSingleVendorCategories from '../../hooks/useSingleVendorCategories';
import useSingleVendorCategoryServiceSections from '../../hooks/useSingleVendorCategoryServiceSections';
import ServicesCard from '../../../components/ServicesCard';


export default function SingleVendorCategorySection() {
  const { t } = useTranslation('homeVisits');
  const { data = [], isPending } = useSingleVendorCategories();
  const serviceSections = useSingleVendorCategoryServiceSections(data);

  return (
    <View style={styles.content}>
      <DiscoveryCategorySection
        items={data}
        isPending={isPending}
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
              keyExtractor={(item) => `${item.productId}-${item.serviceCenterId}`}
              renderItem={(item) => <ServicesCard item={item} />}
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
