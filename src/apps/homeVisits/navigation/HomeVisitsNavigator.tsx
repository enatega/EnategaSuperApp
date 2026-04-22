import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import HomeVisitsMyProfileScreen from '../screens/profile/HomeVisitsMyProfileScreen';
import HomeVisitsEditProfileScreen from '../screens/profile/HomeVisitsEditProfileScreen';
import HomeVisitsFeaturePlaceholderScreen from '../screens/profile/HomeVisitsFeaturePlaceholderScreen';
import HomeVisitsSettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen/NotificationSettingsScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen/TermsOfServiceScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen/TermsOfUseScreen';
import DeleteAccountScreen from '../screens/DeleteAccountScreen/DeleteAccountScreen';
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
        component={HomeVisitsSettingsScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="TermsOfUse"
        component={TermsOfUseScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Support"
        options={hiddenHeaderOptions}
      >
        {() => (
          <HomeVisitsFeaturePlaceholderScreen
            bodyKey="home_visits_support_body"
            titleKey="profile_menu_support"
          />
        )}
      </Stack.Screen>
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
