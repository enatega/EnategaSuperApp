import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentDetails from '../screens/AppointmentDetails';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import AddressSearchScreen from '../../../general/screens/address/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../../general/screens/address/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../../general/screens/address/AddressDetailScreen';
import NotificationsScreen from '../../../general/screens/notifications/NotificationsScreen';
import PrivacyPolicyScreen from '../../../general/screens/settings/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../../../general/screens/settings/TermsOfServiceScreen';
import TermsOfUseScreen from '../../../general/screens/settings/TermsOfUseScreen';
import DeleteAccountScreen from '../../../general/screens/settings/DeleteAccountScreen';
import ColorModeScreen from '../../../general/screens/settings/ColorModeScreen';
import LanguageScreen from '../../../general/screens/settings/LanguageScreen';
import AppointmentsMyProfileScreen from '../screens/profile/AppointmentsMyProfileScreen';
import AppointmentsEditProfileScreen from '../screens/profile/AppointmentsEditProfileScreen';
import AppointmentsSettingsScreen from '../screens/settings/AppointmentsSettingsScreen';
import AppointmentsNotificationSettingsScreen from '../screens/settings/AppointmentsNotificationSettingsScreen';
import AppointmentsChangePasswordScreen from '../screens/settings/AppointmentsChangePasswordScreen';
import AppointmentsWalletScreen from '../screens/wallet/AppointmentsWalletScreen';
import AppointmentsAddCardScreen from '../screens/wallet/AppointmentsAddCardScreen';
import AppointmentsWalletTransactionsScreen from '../screens/wallet/AppointmentsWalletTransactionsScreen';
import AppointmentsSupportScreen from '../screens/support/AppointmentsSupportScreen';
import AppointmentsSupportFaqScreen from '../screens/support/AppointmentsSupportFaqScreen';
import AppointmentsSupportConversationsScreen from '../screens/support/AppointmentsSupportConversationsScreen';
import AppointmentsSupportContactFormScreen from '../screens/support/AppointmentsSupportContactFormScreen';
import AppointmentsSupportChatScreen from '../screens/support/AppointmentsSupportChatScreen';
import AppointmentsSupportTicketsScreen from '../screens/support/AppointmentsSupportTicketsScreen';
import AppointmentsSupportTicketDetailScreen from '../screens/support/AppointmentsSupportTicketDetailScreen';
import AppointmentsCouponsScreen from '../screens/AppointmentsCouponsScreen';
import FavouritesScreen from '../multiVendor/screens/FavouritesScreen/FavouritesScreen';
import AppointmentBookingDetailScreen from '../screens/AppointmentBookingDetailScreen';
import AppointmentDetailsPage from '../screens/AppointmentDetailsPage';
import AppointmentsModeSelectorScreen from '../screens/AppointmentsModeSelectorScreen';
import { useTranslation } from 'react-i18next';
import type { AppointmentsStackParamList } from './types';
import { useInitializeAppointmentsConfig } from '../hooks/useInitializeAppointmentsConfig';
import { useAppointmentsConfigStore } from '../stores/useAppointmentsConfigStore';

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

const hiddenHeaderOptions = { headerShown: false } as const;

export default function AppointmentsNavigator() {
  const { t } = useTranslation('appointments');
  const isLoaded = useAppointmentsConfigStore((state) => state.isLoaded);
  const configQuery = useInitializeAppointmentsConfig();

  if (configQuery.isHydratingCache || (!isLoaded && configQuery.isPending)) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName="AppointmentsModeSelector">
      <Stack.Screen
        name="AppointmentsModeSelector"
        component={AppointmentsModeSelectorScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetails}
        options={{ title: t('details_title') }}
      />
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
      <Stack.Screen name="MyProfile" component={AppointmentsMyProfileScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="EditProfile" component={AppointmentsEditProfileScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="Settings" component={AppointmentsSettingsScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="NotificationSettings" component={AppointmentsNotificationSettingsScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="ChangePassword" component={AppointmentsChangePasswordScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="Wallet" component={AppointmentsWalletScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="WalletAddCard" component={AppointmentsAddCardScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="WalletTransactions" component={AppointmentsWalletTransactionsScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="ColorMode" component={ColorModeScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="Language" component={LanguageScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="Support" component={AppointmentsSupportScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="SupportFaq" component={AppointmentsSupportFaqScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="SupportConversations" component={AppointmentsSupportConversationsScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="SupportContactForm" component={AppointmentsSupportContactFormScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="SupportChat" component={AppointmentsSupportChatScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="SupportTickets" component={AppointmentsSupportTicketsScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="SupportTicketDetail" component={AppointmentsSupportTicketDetailScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="AppointmentCoupons" component={AppointmentsCouponsScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="AppointmentFavourites" component={FavouritesScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="MultiVendorDetails" component={AppointmentDetailsPage} options={hiddenHeaderOptions} />
      <Stack.Screen name="AppointmentBookingDetail" component={AppointmentBookingDetailScreen} options={hiddenHeaderOptions} />
      <Stack.Screen name="AppointmentNotifications" options={hiddenHeaderOptions}>
        {({ navigation }) => (
          <NotificationsScreen
            appPrefix="general-bookings"
            apiPathPrefix="/api/v1/apps/general-bookings/users-notifications"
            authenticatedUserRoutes
            onNotificationPress={(notification) => {
              const orderId = notification.data?.orderId;
              if (typeof orderId === 'string' && orderId) navigation.navigate('AppointmentBookingDetail', { orderId });
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
