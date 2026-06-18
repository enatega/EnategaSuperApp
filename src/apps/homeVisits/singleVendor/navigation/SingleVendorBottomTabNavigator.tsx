import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import useProfile from '../../../../general/hooks/useProfile';
import SingleVendorTabButton from '../components/navigation/SingleVendorTabButton';
import SingleVendorHomeScreen from '../screens/HomeScreen';
import SingleVendorOrdersScreen from '../screens/OrdersScreen';
import SingleVendorProfileScreen from '../screens/ProfileScreen';
import SingleVendorSearchScreen from '../screens/SearchScreen';
import type { SingleVendorBottomTabParamList } from './types';

const Tab = createBottomTabNavigator<SingleVendorBottomTabParamList>();

type TabIconProps = {
  color: string;
  size: number;
};

function ProfileTabAvatar({
  color,
  imageUri,
  isFocused,
  size,
}: TabIconProps & {
  imageUri?: string;
  isFocused: boolean;
}) {
  return (
    <View
      style={[
        styles.profileAvatarShell,
        {
          borderColor: isFocused ? color : 'transparent',
        },
      ]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.profileAvatarImage} />
      ) : (
        <Icon
          type="MaterialCommunityIcons"
          name="account-outline"
          size={size}
          color={color}
        />
      )}
    </View>
  );
}

export default function SingleVendorBottomTabNavigator() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const { user } = useProfile('home-services');
  const profileImageUri = user?.image ?? undefined;

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
        component={SingleVendorHomeScreen}
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
        component={SingleVendorSearchScreen}
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
        component={SingleVendorOrdersScreen}
        name="SingleVendorTabOrders"
        options={{
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <MaterialCommunityIcons
              color={color}
              name="calendar-blank-outline"
              size={size}
            />
          ),
          tabBarLabel: t('single_vendor_tab_orders'),
          title: t('single_vendor_tab_orders'),
        }}
      />
      <Tab.Screen
        component={SingleVendorProfileScreen}
        name="SingleVendorTabProfile"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <ProfileTabAvatar
              color={color}
              imageUri={profileImageUri}
              isFocused={focused}
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

const styles = StyleSheet.create({
  profileAvatarShell: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 28,
  },
  profileAvatarImage: {
    height: '100%',
    width: '100%',
  },
});
