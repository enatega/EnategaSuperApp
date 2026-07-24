import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import AppointmentModeSelector from '../components/AppointmentModeSelector';
import { resetToSharedHome } from '../../../general/navigation/rootNavigation';
import type { AppointmentsStackParamList } from '../navigation/types';
import type { AppointmentsMode } from '../stores/useAppointmentsConfigStore';
import { useAppointmentsConfigStore } from '../stores/useAppointmentsConfigStore';

type Navigation = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'AppointmentsModeSelector'
>;

const MODE_ROUTES = {
  singleVendor: 'SingleVendor',
  multiVendor: 'MultiVendor',
  chain: 'Chain',
} as const;

export default function AppointmentsModeSelectorScreen() {
  const navigation = useNavigation<Navigation>();
  const setMode = useAppointmentsConfigStore((state) => state.setMode);

  const handleSelect = useCallback(
    (mode: AppointmentsMode) => {
      setMode(mode);
      navigation.reset({
        index: 0,
        routes: [{ name: MODE_ROUTES[mode] }],
      });
    },
    [navigation, setMode],
  );

  return (
    <AppointmentModeSelector
      onBack={resetToSharedHome}
      onSelect={handleSelect}
    />
  );
}
