import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SharedNavigator from '../general/navigation/SharedNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <NavigationContainer>
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
