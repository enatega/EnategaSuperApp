import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import OfflineNotice from './src/general/components/OfflineNotice';
import { ThemeProvider, useAppTheme } from './src/general/theme/ThemeProvider';
import { LocalizationProvider } from './src/general/localization/LocalizationProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/general/localization/i18n';

function ThemedApp() {
  const { theme } = useAppTheme();
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
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <LocalizationProvider>
          <ThemedApp />
        </LocalizationProvider>
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
