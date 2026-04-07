import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import SingleVendorTabButton from '../components/navigation/SingleVendorTabButton';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import SingleVendorProfileTabScreen from '../../account/screens/ProfileTab/SingleVendorProfileTabScreen';
import OrdersScreen from '../../screens/OrdersScreen/OrdersScreen';
import type { SingleVendorBottomTabParamList } from './types';

const Tab = createBottomTabNavigator<SingleVendorBottomTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

export default function SinglevendorBottomTabNavigator() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: colors.background,
      }}
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
          height: 82,
        },
      }}
    >
      <Tab.Screen
        component={HomeScreen}
        name="SingleVendorTabHome"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="home-outline"
              size={size}
            />
          ),
          tabBarLabel: t('single_vendor_tab_home'),
          title: t('single_vendor_tab_home'),
        }}
      />
      <Tab.Screen
        component={SearchScreen}
        name="SingleVendorTabSearch"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="magnify"
              size={size}
            />
          ),
          tabBarLabel: t('single_vendor_tab_search'),
          title: t('single_vendor_tab_search'),
        }}
      />
      <Tab.Screen
        component={OrdersScreen}
        name="SingleVendorTabOrders"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="receipt-text-outline"
              size={size}
            />
          ),
          tabBarLabel: t('single_vendor_tab_orders'),
          title: t('single_vendor_tab_orders'),
        }}
      />
      <Tab.Screen
        component={SingleVendorProfileTabScreen}
        name="SingleVendorTabProfile"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="account-outline"
              size={size}
            />
          ),
          tabBarLabel: t('single_vendor_tab_profile'),
          title: t('single_vendor_tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}
