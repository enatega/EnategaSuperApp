import React from 'react';
import ProfileTabScreen from '../../../../general/screens/profile/ProfileTabScreen';
import useProfile from '../../../../general/hooks/useProfile';

export default function HomeVisitsProfileTabScreen() {
  const { user, wallet, isLoading } = useProfile('home-services');

  return (
    <ProfileTabScreen
      isLoading={isLoading}
      user={user}
      wallet={wallet}
    />
  );
}
