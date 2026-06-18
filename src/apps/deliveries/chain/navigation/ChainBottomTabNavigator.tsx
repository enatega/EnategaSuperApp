import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import DeliveriesTabBar, {
  DELIVERIES_TAB_BAR_HEIGHT,
  DELIVERIES_TAB_BAR_SAFE_PADDING,
} from '../../components/navigation/DeliveriesTabBar';
import ChainProfileTabScreen from '../../screens/ProfileTab/ChainProfileTabScreen';
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
      tabBar={(props) => <DeliveriesTabBar {...props} />}
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
        tabBarActiveTintColor: colors.onPrimary,
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
          borderTopWidth: 1,
          height: DELIVERIES_TAB_BAR_HEIGHT + safeBottom,
          paddingBottom: safeBottom,
          paddingHorizontal: 8,
          paddingTop: 4,
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
