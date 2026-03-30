import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SharedNavigator from '../general/navigation/SharedNavigator';
import type { RootStackParamList } from '../general/navigation/navigationTypes';
import { handleIncomingDeepLinkUrl, navigationRef } from '../general/navigation/rootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const resolveInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (isMounted && initialUrl) {
        setPendingUrl(initialUrl);
      }
    };

    void resolveInitialUrl();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      setPendingUrl(url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!pendingUrl || showSplash || !isNavigationReady) {
      return;
    }

    let isCancelled = false;

    const handlePendingUrl = async () => {
      const wasHandled = await handleIncomingDeepLinkUrl(pendingUrl);

      if (wasHandled && !isCancelled) {
        setPendingUrl((currentUrl) => (currentUrl === pendingUrl ? null : currentUrl));
      }
    };

    void handlePendingUrl();

    return () => {
      isCancelled = true;
    };
  }, [isNavigationReady, pendingUrl, showSplash]);

  return (
    <NavigationContainer
      onReady={() => {
        setIsNavigationReady(true);
      }}
      ref={navigationRef}
    >
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
