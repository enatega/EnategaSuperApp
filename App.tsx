import React from "react";
import { StyleSheet, View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation/RootNavigator";
import OfflineNotice from './src/general/components/OfflineNotice';
import { ThemeProvider, useAppTheme } from "./src/general/theme/ThemeProvider";
import { LocalizationProvider } from "./src/general/localization/LocalizationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import QueryProvider from "./src/general/providers/QueryProvider";
import { StripeProvider } from "@stripe/stripe-react-native";
import "./src/general/localization/i18n";
import AppToast from "./src/general/components/AppToast";
import { useSocketSession } from "./src/general/hooks/useSocketSession";

function ThemedApp() {
  const { theme } = useAppTheme();
  useSocketSession();

  return (
    <View style={styles.container}>
      <OfflineNotice />
      <View style={styles.navigatorWrap}>
        <RootNavigator />
      </View>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
  const hasStripePublishableKey = stripePublishableKey.trim().length > 0;

  if (__DEV__) {
    // Debug Stripe bootstrap state to quickly spot env/config issues.
    console.log('[Stripe] EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY configured:', hasStripePublishableKey);
    if (!hasStripePublishableKey) {
      console.log('[Stripe] Missing publishable key. Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env and rebuild app.');
    }
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StripeProvider publishableKey={stripePublishableKey}>
          <QueryProvider>
            <LocalizationProvider>
              <ThemedApp />
              <AppToast />
            </LocalizationProvider>
          </QueryProvider>
        </StripeProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigatorWrap: {
    flex: 1,
  },
});
