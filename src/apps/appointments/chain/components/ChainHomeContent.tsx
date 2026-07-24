import React from 'react';
import type {
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
  AppointmentProvider,
} from '../../api/types';
import AppointmentsHomeHero from '../../components/home/AppointmentsHomeHero';
import AppointmentsMostPopularSection from '../../components/home/AppointmentsMostPopularSection';
import AppointmentsNearbyProvidersSection from '../../components/home/AppointmentsNearbyProvidersSection';
import AppointmentsOrderAgainSection from '../../components/home/AppointmentsOrderAgainSection';
import {
  useChainBanners,
  useChainBranches,
  useChainOrderAgain,
  useChainTopServices,
} from '../hooks/useChainDiscovery';

type Props = {
  latitude?: number;
  longitude?: number;
  title: string;
  body: string;
  bookingsLabel: string;
  branchesTitle: string;
  topServicesTitle: string;
  orderAgainTitle: string;
  seeAllLabel: string;
  emptyTitle: string;
  branchesEmptyMessage: string;
  topServicesEmptyMessage: string;
  orderAgainEmptyMessage: string;
  onBookingsPress: () => void;
  onBranchPress: (branch: AppointmentProvider) => void;
  onBranchesPress: () => void;
  onServicePress: (
    item: AppointmentMostPopularItem | AppointmentOrderAgainItem,
  ) => void;
};

export default function ChainHomeContent({
  latitude,
  longitude,
  title,
  body,
  bookingsLabel,
  branchesTitle,
  topServicesTitle,
  orderAgainTitle,
  seeAllLabel,
  emptyTitle,
  branchesEmptyMessage,
  topServicesEmptyMessage,
  orderAgainEmptyMessage,
  onBookingsPress,
  onBranchPress,
  onBranchesPress,
  onServicePress,
}: Props) {
  const branches = useChainBranches(latitude, longitude);
  const banners = useChainBanners();
  const topServices = useChainTopServices();
  const orderAgain = useChainOrderAgain();
  const hasCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);
  const branchItems = branches.data ?? [];
  const topServiceItems = topServices.data ?? [];
  const orderAgainItems = orderAgain.data ?? [];

  return (
    <>
      <AppointmentsHomeHero
        banners={banners.data ?? []}
        isPending={banners.isPending}
        title={title}
        body={body}
        bookingsLabel={bookingsLabel}
        onBookingsPress={onBookingsPress}
      />

      <AppointmentsNearbyProvidersSection
        title={branchesTitle}
        actionLabel={branchItems.length > 1 ? seeAllLabel : undefined}
        emptyTitle={emptyTitle}
        emptyMessage={branchesEmptyMessage}
        items={branchItems}
        isPending={hasCoordinates && branches.isPending}
        onActionPress={onBranchesPress}
        onItemPress={onBranchPress}
      />

      <AppointmentsMostPopularSection
        title={topServicesTitle}
        emptyTitle={emptyTitle}
        emptyMessage={topServicesEmptyMessage}
        items={topServiceItems}
        isPending={topServices.isPending}
        onItemPress={onServicePress}
      />

      {orderAgain.isPending || orderAgainItems.length > 0 ? (
        <AppointmentsOrderAgainSection
          title={orderAgainTitle}
          emptyTitle={emptyTitle}
          emptyMessage={orderAgainEmptyMessage}
          items={orderAgainItems}
          isPending={orderAgain.isPending}
          onItemPress={onServicePress}
        />
      ) : null}
    </>
  );
}
