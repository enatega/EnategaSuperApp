import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLogout } from '../../../general/hooks/useAuthMutations';

type MenuItem = {
  id: string;
  icon: string;
  iconLibrary?: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Feather' | 'AntDesign';
  titleKey: string;
  subtitleKey?: string;
  showChevron?: boolean;
  onPress?: () => void;
};

type UserProfile = {
  name: string;
  email: string;
  rating?: number;
  reviewCount?: number;
  avatarUri?: string;
};

export type ProfileStackParamList = {
  PersonalInfo: undefined;
  EditName: undefined;
  EditPhone: undefined;
  EditEmail: undefined;
  Settings: undefined;
  UpdatePassword: undefined;
  Language: undefined;
  Appearance: undefined;
};

export function useSidebarMenu() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { mutate: logout } = useLogout();

  const openSidebar = useCallback(() => {
    setSidebarVisible(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  // Default ride-sharing menu items
  const menuItems: MenuItem[] = [
    {
      id: 'lo-drive',
      icon: 'car-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_lo_drive',
      subtitleKey: 'sidebar_lo_drive_subtitle',
      showChevron: true,
      onPress: () => console.log('LO Drive pressed'),
    },
    {
      id: 'reservations',
      icon: 'calendar-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_reservations',
      subtitleKey: 'sidebar_reservations_subtitle',
      showChevron: true,
      onPress: () => console.log('Reservations pressed'),
    },
    {
      id: 'ride-history',
      icon: 'time-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_ride_history',
      subtitleKey: 'sidebar_ride_history_subtitle',
      showChevron: true,
      onPress: () => console.log('Ride History pressed'),
    },
    {
      id: 'payment-methods',
      icon: 'card-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_payment_methods',
      subtitleKey: 'sidebar_payment_methods_subtitle',
      showChevron: true,
      onPress: () => console.log('Payment Methods pressed'),
    },
    {
      id: 'wallet',
      icon: 'wallet-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_wallet',
      subtitleKey: 'sidebar_wallet_subtitle',
      showChevron: true,
      onPress: () => console.log('Wallet pressed'),
    },
    {
      id: 'support',
      icon: 'help-buoy-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_support',
      subtitleKey: 'sidebar_support_subtitle',
      showChevron: true,
      onPress: () => console.log('Support pressed'),
    },
    {
      id: 'security',
      icon: 'settings-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_security',
      subtitleKey: 'sidebar_security_subtitle',
      showChevron: true,
      onPress: () => {
        closeSidebar();
        navigation.navigate('Settings');
      },
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_notifications',
      subtitleKey: 'sidebar_notifications_subtitle',
      showChevron: true,
      onPress: () => console.log('Notifications pressed'),
    },
  ];

  const handleLogout = useCallback(() => {
    closeSidebar();
    logout(undefined, {
      onSuccess: () => {
        // Force the navigation stack back to the root home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'RideSharingHome' as any }],
        });
      },
    });
  }, [closeSidebar, logout, navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('PersonalInfo');
  }, [navigation]);

  return {
    sidebarVisible,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    menuItems,
    handleLogout,
    handleProfilePress,
  };
}

export type { MenuItem, UserProfile };
