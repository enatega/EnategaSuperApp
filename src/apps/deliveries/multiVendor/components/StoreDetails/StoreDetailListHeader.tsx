import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SearchInput from '../../../components/search/SearchInput';
import Image from '../../../../../general/components/Image';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import StoreDetailActionButton from './StoreDetailActionButton';
import StoreDetailInfoRow from './StoreDetailInfoRow';
import StoreDetailSubcategory from './StoreDetailSubcategory';
import StoreDetailTabs from './StoreDetailTabs';
import type {
  DeliveryStoreDetailsFilterItem,
} from '../../../api/types';
import { typography } from '../../../../../general/theme/typography';

type Props = {
  activeCategoryId: string | null;
  activeSubcategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
  coverImageUrl: string;
  deliveryFee?: string | null;
  distance?: string | null;
  email?: string | null;
  heroTitle: string;
  hours?: string | null;
  logoImageUrl: string;
  onBackPress: () => void;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  phone?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  searchValue: string;
  sectionTitle: string;
  storeName: string;
  subcategories: DeliveryStoreDetailsFilterItem[];
  onSearchChange: (value: string) => void;
};

export default function StoreDetailListHeader({
  activeCategoryId,
  activeSubcategoryId,
  categories,
  coverImageUrl,
  deliveryFee,
  distance,
  email,
  heroTitle,
  hours,
  logoImageUrl,
  onBackPress,
  onCategorySelect,
  onSearchChange,
  onSubcategorySelect,
  phone,
  rating,
  reviewCount,
  searchValue,
  sectionTitle,
  storeName,
  subcategories,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const showsCategories = categories.length > 0;
  const showsSubcategories = subcategories.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: coverImageUrl }}
          style={[styles.heroImage, { backgroundColor: colors.storeHeroPrimary }]}
        >
          <View style={[styles.heroContent, { backgroundColor: colors.storeHeroOverlay }]}>
            <View style={styles.headerRow}>
              <StoreDetailActionButton
                accessibilityLabel={t('store_details_action_back')}
                iconName="arrow-back"
                onPress={onBackPress}
              />

              <View style={styles.actionGroup}>
                <StoreDetailActionButton
                  accessibilityLabel={t('store_details_action_info')}
                  iconName="info"
                  iconType="Feather"
                />
                <StoreDetailActionButton
                  accessibilityLabel={t('store_details_action_favorite')}
                  iconName="heart-outline"
                />
                <StoreDetailActionButton
                  accessibilityLabel={t('store_details_action_share')}
                  iconName="share-2"
                  iconType="Feather"
                />
              </View>
            </View>

            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.white,
                  fontSize: typography.size.xxl + 8,
                  lineHeight: 40,
                },
              ]}
              weight="extraBold"
            >
              {heroTitle}
            </Text>
          </View>
        </ImageBackground>

        <View
          style={[
            styles.logoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceSoft,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Image resizeMode="cover" source={{ uri: logoImageUrl }} style={styles.logoImage} />
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.storeName, { color: colors.text, fontSize: typography.size.h5 }]}
          weight="extraBold"
        >
          {storeName}
        </Text>

        <StoreDetailInfoRow
          deliveryFee={deliveryFee}
          distance={distance}
          email={email}
          hours={hours}
          phone={phone}
          rating={rating}
          reviewCount={reviewCount}
        />

        <SearchInput
          onChangeText={onSearchChange}
          placeholder={t('store_details_search_placeholder')}
          value={searchValue}
        />
      </View>

      <View style={styles.filters}>
        {showsCategories ? (
          <StoreDetailTabs
            activeCategoryId={activeCategoryId}
            categories={categories}
            onSelect={onCategorySelect}
          />
        ) : null}

        {showsSubcategories ? (
          <View style={styles.subcategoryContainer}>
            <StoreDetailSubcategory
              activeSubcategoryId={activeSubcategoryId}
              onSelect={onSubcategorySelect}
              subcategories={subcategories}
            />
          </View>
        ) : null}

        {!showsSubcategories ? (
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: typography.size.h5 },
              ]}
              weight="extraBold"
            >
              {sectionTitle}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  heroContainer: {
    marginBottom: 44,
  },
  heroImage: {
    height: 240,
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: typography?.lineHeight?.xl,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  heroTitle: {
    letterSpacing: -0.8,
    maxWidth: 220,
    paddingBottom: 70,
  },
  logoCard: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 88,
    justifyContent: 'center',
    marginTop: -44,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: 88,
  },
  logoImage: {
    height: '100%',
    width: '100%',
  },
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  storeName: {
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  filters: {
    gap: 4,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  subcategoryContainer: {
    paddingVertical: 4,
  },
  sectionHeader: {
    paddingTop: 4,
  },
  sectionTitle: {
    letterSpacing: -0.36,
  },
});
