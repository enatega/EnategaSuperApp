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
import RideEstimateScreen from '../screens/rideEstimate/RideEstimateScreen';
import OfferFareScreen from '../screens/offerFare/OfferFareScreen';
import CourierDetailsScreen from '../screens/courierDetails/CourierDetails';
import ReservationsListScreen from '../screens/reservations/ReservationsListScreen';
import ReservationDetailScreen from '../screens/reservations/ReservationDetailScreen';
import RiderChatScreen from '../screens/riderChat/RiderChatScreen';
import { useTranslation } from 'react-i18next';
import QueryProvider from '../../../general/providers/QueryProvider';
import type { RideAddressSelection } from '../api/types';
import type { CachedAddress } from '../components/rideOptions/types';
import type { PaymentMethodId } from '../components/payment/paymentTypes';
import type { RideOfferMode } from '../utils/rideOffer';
import type { RideCategory, RideIntent } from '../utils/rideOptions';

export type RideSharingStackParamList = {
  RideSharingHome: undefined;
  RideOptions: undefined;
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
      </Stack.Navigator>
    </QueryProvider>
  );
}
