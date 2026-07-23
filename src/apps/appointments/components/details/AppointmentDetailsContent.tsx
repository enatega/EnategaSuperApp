import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentStoreCategory, AppointmentStoreService } from '../../api/types';
import type { AdditionalInfoItem, OpeningDay, ReviewPreview, TeamMember } from './detailTypes';
import AppointmentDetailsBottomBar from './AppointmentDetailsBottomBar';
import AppointmentDetailsFooter from './AppointmentDetailsFooter';
import AppointmentDetailsHeader from './AppointmentDetailsHeader';
import AppointmentDetailsPageSkeleton from './AppointmentDetailsPageSkeleton';
import AppointmentDetailsServiceCardSkeleton from './AppointmentDetailsServiceCardSkeleton';
import AppointmentDetailsServiceRow from './AppointmentDetailsServiceRow';
import AppointmentsFloatingCartButton from '../cart/AppointmentsFloatingCartButton';

type DetailListItem = { type: 'service'; item: AppointmentStoreService } | { type: 'footer' };

type Props = {
  additionalInfoItems: AdditionalInfoItem[];
  address: string;
  bookNowDisabled: boolean;
  canShowSeeAllServices: boolean;
  coverImageUrl: string;
  hoursFallback: string;
  insets: EdgeInsets;
  isFavourite: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  isStorePending: boolean;
  isStoreRefetching: boolean;
  isServicesSectionLoading: boolean;
  listData: DetailListItem[];
  onBackPress: () => void;
  onBookingAttempt: () => void;
  onCategorySelect: (value: string | null) => void;
  onContactPress: () => void;
  onEndReached: () => void;
  onFavouritePress: () => void;
  onOpenDirections: () => void;
  onRefresh: () => Promise<void>;
  onServicePress?: (service: AppointmentStoreService) => void;
  onSharePress: () => void;
  onShowAllServices: () => void;
  onShowAllTeam?: () => void;
  onSubcategorySelect: (value: string | null) => void;
  openingDays: OpeningDay[];
  openUntilLabel: string;
  rating: string | null;
  ratingLabel: string;
  reviewCount: number;
  reviewPreviews: ReviewPreview[];
  selectedCategoryId: string | null;
  selectedSubcategoryId: string | null;
  services: AppointmentStoreService[];
  servicesCount: number;
  shouldShowServiceSkeletons: boolean;
  showLoadError: boolean;
  storeClosed: boolean;
  storeError: boolean;
  storeViewAvailable: boolean;
  teamMembers: TeamMember[];
  title: string;
  topCategories: AppointmentStoreCategory[];
  visibleSubcategories: AppointmentStoreCategory[];
  about: string;
};

export default function AppointmentDetailsContent({
  about,
  additionalInfoItems,
  address,
  bookNowDisabled,
  canShowSeeAllServices,
  coverImageUrl,
  hoursFallback,
  insets,
  isFavourite,
  isFetchingNextPage,
  isRefetching,
  isStorePending,
  isStoreRefetching,
  isServicesSectionLoading,
  listData,
  onBackPress,
  onBookingAttempt,
  onCategorySelect,
  onContactPress,
  onEndReached,
  onFavouritePress,
  onOpenDirections,
  onRefresh,
  onServicePress,
  onSharePress,
  onShowAllServices,
  onShowAllTeam,
  onSubcategorySelect,
  openingDays,
  openUntilLabel,
  rating,
  ratingLabel,
  reviewCount,
  reviewPreviews,
  selectedCategoryId,
  selectedSubcategoryId,
  services,
  servicesCount,
  shouldShowServiceSkeletons,
  showLoadError,
  storeClosed,
  storeError,
  storeViewAvailable,
  teamMembers,
  title,
  topCategories,
  visibleSubcategories,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');

  if (isStorePending && !storeViewAvailable) {
    return <AppointmentDetailsPageSkeleton insets={insets} />;
  }

  if (storeError && !storeViewAvailable) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('details_load_error')}</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        ListEmptyComponent={
          shouldShowServiceSkeletons || isServicesSectionLoading ? (
            <View style={styles.servicesList}>
              {Array.from({ length: 4 }).map((_, index) => (
                <AppointmentDetailsServiceCardSkeleton key={`service-skeleton-${index}`} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ color: colors.mutedText }}>
                {showLoadError ? t('details_load_error') : t('details_services_empty')}
              </Text>
            </View>
          )
        }
        ListHeaderComponent={
          <AppointmentDetailsHeader
            address={address}
            categories={topCategories}
            coverImageUrl={coverImageUrl}
            insets={insets}
            isFavourite={isFavourite}
            onBackPress={onBackPress}
            onCategorySelect={onCategorySelect}
            onContactPress={onContactPress}
            onFavouritePress={onFavouritePress}
            onSharePress={onSharePress}
            onSubcategorySelect={onSubcategorySelect}
            openUntilLabel={openUntilLabel}
            ratingLabel={ratingLabel}
            selectedCategoryId={selectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            title={title}
            visibleSubcategories={visibleSubcategories}
          />
        }
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 108 + insets.bottom }]}
        data={isServicesSectionLoading ? [] : listData}
        keyExtractor={(item, index) => (item.type === 'service' ? item.item.id : `footer-${index}`)}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={(isStoreRefetching || isRefetching) && !isStorePending}
            onRefresh={() => {
              void onRefresh();
            }}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) =>
          item.type === 'service' ? (
            <AppointmentDetailsServiceRow item={item.item} onPress={onServicePress} />
          ) : (
            <AppointmentDetailsFooter
              about={about}
              additionalInfoItems={additionalInfoItems}
              address={address}
              canShowSeeAllServices={canShowSeeAllServices}
              hoursFallback={hoursFallback}
              isFetchingNextPage={isFetchingNextPage}
              onOpenDirections={onOpenDirections}
              onShowAllServices={onShowAllServices}
              onShowAllTeam={onShowAllTeam}
              openingDays={openingDays}
              rating={rating}
              reviewCount={reviewCount}
              reviewPreviews={reviewPreviews}
              servicesCount={servicesCount}
              teamMembers={teamMembers}
            />
          )
        }
        showsVerticalScrollIndicator={false}
      />

      <AppointmentDetailsBottomBar
        bookNowDisabled={bookNowDisabled}
        insets={insets}
        onPress={onBookingAttempt}
        servicesCount={services.length}
        storeClosed={storeClosed}
      />
      <AppointmentsFloatingCartButton style={styles.cartButton} />
    </>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cartButton: {
    bottom: 102,
    position: 'absolute',
    right: 20,
  },
  contentContainer: {
    paddingBottom: 28,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  servicesList: {
    paddingTop: 2,
  },
});
