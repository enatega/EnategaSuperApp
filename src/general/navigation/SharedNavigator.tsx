import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import AuthNavigator from "./AuthNavigator";
import { authSession } from "../auth/authSession";
import type { MiniAppId } from "../utils/constants";
import type {
  SharedStackParamList,
} from "./navigationTypes";
import {
  setActiveAppRoute,
  setPendingAppRoute,
} from "./pendingAppRedirect";
import { resetToSharedRoute } from "./rootNavigation";
import { useAppTheme } from "../theme/ThemeProvider";
import type { ThemedMiniAppId } from "../theme/colors";
import {
  APP_ROUTE_BY_ID,
  APP_SCREENS,
  type SharedAppRouteName,
} from "../../apps/registry/generated/appRegistry";

const Stack = createNativeStackNavigator<SharedStackParamList>();
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
      const routeName = APP_ROUTE_BY_ID[id];
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
      {Object.entries(APP_ROUTE_BY_ID).map(([appId, routeName]) => {
        if (!routeName) {
          return null;
        }

        const ScreenComponent = APP_SCREENS[routeName];
        if (!ScreenComponent) {
          return null;
        }

        return (
          <Stack.Screen key={routeName} name={routeName} options={{ headerShown: false }}>
            {() => (
              <AppThemeScope appId={appId as ThemedMiniAppId}>
                <ScreenComponent />
              </AppThemeScope>
            )}
          </Stack.Screen>
        );
      })}
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
