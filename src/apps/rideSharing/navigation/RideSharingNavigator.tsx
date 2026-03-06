import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideSharingHomeScreen from '../screens/home/HomeScreen';
import RideOptionsScreen from '../screens/rideOptions/RideOptionsScreen';
import RideDetails from '../screens/rideDetails/RideDetails';
import DriverProfileScreen from '../screens/driverProfile/DriverProfileScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import EditNameScreen from '../screens/profile/EditNameScreen';
import EditPhoneScreen from '../screens/profile/EditPhoneScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import UpdatePasswordScreen from '../screens/settings/UpdatePasswordScreen';
import LanguageScreen from '../screens/settings/LanguageScreen';
import AppearanceScreen from '../screens/settings/AppearanceScreen';
import RulesAndTermsScreen from '../screens/settings/RulesAndTermsScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';
import LicencesScreen from '../screens/settings/LicencesScreen';
import RideAddressSearchScreen from '../screens/rideSearch/RideAddressSearchScreen';
import { useTranslation } from 'react-i18next';
import QueryProvider from '../../../general/providers/QueryProvider';

export type RideSharingStackParamList = {
  RideSharingHome: undefined;
  RideOptions: undefined;
  RideDetails: undefined;
  DriverProfile: undefined;
  PersonalInfo: undefined;
  EditName: undefined;
  EditPhone: undefined;
  Settings: undefined;
  UpdatePassword: undefined;
  Language: undefined;
  Appearance: undefined;
  RulesAndTerms: undefined;
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  Licences: undefined;
};

const Stack = createNativeStackNavigator();

export default function RideSharingNavigator() {
  const { t } = useTranslation('rideSharing');
  return (
    <QueryProvider>
      <Stack.Navigator>
        <Stack.Screen name="RideSharingHome" component={RideSharingHomeScreen} options={{ headerShown:false, title: t('header_title') }} />
        <Stack.Screen name="RideOptions" component={RideOptionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideAddressSearch" component={RideAddressSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideDetails" component={RideDetails} options={{ title: t('details_title') }} />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ headerShown: false }}
        />
        {/* Profile Screens */}
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditName"
          component={EditNameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPhone"
          component={EditPhoneScreen}
          options={{ headerShown: false }}
        />
        {/* Settings Screens */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Appearance"
          component={AppearanceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RulesAndTerms"
          component={RulesAndTermsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditionsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Licences"
          component={LicencesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryProvider>
  );
}
