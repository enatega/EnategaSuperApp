import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ChangePasswordScreen from '../../account/screens/ChangePasswordScreen/ChangePasswordScreen';
import ColorModeScreen from '../../account/screens/ColorModeScreen/ColorModeScreen';
import DeleteAccountScreen from '../../account/screens/DeleteAccountScreen/DeleteAccountScreen';
import EditProfileScreen from '../../account/screens/EditProfileScreen/EditProfileScreen';
import LanguageScreen from '../../account/screens/LanguageScreen/LanguageScreen';
import MyProfileScreen from '../../account/screens/MyProfileScreen/MyProfileScreen';
import NotificationSettingsScreen from '../../account/screens/NotificationSettingsScreen/NotificationSettingsScreen';
import PrivacyPolicyScreen from '../../account/screens/PrivacyPolicyScreen/PrivacyPolicyScreen';
import SettingsScreen from '../../account/screens/SettingsScreen/SettingsScreen';
import TermsOfServiceScreen from '../../account/screens/TermsOfServiceScreen/TermsOfServiceScreen';
import TermsOfUseScreen from '../../account/screens/TermsOfUseScreen/TermsOfUseScreen';
import AddressChooseOnMapScreen from '../../screens/addresses/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../screens/addresses/AddressDetailScreen';
import AddressSearchScreen from '../../screens/addresses/AddressSearchScreen';
import SupportChatScreen from '../../screens/SupportChatScreen/SupportChatScreen';
import SupportContactFormScreen from '../../screens/SupportContactFormScreen/SupportContactFormScreen';
import SupportConversationsScreen from '../../screens/SupportConversationsScreen/SupportConversationsScreen';
import SupportFaqArticleScreen from '../../screens/SupportFaqArticleScreen/SupportFaqArticleScreen';
import SupportFaqScreen from '../../screens/SupportFaqScreen/SupportFaqScreen';
import SupportScreen from '../../screens/SupportScreen/SupportScreen';
import SingleVendorDeliveryDetails from '../screens/DeliveryDetails';
import SinglevendorBottomTabNavigator from './SinglevendorBottomTabNavigator';
import type { SingleVendorStackParamList } from './types';

const Stack = createNativeStackNavigator<SingleVendorStackParamList>();

export default function SingleVendorNavigator() {
  const { t } = useTranslation('deliveries');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SingleVendorTabs"
        component={SinglevendorBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleVendorDetails"
        component={SingleVendorDeliveryDetails}
        options={{ title: t('details_title') }}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsOfUse"
        component={TermsOfUseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ColorMode"
        component={ColorModeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportChat"
        component={SupportChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportFaq"
        component={SupportFaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportConversations"
        component={SupportConversationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportContactForm"
        component={SupportContactFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportFaqArticle"
        component={SupportFaqArticleScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
