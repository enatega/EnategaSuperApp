import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingleVendorNavigator from "../singleVendor/navigation/SingleVendorNavigator";
import MultiVendorNavigator from "../multiVendor/navigation/MultiVendorNavigator";
import ChainNavigator from "../chain/navigation/ChainNavigator";
import ProductInfo from "../screens/ProductInfo/ProductInfo";
import CartScreen from "../screens/CartScreen/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen/CheckoutScreen";
import RateOrderScreen from '../screens/RateOrderScreen/RateOrderScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen/OrderTrackingScreen';
import DeliveriesMyProfileScreen from "../screens/profile/DeliveriesMyProfileScreen";
import DeliveriesEditProfileScreen from "../screens/profile/DeliveriesEditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen/NotificationSettingsScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen/PrivacyPolicyScreen";
import TermsOfServiceScreen from "../screens/TermsOfServiceScreen/TermsOfServiceScreen";
import TermsOfUseScreen from "../screens/TermsOfUseScreen/TermsOfUseScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen/ChangePasswordScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen/DeleteAccountScreen";
import ColorModeScreen from "../../../general/screens/settings/ColorModeScreen";
import LanguageScreen from "../../../general/screens/settings/LanguageScreen";
import AddressSearchScreen from "../../../general/screens/address/AddressSearchScreen";
import AddressChooseOnMapScreen from "../../../general/screens/address/AddressChooseOnMapScreen";
import AddressDetailScreen from "../../../general/screens/address/AddressDetailScreen";
import WalletScreen from "../screens/wallet/WalletScreen/WalletScreen";
import NotificationsScreen from "../../../general/screens/notifications/NotificationsScreen";
import AddCardScreen from "../screens/wallet/AddCardScreen/AddCardScreen";
import WalletTransactionsScreen from "../screens/wallet/WalletTransactionsScreen/WalletTransactionsScreen";
import SupportScreen from "../screens/SupportScreen/SupportScreen";
import SupportChatScreen from "../screens/SupportChatScreen/SupportChatScreen";
import SupportConversationsScreen from "../screens/SupportConversationsScreen/SupportConversationsScreen";
import SupportContactFormScreen from "../screens/SupportContactFormScreen/SupportContactFormScreen";
import SupportFaqScreen from "../screens/SupportFaqScreen/SupportFaqScreen";
import SupportFaqArticleScreen from "../screens/SupportFaqArticleScreen/SupportFaqArticleScreen";
import SupportTicketsScreen from "../screens/SupportTicketsScreen/SupportTicketsScreen";
import SupportTicketDetailScreen from "../screens/SupportTicketDetailScreen";
import RiderChatScreen from "../screens/RiderChatScreen/RiderChatScreen";
import {
  mapDeliveryModeToRoute,
} from "./deliveryModePreference";
import type { DeliveriesStackParamList } from "./types";
import DeliveriesSeeAllScreen from "../screens/SeeAllScreen/DeliveriesSeeAllScreen";
import DealsSeeAll from "../screens/DealsSeeAll/DealsSeeAll";
import SingleVendorCategoriesSeeAll from "../screens/SingleVendorCategoriesSeeAll/SingleVendorCategoriesSeeAll";
import SingleVendorCategoryProductsSeeAll from "../screens/SingleVendorCategoryProductsSeeAll/SingleVendorCategoryProductsSeeAll";
import ChainCategoriesSeeAll from "../screens/ChainCategoriesSeeAll/ChainCategoriesSeeAll";
import ChainCategoryProductsSeeAll from "../screens/ChainCategoryProductsSeeAll/ChainCategoryProductsSeeAll";
import DeliveriesStartupSkeleton from "../components/DeliveriesStartupSkeleton";
import { useInitializeDeliveriesConfig } from "../hooks/useInitializeDeliveriesConfig";
import { useDeliveriesDeliveryMode } from "../../../general/stores/useAppConfigStore";

const Stack = createNativeStackNavigator<DeliveriesStackParamList>();

const sharedScreenOptions = { headerShown: false } as const;

export default function DeliveriesNavigator() {
  const deliveryMode = useDeliveriesDeliveryMode();
  const configQuery = useInitializeDeliveriesConfig();

  if (!deliveryMode || configQuery.isLoading || configQuery.isFetching) {
    return <DeliveriesStartupSkeleton />;
  }

  return (
    <Stack.Navigator initialRouteName={mapDeliveryModeToRoute(deliveryMode)}>
      <Stack.Screen
        name="SingleVendor"
        component={SingleVendorNavigator}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="MultiVendor"
        component={MultiVendorNavigator}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Chain"
        component={ChainNavigator}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="MyProfile"
        component={DeliveriesMyProfileScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="EditProfile"
        component={DeliveriesEditProfileScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="TermsOfUse"
        component={TermsOfUseScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ColorMode"
        component={ColorModeScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Notifications"
        options={sharedScreenOptions}
      >
        {() => <NotificationsScreen appPrefix="deliveries" />}
      </Stack.Screen>
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="WalletTransactions"
        component={WalletTransactionsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportChat"
        component={SupportChatScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportFaq"
        component={SupportFaqScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportConversations"
        component={SupportConversationsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportContactForm"
        component={SupportContactFormScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportFaqArticle"
        component={SupportFaqArticleScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportTickets"
        component={SupportTicketsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SupportTicketDetail"
        component={SupportTicketDetailScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ProductInfo"
        component={ProductInfo}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="RateOrder"
        component={RateOrderScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="OrderTrackingScreen"
        component={OrderTrackingScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="RiderChat"
        component={RiderChatScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SeeAllScreen"
        component={DeliveriesSeeAllScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="DealsSeeAll"
        component={DealsSeeAll}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SingleVendorCategoriesSeeAll"
        component={SingleVendorCategoriesSeeAll}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SingleVendorCategoryProductsSeeAll"
        component={SingleVendorCategoryProductsSeeAll}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ChainCategoriesSeeAll"
        component={ChainCategoriesSeeAll}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ChainCategoryProductsSeeAll"
        component={ChainCategoryProductsSeeAll}
        options={sharedScreenOptions}
      />
    </Stack.Navigator>
  );
}
