import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useAppTheme } from './src/general/theme/ThemeProvider';
import { LocalizationProvider } from './src/general/localization/LocalizationProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/general/localization/i18n';

function ThemedApp() {
  const { theme } = useAppTheme();
  return (
    <>
      <RootNavigator />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </>
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
