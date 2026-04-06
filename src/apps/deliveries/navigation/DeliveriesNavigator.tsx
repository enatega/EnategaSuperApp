import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DeliveriesHomeScreen from "../screens/HomeScreen";
import SingleVendorNavigator from "../singleVendor/navigation/SingleVendorNavigator";
import MultiVendorNavigator from "../multiVendor/navigation/MultiVendorNavigator";
import ChainNavigator from "../chain/navigation/ChainNavigator";
import { useTranslation } from "react-i18next";
import ProductInfo from "../screens/ProductInfo/ProductInfo";
import CartScreen from "../screens/CartScreen/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen/CheckoutScreen";
import RateOrderScreen from '../screens/RateOrderScreen/RateOrderScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen/OrderTrackingScreen';
import MyProfileScreen from "../account/screens/MyProfileScreen/MyProfileScreen";
import EditProfileScreen from "../account/screens/EditProfileScreen/EditProfileScreen";
import SettingsScreen from "../account/screens/SettingsScreen/SettingsScreen";
import NotificationSettingsScreen from "../account/screens/NotificationSettingsScreen/NotificationSettingsScreen";
import PrivacyPolicyScreen from "../account/screens/PrivacyPolicyScreen/PrivacyPolicyScreen";
import TermsOfServiceScreen from "../account/screens/TermsOfServiceScreen/TermsOfServiceScreen";
import TermsOfUseScreen from "../account/screens/TermsOfUseScreen/TermsOfUseScreen";
import ChangePasswordScreen from "../account/screens/ChangePasswordScreen/ChangePasswordScreen";
import DeleteAccountScreen from "../account/screens/DeleteAccountScreen/DeleteAccountScreen";
import ColorModeScreen from "../account/screens/ColorModeScreen/ColorModeScreen";
import LanguageScreen from "../account/screens/LanguageScreen/LanguageScreen";
import AddressSearchScreen from "../screens/addresses/AddressSearchScreen";
import AddressChooseOnMapScreen from "../screens/addresses/AddressChooseOnMapScreen";
import AddressDetailScreen from "../screens/addresses/AddressDetailScreen";
import SupportScreen from "../screens/SupportScreen/SupportScreen";
import SupportChatScreen from "../screens/SupportChatScreen/SupportChatScreen";
import SupportConversationsScreen from "../screens/SupportConversationsScreen/SupportConversationsScreen";
import SupportContactFormScreen from "../screens/SupportContactFormScreen/SupportContactFormScreen";
import SupportFaqScreen from "../screens/SupportFaqScreen/SupportFaqScreen";
import SupportFaqArticleScreen from "../screens/SupportFaqArticleScreen/SupportFaqArticleScreen";
import {
  DEFAULT_DELIVERY_MODE,
  getDeliveryModePreference,
  mapDeliveryModeToRoute,
  setDeliveryModePreference,
  
} from "./deliveryModePreference";
import type { DeliveriesStackParamList } from "./types";

const Stack = createNativeStackNavigator<DeliveriesStackParamList>();

type DeliveriesEntryRouteName =
  | "DeliveriesHome"
  | "SingleVendor"
  | "MultiVendor"
  | "Chain";

const sharedScreenOptions = { headerShown: false } as const;

export default function DeliveriesNavigator() {
  const { t } = useTranslation("deliveries");
  const [initialRouteName, setInitialRouteName] =
    useState<DeliveriesEntryRouteName | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialRoute = async () => {
      const savedMode = await getDeliveryModePreference();
      const resolvedMode = savedMode ?? DEFAULT_DELIVERY_MODE;

      if (!savedMode) {
        await setDeliveryModePreference(resolvedMode);
      }

      if (isMounted) {
        setInitialRouteName(mapDeliveryModeToRoute(resolvedMode));
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
        name="DeliveriesHome"
        options={{ title: t("header_title") }}
      >
        {(props) => (
          <DeliveriesHomeScreen
            {...props}
            onSelect={(type) => {
              void setDeliveryModePreference(type);
              props.navigation.replace(mapDeliveryModeToRoute(type));
            }}
          />
        )}
      </Stack.Screen>

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
        component={MyProfileScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
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
        name="Checkout"
        component={CheckoutScreen}
        options={sharedScreenOptions}
      />
    </Stack.Navigator>
  );
}
