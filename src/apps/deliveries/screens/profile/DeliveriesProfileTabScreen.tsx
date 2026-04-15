import React from 'react';
import ProfileTabScreen from '../../../../general/screens/profile/ProfileTabScreen';
import useProfile from '../../../../general/hooks/useProfile';

type Props = {
  favoritesEnabled?: boolean;
  onOpenFavourites?: () => void;
};

export default function DeliveriesProfileTabScreen({
  favoritesEnabled = false,
  onOpenFavourites,
}: Props) {
  const { user, wallet, isLoading } = useProfile('deliveries');

  return (
    <ProfileTabScreen
      favoritesEnabled={favoritesEnabled}
      isLoading={isLoading}
      onOpenFavourites={onOpenFavourites}
      user={user}
      wallet={wallet}
    />
  );
}
