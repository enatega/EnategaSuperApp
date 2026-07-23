import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ProfileTabScreen from '../../../../general/screens/profile/ProfileTabScreen';
import useProfile from '../../../../general/hooks/useProfile';

type AppointmentProfileNavigation = {
  navigate: (screen: string) => void;
};

export default function AppointmentsProfileTabScreen() {
  const navigation = useNavigation<AppointmentProfileNavigation>();
  const { user, wallet, isLoading } = useProfile('appointments');

  return (
    <ProfileTabScreen
      favoritesEnabled
      couponsEnabled
      isLoading={isLoading}
      onOpenCoupons={() => navigation.navigate('AppointmentCoupons')}
      onOpenFavourites={() => navigation.navigate('AppointmentFavourites')}
      onOpenNotifications={() => navigation.navigate('AppointmentNotifications')}
      user={user}
      wallet={wallet}
    />
  );
}
