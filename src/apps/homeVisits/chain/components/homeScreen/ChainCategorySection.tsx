import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { DiscoveryCategoryResultsSection } from '../../../../../general/components/discovery';
import DiscoveryCategoryCard from '../../../../../general/components/discovery/DiscoveryCategoryCard';
import DiscoveryCategorySkeleton from '../../../../../general/components/discovery/DiscoveryCategorySkeleton';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useTheme } from '../../../../../general/theme/theme';
import ServicesCard from '../../../components/ServicesCard';
import type { ChainStackParamList } from '../../navigation/types';
import useChainCategoryServiceSections from '../../hooks/useChainCategoryServiceSections';
import useChainMenuCategories from '../../hooks/useChainMenuCategories';
import { useChainMenuStore } from '../../stores/useChainMenuStore';

type Props = {
  isTemplatePending?: boolean;
};

const CATEGORY_COLOR_TOKENS = ['cardPeach', 'cardLavender', 'cardMint', 'cardBlue'] as const;

export default function ChainCategorySection({
  isTemplatePending = false,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ChainStackParamList>>();
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );
  const { data = [], isPending } = useChainMenuCategories({
    menuTemplateId: selectedMenuTemplateId,
  });
  const serviceSections = useChainCategoryServiceSections(
    data,
    selectedMenuTemplateId,
  );

  const handleCategorySeeAllPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate('ChainSeeAll', {
        scope: 'chain',
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
          title={t('chain_categories_title')}
        />

        {isPending || isTemplatePending ? (
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
              isLoading={isTemplatePending || isServicesPending}
              actionLabel={t('single_vendor_see_all')}
              keyExtractor={(item) => `${item.productId}-${item.serviceCenterId}`}
              renderItem={(item) => (
                <ServicesCard bookingFlow="multiVendor" item={item} />
              )}
              onActionPress={() =>
                handleCategorySeeAllPress(category.id, category.name)
              }
              emptyState={{
                title: t('single_vendor_home_section_empty_title'),
                message: t('chain_category_services_empty'),
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
