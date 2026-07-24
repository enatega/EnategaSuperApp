import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppPopup from '../../../general/components/AppPopup';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import type {
  AppointmentProvider,
  AppointmentTopBrand,
} from '../api/types';
import type { ReviewPreview } from '../components/details/detailTypes';
import AppointmentDetailsContent from '../components/details/AppointmentDetailsContent';
import { useAppointmentDetailsScreen } from '../hooks/useAppointmentDetailsScreen';
import type { AppointmentBookingFlowParamList } from '../navigation/bookingFlowTypes';

type DetailsParams = {
  AppointmentDetailsPage:
    | {
        provider?: AppointmentProvider;
        brand?: AppointmentTopBrand;
      }
    | undefined;
};
type DetailsRouteProp = RouteProp<DetailsParams, 'AppointmentDetailsPage'>;
type NavigationProp =
  NativeStackNavigationProp<AppointmentBookingFlowParamList>;

const EMPTY_REVIEWS: ReviewPreview[] = [];

export default function AppointmentDetailsPage() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const provider = route.params?.provider;
  const brand = route.params?.brand;
  const {
    additionalInfoItems,
    address,
    bookNowDisabled,
    canShowSeeAllServices,
    coverImageUrl,
    handleBackPress,
    handleBookingAttempt,
    handleFavouritePress,
    handleOpenDirections,
    handleOpenServices,
    handleRefresh,
    handleServicePress,
    handleSharePress,
    hours,
    infoDescription,
    isClosedStoreModalVisible,
    isFavourite,
    isInfoModalVisible,
    isServicesSectionLoading,
    listData,
    openingDays,
    openUntilLabel,
    rating,
    ratingLabel,
    reviewCount,
    selectedCategoryId,
    selectedSubcategoryId,
    services,
    servicesQuery,
    setIsClosedStoreModalVisible,
    setIsInfoModalVisible,
    setSelectedCategoryId,
    setSelectedSubcategoryId,
    shouldShowServiceSkeletons,
    storeClosed,
    storeError,
    storeId,
    storeQuery,
    storeView,
    teamMembers,
    title,
    visibleSubcategories,
  } = useAppointmentDetailsScreen({ brand, navigation, provider });

  if (!storeId && !provider) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('details_store_missing')}</Text>
      </View>
    );
  }

  if (storeQuery.error && !storeView) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('details_load_error')}</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <AppointmentDetailsContent
          about={infoDescription}
          additionalInfoItems={additionalInfoItems}
          address={address}
          bookNowDisabled={bookNowDisabled}
          canShowSeeAllServices={canShowSeeAllServices}
          coverImageUrl={coverImageUrl}
          hoursFallback={hours ?? t('details_meta_hours_fallback')}
          insets={insets}
          isFavourite={isFavourite}
          isFetchingNextPage={servicesQuery.isFetchingNextPage}
          isRefetching={servicesQuery.isRefetching}
          isServicesSectionLoading={isServicesSectionLoading}
          isStorePending={storeQuery.isPending}
          isStoreRefetching={storeQuery.isRefetching}
          listData={listData}
          onBackPress={handleBackPress}
          onBookingAttempt={handleBookingAttempt}
          onCategorySelect={(value) => {
            setSelectedCategoryId(value);
            setSelectedSubcategoryId(null);
          }}
          onContactPress={() => setIsInfoModalVisible(true)}
          onEndReached={() => undefined}
          onFavouritePress={handleFavouritePress}
          onOpenDirections={handleOpenDirections}
          onRefresh={handleRefresh}
          onSharePress={handleSharePress}
          onServicePress={handleServicePress}
          onShowAllServices={() => handleOpenServices()}
          onShowAllTeam={() =>
            navigation.navigate('Team', {
              storeId,
              title,
              team: storeView?.team ?? [],
            })
          }
          onSubcategorySelect={(value) => {
            setSelectedSubcategoryId(value);
          }}
          openingDays={openingDays}
          openUntilLabel={openUntilLabel}
          rating={rating}
          ratingLabel={ratingLabel}
          reviewCount={reviewCount}
          reviewPreviews={EMPTY_REVIEWS}
          selectedCategoryId={selectedCategoryId}
          selectedSubcategoryId={selectedSubcategoryId}
          services={services}
          servicesCount={services.length}
          shouldShowServiceSkeletons={shouldShowServiceSkeletons}
          showLoadError={Boolean(servicesQuery.error)}
          storeClosed={storeClosed}
          storeError={Boolean(storeQuery.error)}
          storeViewAvailable={Boolean(storeView)}
          teamMembers={teamMembers}
          title={title}
          topCategories={storeView?.categories ?? []}
          visibleSubcategories={visibleSubcategories}
        />

        <AppPopup
          description={t('details_closed_overlay_body')}
          dismissOnOverlayPress
          onRequestClose={() => setIsClosedStoreModalVisible(false)}
          primaryAction={{
            label: t('details_close'),
            onPress: () => setIsClosedStoreModalVisible(false),
          }}
          title={t('details_closed_overlay_title')}
          visible={isClosedStoreModalVisible}
        />

        <AppPopup
          description={infoDescription}
          dismissOnOverlayPress
          onRequestClose={() => setIsInfoModalVisible(false)}
          primaryAction={{
            label: t('details_close'),
            onPress: () => setIsInfoModalVisible(false),
          }}
          showPrimaryAction={false}
          title={t('details_about_title')}
          visible={isInfoModalVisible}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  screen: {
    flex: 1,
  },
});
