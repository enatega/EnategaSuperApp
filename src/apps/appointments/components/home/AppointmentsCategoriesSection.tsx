import React from 'react';
import { DiscoveryCategorySection } from '../../../../general/components/discovery';
import type { AppointmentShopType } from '../../api/types';
import { useAppointmentShopTypes } from '../../hooks/useDiscoveryQueries';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onItemPress: (shopType: AppointmentShopType) => void;
  items?: AppointmentShopType[];
  isPending?: boolean;
};

export default function AppointmentsCategoriesSection({
  title,
  actionLabel,
  onActionPress,
  onItemPress,
  items: externalItems,
  isPending: externalIsPending,
}: Props) {
  const { data: queriedItems = [], isPending: queriedIsPending } =
    useAppointmentShopTypes({}, { enabled: externalItems === undefined });
  const shopTypes = externalItems ?? queriedItems;
  const isPending = externalIsPending ?? queriedIsPending;

  return (
    <DiscoveryCategorySection
      items={shopTypes.map((shopType) => ({
        id: shopType.id,
        name: shopType.name,
        imageUrl: shopType.image ?? null,
      }))}
      isPending={isPending}
      title={title}
      actionLabel={actionLabel}
      onActionPress={onActionPress}
      onItemPress={(item) => {
        const shopType = shopTypes.find((entry) => entry.id === item.id);

        if (!shopType) {
          return;
        }

        onItemPress(shopType);
      }}
    />
  );
}
