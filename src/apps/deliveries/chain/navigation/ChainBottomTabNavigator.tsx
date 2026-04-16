import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import DeliveriesTabBar, {
  DELIVERIES_TAB_BAR_HEIGHT,
} from '../../components/navigation/DeliveriesTabBar';
import ChainProfileTabScreen from '../../account/screens/ProfileTab/ChainProfileTabScreen';
import OrdersScreen from '../../screens/OrdersScreen/OrdersScreen';
import ChainTabButton from '../components/navigation/ChainTabButton';
import HomeScreen from '../screens/HomeScreen';
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

  const renderIcon =
    (name: keyof typeof MaterialCommunityIcons.glyphMap) =>
    ({ color, size }: TabIconProps) => (
      <MaterialCommunityIcons
        color={color}
        name={name}
        size={size}
      />
    );

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: colors.background,
      }}
      tabBar={(props) => <DeliveriesTabBar {...props} />}
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
          height: DELIVERIES_TAB_BAR_HEIGHT,
        },
      }}
    >
      <Tab.Screen
        component={HomeScreen}
        name="ChainTabHome"
        options={{
          tabBarIcon: renderIcon('home-outline'),
          tabBarLabel: t('chain_tab_home'),
          title: t('chain_tab_home'),
        }}
      />
      <Tab.Screen
        component={SearchScreen}
        name="ChainTabSearch"
        options={{
          tabBarIcon: renderIcon('magnify'),
          tabBarLabel: t('chain_tab_search'),
          title: t('chain_tab_search'),
        }}
      />
      <Tab.Screen
        component={OrdersScreen}
        name="ChainTabOrders"
        options={{
          tabBarIcon: renderIcon('receipt-text-outline'),
          tabBarLabel: t('chain_tab_orders'),
          title: t('chain_tab_orders'),
        }}
      />
      <Tab.Screen
        component={ChainProfileTabScreen}
        name="ChainTabProfile"
        options={{
          tabBarIcon: renderIcon('account-outline'),
          tabBarLabel: t('chain_tab_profile'),
          title: t('chain_tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}
