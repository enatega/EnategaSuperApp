import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import HomeTab from '../screens/HomeTab/HomeTab';
import SearchTab from '../screens/SearchTab/SearchTab';
import { useTheme } from '../../../../general/theme/theme';
import MultiVendorTabButton from '../components/TabButton';
import MultiVendorProfileTabScreen from '../../account/screens/ProfileTab/MultiVendorProfileTabScreen';
import OrdersScreen from '../../screens/OrdersScreen/OrdersScreen';

const Tab = createBottomTabNavigator();

type TabIconProps = {
  color: string;
  size: number;
};

function MultiVendorBottomTabNavigator() {
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
        component={HomeTab}
        name="MultiVendorTabHome"
        options={{
          tabBarIcon: renderIcon('home-outline'),
          tabBarLabel: t('multi_vendor_tab_home'),
          title: t('multi_vendor_tab_home'),
        }}
      />
      <Tab.Screen
        component={SearchTab}
        name="MultiVendorTabSearch"
        options={{
          tabBarIcon: renderIcon('magnify'),
          tabBarLabel: t('multi_vendor_tab_search'),
          title: t('multi_vendor_tab_search'),
        }}
      />
      <Tab.Screen
        component={OrdersScreen}
        name="MultiVendorTabOrders"
        options={{
          tabBarIcon: renderIcon('receipt-text-outline'),
          tabBarLabel: t('multi_vendor_tab_orders'),
          title: t('multi_vendor_tab_orders'),
        }}
      />
      <Tab.Screen
        component={MultiVendorProfileTabScreen}
        name="MultiVendorTabProfile"
        options={{
          tabBarIcon: renderIcon('account-outline'),
          tabBarLabel: t('multi_vendor_tab_profile'),
          title: t('multi_vendor_tab_profile'),
        }}
      />
    </Tab.Navigator>
  );
}

export default MultiVendorBottomTabNavigator;
