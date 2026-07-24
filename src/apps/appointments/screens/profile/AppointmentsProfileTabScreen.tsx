import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ProfileTabScreen from '../../../../general/screens/profile/ProfileTabScreen';
import useProfile from '../../../../general/hooks/useProfile';

type AppointmentProfileNavigation = {
  navigate: (screen: string) => void;
};

type Props = {
  favouritesRoute?: string;
};

export default function AppointmentsProfileTabScreen({
  favouritesRoute = 'AppointmentFavourites',
}: Props) {
  const navigation = useNavigation<AppointmentProfileNavigation>();
  const { user, wallet, isLoading } = useProfile('appointments');

  return (
    <ProfileTabScreen
      favoritesEnabled
      couponsEnabled
      isLoading={isLoading}
      onOpenCoupons={() => navigation.navigate('AppointmentCoupons')}
      onOpenFavourites={() => navigation.navigate(favouritesRoute)}
      onOpenNotifications={() => navigation.navigate('AppointmentNotifications')}
      user={user}
      wallet={wallet}
    />
  );
}
