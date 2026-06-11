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
import ChainTabButton from '../../../deliveries/chain/components/navigation/ChainTabButton';
import ChainProfileTabScreen from '../../../deliveries/screens/ProfileTab/ChainProfileTabScreen';
import type { ChainBottomTabParamList } from './types';
import ChainBookingsScreen from '../screens/BookingsScreen';
import ChainHomeScreen from '../screens/HomeScreen';
import ChainSearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator<ChainBottomTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

export default function ChainBottomTabNavigator() {
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
      sceneContainerStyle={{
        backgroundColor: colors.background,
      }}
      tabBar={(props) => <AppointmentsTabBar {...props} />}
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarButton: (props) => <ChainTabButton {...props} />,
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
        name="ChainTabHome"
        component={ChainHomeScreen}
        options={{
          tabBarIcon: renderIcon('home-outline'),
          tabBarLabel: t('tab_home'),
          title: t('tab_home'),
        }}
      />
      <Tab.Screen
        name="ChainTabSearch"
        component={ChainSearchScreen}
        options={{
          tabBarIcon: renderIcon('magnify'),
          tabBarLabel: t('tab_search'),
          title: t('tab_search'),
        }}
      />
      <Tab.Screen
        name="ChainTabBookings"
        component={ChainBookingsScreen}
        options={{
          tabBarIcon: renderIcon('receipt-text-outline'),
          tabBarLabel: t('tab_bookings'),
          title: t('tab_bookings'),
        }}
      />
      <Tab.Screen
        name="ChainTabProfile"
        component={ChainProfileTabScreen}
        options={{
          tabBarIcon: renderIcon('account-outline'),
          tabBarLabel: t('tab_profile'),
          title: t('tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}
