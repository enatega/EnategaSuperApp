import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import {
  DELIVERIES_TAB_BAR_HEIGHT,
  DELIVERIES_TAB_BAR_SAFE_PADDING,
} from '../../../deliveries/components/navigation/DeliveriesTabBar';
import AppointmentsTabBar from '../../components/navigation/AppointmentsTabBar';
import SingleVendorTabButton from '../../../deliveries/singleVendor/components/navigation/SingleVendorTabButton';
import SingleVendorProfileTabScreen from '../../../deliveries/screens/ProfileTab/SingleVendorProfileTabScreen';
import type { SingleVendorBottomTabParamList } from './types';
import SingleVendorBookingsScreen from '../screens/BookingsScreen';
import SingleVendorHomeScreen from '../screens/HomeScreen';
import SingleVendorSearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator<SingleVendorBottomTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

export default function SingleVendorBottomTabNavigator() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, DELIVERIES_TAB_BAR_SAFE_PADDING);

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: colors.background,
      }}
      tabBar={(props) => <AppointmentsTabBar {...props} />}
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarButton: (props) => <SingleVendorTabButton {...props} />,
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarInactiveTintColor: colors.iconMuted,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.size.xs2,
          fontWeight: '600',
          lineHeight: typography.lineHeight.sm,
          marginBottom: 8,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: DELIVERIES_TAB_BAR_HEIGHT + safeBottom,
          paddingBottom: safeBottom,
        },
      }}
    >
      <Tab.Screen
        name="SingleVendorTabHome"
        component={SingleVendorHomeScreen}
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="home-outline"
              size={Math.max(size - 2, 20)}
            />
          ),
          tabBarLabel: t('tab_home'),
          title: t('tab_home'),
        }}
      />
      <Tab.Screen
        name="SingleVendorTabSearch"
        component={SingleVendorSearchScreen}
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="magnify"
              size={Math.max(size - 2, 20)}
            />
          ),
          tabBarLabel: t('tab_search'),
          title: t('tab_search'),
        }}
      />
      <Tab.Screen
        name="SingleVendorTabBookings"
        component={SingleVendorBookingsScreen}
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="receipt-text-outline"
              size={Math.max(size - 2, 20)}
            />
          ),
          tabBarLabel: t('tab_bookings'),
          title: t('tab_bookings'),
        }}
      />
      <Tab.Screen
        name="SingleVendorTabProfile"
        component={SingleVendorProfileTabScreen}
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="account-outline"
              size={Math.max(size - 2, 20)}
            />
          ),
          tabBarLabel: t('tab_profile'),
          title: t('tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}
