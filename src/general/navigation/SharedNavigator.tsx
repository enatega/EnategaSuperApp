import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  setActiveAppRoute,
  setPendingAppRoute,
} from "./pendingAppRedirect";
import { resetToSharedRoute } from "./rootNavigation";
import { useAppTheme } from "../theme/ThemeProvider";
import type { ThemedMiniAppId } from "../theme/colors";

const Stack = createNativeStackNavigator<SharedStackParamList>();
const APP_ROUTES: Partial<Record<MiniAppId, SharedAppRouteName>> = {
  deliveries: "Deliveries",
  rideSharing: "RideSharing",
  homeVisits: "HomeVisits",
  appointments: "Appointments",
  developerMode: "DeveloperMode",
};

type AppThemeScopeProps = {
  appId: ThemedMiniAppId;
  children: React.ReactNode;
};

function AppThemeScope({ appId, children }: AppThemeScopeProps) {
  const { setActiveMiniApp } = useAppTheme();

  useFocusEffect(
    useCallback(() => {
      setActiveMiniApp(appId);
      return undefined;
    }, [appId, setActiveMiniApp]),
  );

  return <>{children}</>;
}

export default function SharedNavigator() {
  const [initialRouteName, setInitialRouteName] = useState<
    keyof SharedStackParamList | null
  >(null);

  useEffect(() => {
    // Always land users on the shared Home screen on app start.
    setInitialRouteName("Home");
  }, []);

  const handleSelectMiniApp = useCallback(
    async (
      id: MiniAppId,
      navigation: NativeStackNavigationProp<SharedStackParamList, "Home">,
      params?: SharedStackParamList[SharedAppRouteName],
    ) => {
      const routeName = APP_ROUTES[id];
      if (routeName === "DeveloperMode") {
        navigation.navigate(routeName);
        return;
      }

      if (!routeName) {
        return;
      }

      const token = await authSession.getAccessToken();

      if (token) {
        await setActiveAppRoute(routeName);
        resetToSharedRoute(routeName, params);
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
          <AppThemeScope appId="general">
            <HomeScreen
              {...props}
              onSelectMiniApp={(id, params) => {
                void handleSelectMiniApp(id, props.navigation, params);
              }}
            />
          </AppThemeScope>
        )}
      </Stack.Screen>
      <Stack.Screen name="Deliveries" options={{ headerShown: false }}>
        {() => (
          <AppThemeScope appId="deliveries">
            <DeliveriesNavigator />
          </AppThemeScope>
        )}
      </Stack.Screen>
      <Stack.Screen name="RideSharing" options={{ headerShown: false }}>
        {() => (
          <AppThemeScope appId="rideSharing">
            <RideSharingNavigator />
          </AppThemeScope>
        )}
      </Stack.Screen>
      <Stack.Screen name="HomeVisits" options={{ headerShown: false }}>
        {() => (
          <AppThemeScope appId="homeVisits">
            <HomeVisitsNavigator />
          </AppThemeScope>
        )}
      </Stack.Screen>
      <Stack.Screen name="Appointments" options={{ headerShown: false }}>
        {() => (
          <AppThemeScope appId="appointments">
            <AppointmentsNavigator />
          </AppThemeScope>
        )}
      </Stack.Screen>
      <Stack.Screen name="DeveloperMode" options={{ headerShown: false }}>
        {() => (
          <AppThemeScope appId="developerMode">
            <DeveloperModeNavigator />
          </AppThemeScope>
        )}
      </Stack.Screen>
      <Stack.Screen name="Auth" options={{ headerShown: false }}>
        {() => (
          <AppThemeScope appId="general">
            <AuthNavigator />
          </AppThemeScope>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
