import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeTab from '../screens/HomeTab/HomeTab';
import SearchTab from '../screens/SearchTab/SearchTab';
import { useTheme } from '../../../../general/theme/theme';
import DeliveriesTabBar, {
  DELIVERIES_TAB_BAR_HEIGHT,
  DELIVERIES_TAB_BAR_SAFE_PADDING,
} from '../../components/navigation/DeliveriesTabBar';
import MultiVendorTabButton from '../components/TabButton';
import MultiVendorProfileTabScreen from '../../screens/ProfileTab/MultiVendorProfileTabScreen';
import OrdersScreen from '../../screens/OrdersScreen/OrdersScreen';

const Tab = createBottomTabNavigator();

type TabIconProps = {
  color: string;
  size: number;
};

function MultiVendorBottomTabNavigator() {
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
      tabBar={(props) => <DeliveriesTabBar {...props} />}
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
