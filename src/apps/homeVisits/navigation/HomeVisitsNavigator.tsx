import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import type { HomeVisitModeRootRoute } from './homeVisitModePreference';
import {
  DEFAULT_HOME_VISIT_MODE,
  getHomeVisitModePreference,
  mapHomeVisitModeToRoute,
  setHomeVisitModePreference,
} from './homeVisitModePreference';
import type { HomeVisitsStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeVisitsStackParamList>();

const hiddenHeaderOptions = { headerShown: false } as const;

export default function HomeVisitsNavigator() {
  const [initialRouteName, setInitialRouteName] =
    useState<HomeVisitModeRootRoute | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialRoute = async () => {
      const savedMode = await getHomeVisitModePreference();
      const resolvedMode = savedMode ?? DEFAULT_HOME_VISIT_MODE;

      if (!savedMode) {
        await setHomeVisitModePreference(resolvedMode);
      }

      if (isMounted) {
        setInitialRouteName(mapHomeVisitModeToRoute(resolvedMode));
      }
    };

    void loadInitialRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!initialRouteName) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="SingleVendor"
        component={SingleVendorNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="MultiVendor"
        component={MultiVendorNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Chain"
        component={ChainNavigator}
        options={hiddenHeaderOptions}
      />
    </Stack.Navigator>
  );
}
