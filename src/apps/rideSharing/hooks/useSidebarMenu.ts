import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppLogout } from '../../../general/hooks/useAppLogout';
import type { RideSharingStackParamList } from '../navigation/RideSharingNavigator';

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
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const { mutate: logout } = useAppLogout();

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
      showChevron: true,
      onPress: () => console.log('LO Drive pressed'),
    },
    {
      id: 'reservations',
      icon: 'calendar-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_reservations',
      showChevron: true,
      onPress: () => {
        closeSidebar();
        navigation.navigate('ReservationsList');
      },
    },
    {
      id: 'ride-history',
      icon: 'time-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_ride_history',
      showChevron: true,
      onPress: () => {
        closeSidebar();
        navigation.navigate('RideHistory');
      },
    },
    {
      id: 'payment-methods',
      icon: 'card-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_payment_methods',
      showChevron: true,
      onPress: () => console.log('Payment Methods pressed'),
    },
    {
      id: 'wallet',
      icon: 'wallet-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_wallet',
      showChevron: true,
      onPress: () => {
        closeSidebar();
        navigation.navigate('WalletHome' as any);
      },
    },
    {
      id: 'support',
      icon: 'help-buoy-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_support',
      showChevron: true,
      onPress: () => {
        closeSidebar();
        navigation.navigate('RideSupportChat');
      },
    },
    {
      id: 'security',
      icon: 'settings-outline',
      iconLibrary: 'Ionicons',
      titleKey: 'sidebar_security',
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
      showChevron: true,
      onPress: () => {
        closeSidebar();
        navigation.navigate('Notifications');
      },
    },
  ];

  const handleLogout = useCallback(() => {
    closeSidebar();
    logout();
  }, [closeSidebar, logout]);

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
