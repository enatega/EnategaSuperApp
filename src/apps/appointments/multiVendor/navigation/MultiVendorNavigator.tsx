import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import NotificationsScreen from "../../../../general/screens/notifications/NotificationsScreen";
import type { MultiVendorStackParamList } from "./types";
import AppointmentBookingSuccessScreen from "../../screens/AppointmentBookingSuccessScreen";
import AppointmentBookingDetailScreen from "../../screens/AppointmentBookingDetailScreen";
import AppointmentCartScreen from "../../screens/AppointmentCartScreen";
import AppointmentDetailsPage from "../../screens/AppointmentDetailsPage";
import AppointmentReviewConfirmScreen from "../../screens/AppointmentReviewConfirmScreen";
import AppointmentTeamScreen from "../../screens/AppointmentTeamScreen";
import AppointmentServicesScreen from "../screens/AppointmentServicesScreen";
import AppointmentsSeeAllScreen from "../screens/AppointmentsSeeAllScreen";
import FavouritesScreen from "../screens/FavouritesScreen/FavouritesScreen";
import MultiVendorBottomTabNavigator from "./MultiVendorBottomTabNavigator";

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();

export default function MultiVendorNavigator() {
  const { t } = useTranslation("appointments");

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MultiVendorTabs"
        component={MultiVendorBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiVendorDetails"
        component={AppointmentDetailsPage}
        options={{ headerShown: false, title: t("screen_details") }}
      />
      <Stack.Screen
        name="Services"
        component={AppointmentServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentCart"
        component={AppointmentCartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentsSeeAll"
        component={AppointmentsSeeAllScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Team"
        component={AppointmentTeamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewConfirm"
        component={AppointmentReviewConfirmScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingSuccess"
        component={AppointmentBookingSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentBookingDetail"
        component={AppointmentBookingDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiVendorNotifications"
        options={{ headerShown: false }}
      >
        {({ navigation }) => (
          <NotificationsScreen
            appPrefix="general-bookings"
            apiPathPrefix="/api/v1/apps/general-bookings/users-notifications"
            authenticatedUserRoutes
            onNotificationPress={(notification) => {
              const orderId = notification.data?.orderId;
              if (typeof orderId === "string" && orderId) {
                navigation.navigate("AppointmentBookingDetail", { orderId });
              }
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
