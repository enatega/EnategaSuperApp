import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideSharingHomeScreen from '../screens/home/HomeScreen';
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
import RideEstimateScreen from '../screens/rideEstimate/RideEstimateScreen';
import OfferFareScreen from '../screens/offerFare/OfferFareScreen';
import CourierDetailsScreen from '../screens/courierDetails/CourierDetails';
import ReservationsListScreen from '../screens/reservations/ReservationsListScreen';
import ReservationDetailScreen from '../screens/reservations/ReservationDetailScreen';
import RiderChatScreen from '../screens/riderChat/RiderChatScreen';
import SafetyScreen from '../screens/safety/SafetyScreen';
import WalletHomeScreen from '../screens/wallet/WalletHomeScreen';
import AddFundsScreen from '../screens/wallet/AddFundsScreen';
import RideSupportChatScreen from '../screens/support/RideSupportChatScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import NotificationDetailScreen from '../screens/notifications/NotificationDetailScreen';
import RideHistoryScreen from '../screens/rideHistory/RideHistoryScreen';
import { useTranslation } from 'react-i18next';
import type { RideAddressSelection } from '../api/types';
import type { CachedAddress } from '../components/rideOptions/types';
import type { PaymentMethodId } from '../components/payment/paymentTypes';
import type { RideOfferMode } from '../utils/rideOffer';
import type { RideCategory, RideIntent } from '../utils/rideOptions';
import { useInitializeRideSharingConfig } from '../hooks/useInitializeRideSharingConfig';

export type RideSharingStackParamList = {
  RideSharingHome: undefined;
  RideAddressSearch: {
    rideType?: RideIntent;
    rideCategory?: RideCategory;
    prefilledFromAddress?: CachedAddress;
    prefilledStopAddress?: RideAddressSelection;
    fromAddress?: RideAddressSelection;
    toAddress?: RideAddressSelection;
    stops?: RideAddressSelection[];
    stopAction?: 'add' | 'edit';
    stopIndex?: number;
  } | undefined;
  RideEstimate: {
    rideType?: RideIntent;
    rideCategory?: RideCategory;
    fromAddress: RideAddressSelection;
    toAddress: RideAddressSelection;
    stops?: RideAddressSelection[];
    offeredFare?: number;
    paymentMethodId?: PaymentMethodId;
    offerMode?: RideOfferMode;
    hourlyHours?: number;
  };
  OfferFare: {
    rideType?: RideIntent;
    rideCategory?: RideCategory;
    fromAddress: RideAddressSelection;
    toAddress: RideAddressSelection;
    stops?: RideAddressSelection[];
    offeredFare?: number;
    recommendedFare?: number;
    paymentMethodId?: PaymentMethodId;
    offerMode?: RideOfferMode;
    hourlyHours?: number;
  };
  CourierDetails: {
    rideType?: RideIntent;
    rideCategory?: RideCategory;
    fromAddress: RideAddressSelection;
    toAddress: RideAddressSelection;
    stops?: RideAddressSelection[];
    offeredFare?: number;
    paymentMethodId?: PaymentMethodId;
    offerMode?: RideOfferMode;
    hourlyHours?: number;
    source?: 'addressSearch' | 'rideEstimate';
  };
  RideDetails: undefined;
  DriverProfile: {
    userId?: string;
  };
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
  ReservationsList: undefined;
  ReservationDetail: {
    rideId: string;
  };
  RiderChat: {
    driverAvatarUri?: string;
    driverName: string;
    driverPhone?: string;
    driverUserId: string;
  };
  Safety: {
    driverName?: string;
    driverAvatarUri?: string;
    driverRating?: number;
    vehicleLabel?: string;
    pickupLatitude?: number;
    pickupLongitude?: number;
    dropoffLatitude?: number;
    dropoffLongitude?: number;
  };
  RideSupportChat: {
    chatBoxId?: string;
    receiverId?: string;
  } | undefined;
  WalletHome: undefined;
  WalletAddFunds: undefined;
  Notifications: undefined;
  RideHistory: undefined;
  NotificationDetail: {
    notificationId: string;
    title: string;
    description: string;
    createdAt: string;
  };
};

const Stack = createNativeStackNavigator();

export default function RideSharingNavigator() {
  const { t } = useTranslation('rideSharing');
  useInitializeRideSharingConfig();

  return (
    <Stack.Navigator>
      <Stack.Screen name="RideSharingHome" component={RideSharingHomeScreen} options={{ headerShown:false, title: t('header_title') }} />
      <Stack.Screen name="RideAddressSearch" component={RideAddressSearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RideEstimate" component={RideEstimateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OfferFare" component={OfferFareScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CourierDetails" component={CourierDetailsScreen} options={{ headerShown: false }} />
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
      {/* Reservation Screens */}
      <Stack.Screen
        name="ReservationsList"
        component={ReservationsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReservationDetail"
        component={ReservationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RiderChat"
        component={RiderChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Safety"
        component={SafetyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RideSupportChat"
        component={RideSupportChatScreen}
        options={{ headerShown: false }}
      />
      {/* Wallet Screens */}
      <Stack.Screen
        name="WalletHome"
        component={WalletHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WalletAddFunds"
        component={AddFundsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RideHistory"
        component={RideHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
