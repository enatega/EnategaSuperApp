import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeVisitsHomeScreen from '../screens/HomeScreen';
import VisitDetails from '../screens/VisitDetails';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function HomeVisitsNavigator() {
  const { t } = useTranslation('homeVisits');
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeVisitsHome" component={HomeVisitsHomeScreen} options={{ title: t('header_title') }} />
      <Stack.Screen name="VisitDetails" component={VisitDetails} options={{ title: t('details_title') }} />
    </Stack.Navigator>
  );
}
