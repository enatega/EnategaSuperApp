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
import MultiVendorTabButton from '../../../deliveries/multiVendor/components/TabButton';
import MultiVendorProfileTabScreen from '../../../deliveries/screens/ProfileTab/MultiVendorProfileTabScreen';
import type { MultiVendorBottomTabParamList } from './types';
import MultiVendorBookingsScreen from '../screens/BookingsScreen';
import MultiVendorHomeScreen from '../screens/HomeScreen';
import MultiVendorSearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator<MultiVendorBottomTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

export default function MultiVendorBottomTabNavigator() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, DELIVERIES_TAB_BAR_SAFE_PADDING);

  const renderIcon =
    (name: keyof typeof MaterialCommunityIcons.glyphMap) =>
    ({ color, size }: TabIconProps) => (
      <MaterialCommunityIcons
        color={color}
        name={name}
        size={Math.max(size - 2, 20)}
      />
    );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.iconMuted,
        tabBarButton: (props) => <MultiVendorTabButton {...props} />,
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.size.xxs,
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
      tabBar={(props) => <AppointmentsTabBar {...props} />}
    >
      <Tab.Screen
        name="MultiVendorTabHome"
        component={MultiVendorHomeScreen}
        options={{
          tabBarIcon: renderIcon('home-outline'),
          tabBarLabel: t('tab_home'),
          title: t('tab_home'),
        }}
      />
      <Tab.Screen
        name="MultiVendorTabSearch"
        component={MultiVendorSearchScreen}
        options={{
          tabBarIcon: renderIcon('magnify'),
          tabBarLabel: t('tab_search'),
          title: t('tab_search'),
        }}
      />
      <Tab.Screen
        name="MultiVendorTabBookings"
        component={MultiVendorBookingsScreen}
        options={{
          tabBarIcon: renderIcon('receipt-text-outline'),
          tabBarLabel: t('tab_bookings'),
          title: t('tab_bookings'),
        }}
      />
      <Tab.Screen
        name="MultiVendorTabProfile"
        component={MultiVendorProfileTabScreen}
        options={{
          tabBarIcon: renderIcon('account-outline'),
          tabBarLabel: t('tab_profile'),
          title: t('tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}
