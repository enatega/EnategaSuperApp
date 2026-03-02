import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { useTheme } from './src/general/theme/theme';
import { LocalizationProvider } from './src/general/localization/LocalizationProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/general/localization/i18n';

export default function App() {
  const { isDark } = useTheme();
  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <RootNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
