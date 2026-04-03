import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchInput from '../../../components/search/SearchInput';
import Image from '../../../../../general/components/Image';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import StoreDetailActionButton from './StoreDetailActionButton';
import FavouriteHeartButton from '../favourites/FavouriteHeartButton';
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
  onFavouritePress: () => void;
  onInfoPress: () => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  phone?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  isFavourite?: boolean;
  isFavouriteLoading?: boolean;
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
  onFavouritePress,
  onInfoPress,
  onSearchChange,
  onSubcategorySelect,
  phone,
  rating,
  reviewCount,
  isFavourite = false,
  isFavouriteLoading = false,
  searchValue,
  sectionTitle,
  storeName,
  subcategories,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const showsCategories = categories.length > 0;
  const showsSubcategories = subcategories.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: coverImageUrl }}
          style={[styles.heroImage, { backgroundColor: colors.storeHeroPrimary }]}
        >
          <View
            style={[
              styles.heroContent,
              {
                backgroundColor: colors.storeHeroOverlay,
                paddingTop: insets.top + 12,
              },
            ]}
          >
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
                  onPress={onInfoPress}
                />
                <FavouriteHeartButton
                  accessibilityLabel={t('store_details_action_favorite')}
                  isFavourite={isFavourite}
                  isLoading={isFavouriteLoading}
                  onPress={onFavouritePress}
                  style={styles.favButton}
                />
                <StoreDetailActionButton
                  accessibilityLabel={t('store_details_action_share')}
                  iconName="share-2"
                  iconType="Feather"
                />
              </View>
            </View>

            {heroTitle.trim() ? (
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
            ) : null}
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
    marginBottom: 52,
  },
  heroImage: {
    height: 316,
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 30,
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
  favButton: {
    position: 'relative',
    top: undefined,
    right: undefined,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroTitle: {
    letterSpacing: -0.8,
    maxWidth: 232,
    paddingBottom: 18,
  },
  logoCard: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 96,
    justifyContent: 'center',
    marginTop: -48,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: 96,
  },
  logoImage: {
    height: '100%',
    width: '100%',
  },
  content: {
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  storeName: {
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  filters: {
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subcategoryContainer: {
    paddingTop: 6,
  },
  sectionHeader: {
    // paddingVertical: 6,
  },
  sectionTitle: {
    letterSpacing: -0.36,
    paddingTop: 18,
    paddingBottom: 12,
  },
});
