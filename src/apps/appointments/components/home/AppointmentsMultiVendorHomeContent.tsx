import React from 'react';
import { useAppointmentBanners } from '../../hooks/useDiscoveryQueries';
import type {
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
  AppointmentProvider,
  AppointmentShopType,
  AppointmentTopBrand,
} from '../../api/types';
import AppointmentsCategoriesSection from './AppointmentsCategoriesSection';
import AppointmentsHomeHero from './AppointmentsHomeHero';
import AppointmentsNearbyProvidersSection from './AppointmentsNearbyProvidersSection';
import AppointmentsMostPopularSection from './AppointmentsMostPopularSection';
import AppointmentsOrderAgainSection from './AppointmentsOrderAgainSection';
import AppointmentsTopBrandsSection from './AppointmentsTopBrandsSection';

type Props = {
  title: string;
  body: string;
  bookingsLabel: string;
  categoriesTitle: string;
  topBrandsTitle: string;
  nearbyProvidersTitle: string;
  mostPopularTitle: string;
  orderAgainTitle: string;
  seeAllLabel: string;
  emptyTitle: string;
  topBrandsEmptyMessage: string;
  nearbyProvidersEmptyMessage: string;
  mostPopularEmptyMessage: string;
  orderAgainEmptyMessage: string;
  onCategoriesPress: () => void;
  onCategoryPress: (shopType: AppointmentShopType) => void;
  onTopBrandsPress: () => void;
  onTopBrandPress: (brand: AppointmentTopBrand) => void;
  canOpenTopBrand: (brand: AppointmentTopBrand) => boolean;
  onNearbyProvidersPress: () => void;
  onNearbyProviderPress: (provider: AppointmentProvider) => void;
  onMostPopularPress: () => void;
  onMostPopularItemPress: (item: AppointmentMostPopularItem) => void;
  onOrderAgainPress: () => void;
  onOrderAgainItemPress: (item: AppointmentOrderAgainItem) => void;
  onBookingsPress: () => void;
};

export default function AppointmentsMultiVendorHomeContent({
  title,
  body,
  bookingsLabel,
  categoriesTitle,
  topBrandsTitle,
  nearbyProvidersTitle,
  mostPopularTitle,
  orderAgainTitle,
  seeAllLabel,
  emptyTitle,
  topBrandsEmptyMessage,
  nearbyProvidersEmptyMessage,
  mostPopularEmptyMessage,
  orderAgainEmptyMessage,
  onCategoriesPress,
  onCategoryPress,
  onTopBrandsPress,
  onTopBrandPress,
  canOpenTopBrand,
  onNearbyProvidersPress,
  onNearbyProviderPress,
  onMostPopularPress,
  onMostPopularItemPress,
  onOrderAgainPress,
  onOrderAgainItemPress,
  onBookingsPress,
}: Props) {
  const { data: banners = [], isPending: isBannersPending } = useAppointmentBanners({
    limit: 10,
    offset: 0,
  });
  return (
    <>
      <AppointmentsCategoriesSection
        title={categoriesTitle}
        actionLabel={seeAllLabel}
        onActionPress={onCategoriesPress}
        onItemPress={onCategoryPress}
      />

      <AppointmentsHomeHero
        banners={banners}
        isPending={isBannersPending}
        title={title}
        body={body}
        bookingsLabel={bookingsLabel}
        onBookingsPress={onBookingsPress}
      />

      <AppointmentsTopBrandsSection
        title={topBrandsTitle}
        actionLabel={seeAllLabel}
        emptyTitle={emptyTitle}
        emptyMessage={topBrandsEmptyMessage}
        onActionPress={onTopBrandsPress}
        onItemPress={onTopBrandPress}
        canOpenBrand={canOpenTopBrand}
      />

      <AppointmentsNearbyProvidersSection
        title={nearbyProvidersTitle}
        actionLabel={seeAllLabel}
        emptyTitle={emptyTitle}
        emptyMessage={nearbyProvidersEmptyMessage}
        onActionPress={onNearbyProvidersPress}
        onItemPress={onNearbyProviderPress}
      />


      <AppointmentsMostPopularSection
        title={mostPopularTitle}
        actionLabel={seeAllLabel}
        emptyTitle={emptyTitle}
        emptyMessage={mostPopularEmptyMessage}
        onActionPress={onMostPopularPress}
        onItemPress={onMostPopularItemPress}
      />

      <AppointmentsOrderAgainSection
        title={orderAgainTitle}
        actionLabel={seeAllLabel}
        emptyTitle={emptyTitle}
        emptyMessage={orderAgainEmptyMessage}
        onActionPress={onOrderAgainPress}
        onItemPress={onOrderAgainItemPress}
      />


    </>
  );
}
