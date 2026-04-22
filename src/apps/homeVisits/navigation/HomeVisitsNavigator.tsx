import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import HomeVisitsMyProfileScreen from '../screens/profile/HomeVisitsMyProfileScreen';
import HomeVisitsEditProfileScreen from '../screens/profile/HomeVisitsEditProfileScreen';
import HomeVisitsFeaturePlaceholderScreen from '../screens/profile/HomeVisitsFeaturePlaceholderScreen';
import HomeVisitsSupportScreen from '../screens/support/HomeVisitsSupportScreen';
import HomeVisitsSupportFaqScreen from '../screens/support/HomeVisitsSupportFaqScreen';
import HomeVisitsSupportChatScreen from '../screens/support/HomeVisitsSupportChatScreen';
import HomeVisitsSupportConversationsScreen from '../screens/support/HomeVisitsSupportConversationsScreen';
import HomeVisitsSupportTicketsScreen from '../screens/support/HomeVisitsSupportTicketsScreen';
import HomeVisitsSupportContactFormScreen from '../screens/support/HomeVisitsSupportContactFormScreen';
import ColorModeScreen from '../../../general/screens/settings/ColorModeScreen';
import LanguageScreen from '../../../general/screens/settings/LanguageScreen';
import AddressSearchScreen from '../../../general/screens/address/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../../general/screens/address/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../../general/screens/address/AddressDetailScreen';
import type { HomeVisitModeRootRoute } from './homeVisitModePreference';
import {
  DEFAULT_HOME_VISIT_MODE,
  getHomeVisitModePreference,
  mapHomeVisitModeToRoute,
  setHomeVisitModePreference,
} from './homeVisitModePreference';
import type { HomeVisitsStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeVisitsStackParamList>();

const hiddenHeaderOptions = { headerShown: false } as const;

export default function HomeVisitsNavigator() {
  const [initialRouteName, setInitialRouteName] =
    useState<HomeVisitModeRootRoute | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialRoute = async () => {
      const savedMode = await getHomeVisitModePreference();
      const resolvedMode = savedMode ?? DEFAULT_HOME_VISIT_MODE;

      if (!savedMode) {
        await setHomeVisitModePreference(resolvedMode);
      }

      if (isMounted) {
        setInitialRouteName(mapHomeVisitModeToRoute(resolvedMode));
      }
    };

    void loadInitialRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!initialRouteName) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="SingleVendor"
        component={SingleVendorNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="MultiVendor"
        component={MultiVendorNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Chain"
        component={ChainNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="MyProfile"
        component={HomeVisitsMyProfileScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="EditProfile"
        component={HomeVisitsEditProfileScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Settings"
        options={hiddenHeaderOptions}
      >
        {() => (
          <HomeVisitsFeaturePlaceholderScreen
            bodyKey="home_visits_settings_body"
            titleKey="settings_title"
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Support"
        component={HomeVisitsSupportScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SupportFaq"
        component={HomeVisitsSupportFaqScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SupportContactForm"
        component={HomeVisitsSupportContactFormScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SupportConversations"
        component={HomeVisitsSupportConversationsScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SupportTickets"
        component={HomeVisitsSupportTicketsScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SupportChat"
        component={HomeVisitsSupportChatScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Wallet"
        options={hiddenHeaderOptions}
      >
        {() => (
          <HomeVisitsFeaturePlaceholderScreen
            bodyKey="home_visits_wallet_body"
            titleKey="profile_wallet_balance"
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ColorMode"
        component={ColorModeScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={hiddenHeaderOptions}
      />
    </Stack.Navigator>
  );
}
