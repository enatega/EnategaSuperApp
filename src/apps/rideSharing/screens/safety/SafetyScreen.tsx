import React, { memo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../general/theme/theme';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import SafetyActionGrid from './components/SafetyActionGrid';
import DriverVerificationCard from './components/DriverVerificationCard';
import ProtectionCard from './components/ProtectionCard';

type SafetyScreenRouteProp = RouteProp<RideSharingStackParamList, 'Safety'>;

function SafetyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const route = useRoute<SafetyScreenRouteProp>();
  const {
    driverName,
    driverAvatarUri,
    driverRating,
    vehicleLabel,
  } = route.params ?? {};

  const handleShareRide = useCallback(() => {
    showToast.info(t('ride_active_share_coming_soon'));
  }, [t]);

  const handleSupport = useCallback(() => {
    showToast.info(t('safety_support_coming_soon'));
  }, [t]);

  const handleEmergencyContacts = useCallback(() => {
    showToast.info(t('safety_emergency_contacts_coming_soon'));
  }, [t]);

  const handleCallEmergency = useCallback(() => {
    showToast.info(t('ride_active_emergency_coming_soon'));
  }, [t]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title={t('safety_screen_title')} />
      <SafetyActionGrid
        onShareRide={handleShareRide}
        onSupport={handleSupport}
        onEmergencyContacts={handleEmergencyContacts}
        onCallEmergency={handleCallEmergency}
      />
      <DriverVerificationCard
        driverName={driverName}
        driverAvatarUri={driverAvatarUri}
        driverRating={driverRating}
        vehicleLabel={vehicleLabel}
      />
      <ProtectionCard />
    </ScrollView>
  );
}

export default memo(SafetyScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    gap: 8,
  },
});
