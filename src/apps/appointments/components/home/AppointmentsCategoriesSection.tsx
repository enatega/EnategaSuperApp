import React from 'react';
import { DiscoveryCategorySection } from '../../../../general/components/discovery';
import type { AppointmentShopType } from '../../api/types';
import { useAppointmentShopTypes } from '../../hooks/useDiscoveryQueries';

type Props = {
  title: string;
  actionLabel: string;
  onActionPress: () => void;
  onItemPress: (shopType: AppointmentShopType) => void;
};

export default function AppointmentsCategoriesSection({
  title,
  actionLabel,
  onActionPress,
  onItemPress,
}: Props) {
  const { data: shopTypes = [], isPending } = useAppointmentShopTypes();

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
