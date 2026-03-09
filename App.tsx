import React from "react";
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation/RootNavigator";
import { useTheme } from "./src/general/theme/theme";
import { LocalizationProvider } from "./src/general/localization/LocalizationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import QueryProvider from "./src/general/providers/QueryProvider";
import "./src/general/localization/i18n";
import Toast from "react-native-toast-message";

export default function App() {
  const { isDark } = useTheme();
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <LocalizationProvider>
          <RootNavigator />
          <StatusBar style={isDark ? "light" : "dark"} />
          <Toast />
        </LocalizationProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
