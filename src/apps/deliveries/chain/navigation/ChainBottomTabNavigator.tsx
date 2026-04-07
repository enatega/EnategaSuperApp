import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import ChainTabButton from '../components/navigation/ChainTabButton';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import type { ChainBottomTabParamList } from './types';

const Tab = createBottomTabNavigator<ChainBottomTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

export default function ChainBottomTabNavigator() {
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
          height: 82,
        },
      }}
    >
      <Tab.Screen
        component={HomeScreen}
        name="ChainTabHome"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="home-outline"
              size={size}
            />
          ),
          tabBarLabel: t('chain_tab_home'),
          title: t('chain_tab_home'),
        }}
      />
      <Tab.Screen
        component={SearchScreen}
        name="ChainTabSearch"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="magnify"
              size={size}
            />
          ),
          tabBarLabel: t('chain_tab_search'),
          title: t('chain_tab_search'),
        }}
      />
      <Tab.Screen
        component={OrdersScreen}
        name="ChainTabOrders"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="receipt-text-outline"
              size={size}
            />
          ),
          tabBarLabel: t('chain_tab_orders'),
          title: t('chain_tab_orders'),
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="ChainTabProfile"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="account-outline"
              size={size}
            />
          ),
          tabBarLabel: t('chain_tab_profile'),
          title: t('chain_tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}
