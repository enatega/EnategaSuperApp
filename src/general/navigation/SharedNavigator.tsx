import React, { useCallback, useEffect, useState } from "react";
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import DeliveriesNavigator from "../../apps/deliveries/navigation/DeliveriesNavigator";
import RideSharingNavigator from "../../apps/rideSharing/navigation/RideSharingNavigator";
import HomeVisitsNavigator from "../../apps/homeVisits/navigation/HomeVisitsNavigator";
import AppointmentsNavigator from "../../apps/appointments/navigation/AppointmentsNavigator";
import DeveloperModeNavigator from "../../apps/developerMode/navigation/DeveloperModeNavigator";
import AuthNavigator from "./AuthNavigator";
import { authSession } from "../auth/authSession";
import type { MiniAppId } from "../utils/constants";
import type {
  SharedAppRouteName,
  SharedStackParamList,
} from "./navigationTypes";
import {
  getActiveAppRoute,
  setActiveAppRoute,
  setPendingAppRoute,
} from "./pendingAppRedirect";
import { resetToSharedRoute } from "./rootNavigation";
import { useGlobalEmergencyContact } from "../hooks/useGlobalEmergencyContact";

const Stack = createNativeStackNavigator<SharedStackParamList>();
const APP_ROUTES: Partial<Record<MiniAppId, SharedAppRouteName>> = {
  deliveries: "Deliveries",
  rideSharing: "RideSharing",
  homeVisits: "HomeVisits",
  appointments: "Appointments",
  developerMode: "DeveloperMode",
};

export default function SharedNavigator() {
  const [initialRouteName, setInitialRouteName] = useState<
    keyof SharedStackParamList | null
  >(null);

  useGlobalEmergencyContact();

  useEffect(() => {
    let isMounted = true;

    const resolveInitialRoute = async () => {
      const [token, activeAppRoute] = await Promise.all([
        authSession.getAccessToken(),
        getActiveAppRoute(),
      ]);

      if (!isMounted) {
        return;
      }

      if (!token) {
        setInitialRouteName("Home");
        return;
      }

      const resolvedRoute = activeAppRoute ?? "RideSharing";
      if (!activeAppRoute) {
        await setActiveAppRoute(resolvedRoute);
      }

      setInitialRouteName(resolvedRoute);
    };

    void resolveInitialRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectMiniApp = useCallback(
    async (
      id: MiniAppId,
      navigation: NativeStackNavigationProp<SharedStackParamList, "Home">,
    ) => {
      const routeName = APP_ROUTES[id];
      if (routeName == APP_ROUTES["developerMode"]) {
        navigation.navigate(routeName);
        return;
      }

      if (!routeName) {
        return;
      }

      const token = await authSession.getAccessToken();

      if (token) {
        await setActiveAppRoute(routeName);
        resetToSharedRoute(routeName);
        return;
      }

      await setPendingAppRoute(routeName);
      navigation.navigate("Auth");
    },
    [],
  );

  if (!initialRouteName) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => (
          <HomeScreen
            {...props}
            onSelectMiniApp={(id) => {
              void handleSelectMiniApp(id, props.navigation);
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Deliveries"
        component={DeliveriesNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RideSharing"
        component={RideSharingNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeVisits"
        component={HomeVisitsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appointments"
        component={AppointmentsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeveloperMode"
        component={DeveloperModeNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
