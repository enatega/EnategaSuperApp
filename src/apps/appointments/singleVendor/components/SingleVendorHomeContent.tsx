import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import type {
  AppointmentOrderAgainItem,
  AppointmentShopType,
} from '../../api/types';
import AppointmentsCategoriesSection from '../../components/home/AppointmentsCategoriesSection';
import AppointmentsHomeHero from '../../components/home/AppointmentsHomeHero';
import AppointmentsServicesRail from '../../components/home/AppointmentsServicesRail';
import {
  useSingleVendorBanners,
  useSingleVendorDeals,
  useSingleVendorOrderAgain,
  useSingleVendorServiceTypes,
  useSingleVendorTopServices,
} from '../hooks/useSingleVendorDiscovery';
import SingleVendorCategoryServicesSection from './SingleVendorCategoryServicesSection';
import { useToggleSingleVendorFavouriteService } from '../hooks/useSingleVendorFavouriteServices';

type Props = {
  title: string;
  body: string;
  bookingsLabel: string;
  serviceTypesTitle: string;
  topServicesTitle: string;
  dealsTitle: string;
  orderAgainTitle: string;
  seeAllLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  onServiceTypePress: (item: AppointmentShopType) => void;
  onServicePress: (item: AppointmentOrderAgainItem) => void;
  onBookingsPress: () => void;
  onSeeAllServicesPress: () => void;
};

export default function SingleVendorHomeContent({
  title,
  body,
  bookingsLabel,
  serviceTypesTitle,
  topServicesTitle,
  dealsTitle,
  orderAgainTitle,
  seeAllLabel,
  emptyTitle,
  emptyMessage,
  onServiceTypePress,
  onServicePress,
  onBookingsPress,
  onSeeAllServicesPress,
}: Props) {
  const { t } = useTranslation('appointments');
  const [favoriteOverrides, setFavoriteOverrides] = useState<
    Record<string, boolean>
  >({});
  const toggleFavorite = useToggleSingleVendorFavouriteService();
  const serviceTypes = useSingleVendorServiceTypes();
  const banners = useSingleVendorBanners();
  const topServices = useSingleVendorTopServices();
  const deals = useSingleVendorDeals();
  const orderAgain = useSingleVendorOrderAgain();
  const serviceTypeItems = serviceTypes.data ?? [];
  const topServiceItems = topServices.data ?? [];
  const orderAgainItems = orderAgain.data ?? [];
  const handleFavoritePress = useCallback(
    (item: AppointmentOrderAgainItem) => {
      toggleFavorite.mutate(item.productId, {
        onSuccess: (response) => {
          setFavoriteOverrides((current) => ({
            ...current,
            [item.productId]: response.isFavorite,
          }));
          showToast.success(
            t(
              response.isFavorite
                ? 'favourites_service_added'
                : 'favourites_service_removed',
            ),
          );
        },
        onError: () => showToast.error(t('favourites_toggle_error')),
      });
    },
    [t, toggleFavorite],
  );
  const favoriteProps = {
    favoriteOverrides,
    favoritePendingProductId: toggleFavorite.isPending
      ? toggleFavorite.variables
      : undefined,
    onFavoritePress: handleFavoritePress,
  };

  return (
    <>
      <AppointmentsCategoriesSection
        title={serviceTypesTitle}
        actionLabel={serviceTypeItems.length > 1 ? seeAllLabel : undefined}
        items={serviceTypeItems}
        isPending={serviceTypes.isPending}
        onActionPress={onSeeAllServicesPress}
        onItemPress={onServiceTypePress}
      />
      <AppointmentsHomeHero
        banners={banners.data ?? []}
        isPending={banners.isPending}
        title={title}
        body={body}
        bookingsLabel={bookingsLabel}
        onBookingsPress={onBookingsPress}
      />
      <AppointmentsServicesRail
        title={topServicesTitle}
        items={topServiceItems}
        isPending={topServices.isPending}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        actionLabel={topServiceItems.length > 1 ? seeAllLabel : undefined}
        onActionPress={onSeeAllServicesPress}
        onItemPress={onServicePress}
        {...favoriteProps}
      />
      <SingleVendorCategoryServicesSection
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        onItemPress={onServicePress}
        {...favoriteProps}
      />
      {(deals.data?.length ?? 0) > 0 ? (
        <AppointmentsServicesRail
          title={dealsTitle}
          items={deals.data ?? []}
          isPending={false}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
          actionLabel={seeAllLabel}
          onActionPress={onSeeAllServicesPress}
          onItemPress={onServicePress}
          {...favoriteProps}
        />
      ) : null}
      <AppointmentsServicesRail
        title={orderAgainTitle}
        items={orderAgainItems}
        isPending={orderAgain.isPending}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        actionLabel={orderAgainItems.length > 1 ? seeAllLabel : undefined}
        onActionPress={onSeeAllServicesPress}
        onItemPress={onServicePress}
        {...favoriteProps}
      />
    </>
  );
}
