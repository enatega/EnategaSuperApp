import React, { useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SharedNavigator from '../general/navigation/SharedNavigator';
import type { RootStackParamList } from '../general/navigation/navigationTypes';
import { navigationRef } from '../general/navigation/rootNavigation';
import { useTheme } from '../general/theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { colors, isDark } = useTheme();
  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (
          <Stack.Screen name="Splash">
            {() => <SplashScreen onFinish={() => setShowSplash(false)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={SharedNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
