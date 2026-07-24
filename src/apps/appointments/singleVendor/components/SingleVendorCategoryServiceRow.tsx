import React from 'react';
import type {
  AppointmentCategory,
  AppointmentOrderAgainItem,
} from '../../api/types';
import AppointmentsServicesRail from '../../components/home/AppointmentsServicesRail';
import { useSingleVendorCategoryServices } from '../hooks/useSingleVendorDiscovery';

type Props = {
  category: AppointmentCategory;
  emptyTitle: string;
  emptyMessage: string;
  onItemPress: (item: AppointmentOrderAgainItem) => void;
  onFavoritePress: (item: AppointmentOrderAgainItem) => void;
  favoritePendingProductId?: string;
  favoriteOverrides: Record<string, boolean>;
};

export default function SingleVendorCategoryServiceRow({
  category,
  emptyTitle,
  emptyMessage,
  onItemPress,
  onFavoritePress,
  favoritePendingProductId,
  favoriteOverrides,
}: Props) {
  const { data: items = [], isPending } =
    useSingleVendorCategoryServices(category.id);

  return (
    <AppointmentsServicesRail
      title={category.name}
      items={items}
      isPending={isPending}
      emptyTitle={emptyTitle}
      emptyMessage={emptyMessage}
      onItemPress={onItemPress}
      onFavoritePress={onFavoritePress}
      favoritePendingProductId={favoritePendingProductId}
      favoriteOverrides={favoriteOverrides}
    />
  );
}
