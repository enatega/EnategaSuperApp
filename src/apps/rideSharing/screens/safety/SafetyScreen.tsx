import React, { memo, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../general/theme/theme';
import { useRideSharingEmergencyContact } from '../../../../general/stores/useAppConfigStore';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import { openEmergencyDialer } from '../../utils/safety';
import SafetyActionGrid from './components/SafetyActionGrid';
import DriverVerificationCard from './components/DriverVerificationCard';
import ProtectionCard from './components/ProtectionCard';

type SafetyScreenRouteProp = RouteProp<RideSharingStackParamList, 'Safety'>;

function SafetyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const route = useRoute<SafetyScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const emergencyContact = useRideSharingEmergencyContact();
  const {
    driverName,
    driverAvatarUri,
    driverRating,
    vehicleLabel,
    pickupLatitude,
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude,
  } = route.params ?? {};

  const handleShareRide = useCallback(() => {
    if (
      pickupLatitude === undefined
      || pickupLongitude === undefined
      || dropoffLatitude === undefined
      || dropoffLongitude === undefined
    ) {
      showToast.error(t('error'), t('ride_active_map_open_error'));
      return;
    }

    const openMaps = async () => {
      try {
        if (Platform.OS === 'ios') {
          const appleMapsUrl = `http://maps.apple.com/?saddr=${pickupLatitude},${pickupLongitude}&daddr=${dropoffLatitude},${dropoffLongitude}&dirflg=d`;
          const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl);

          if (!canOpenAppleMaps) {
            showToast.error(t('error'), t('ride_active_map_unavailable'));
            return;
          }

          await Linking.openURL(appleMapsUrl);
          return;
        }

        const googleNavigationUrl = `google.navigation:q=${dropoffLatitude},${dropoffLongitude}&mode=d`;
        const canOpenGoogleNavigation = await Linking.canOpenURL(googleNavigationUrl);

        if (canOpenGoogleNavigation) {
          await Linking.openURL(googleNavigationUrl);
          return;
        }

        const googleMapsWebDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickupLatitude},${pickupLongitude}&destination=${dropoffLatitude},${dropoffLongitude}&travelmode=driving`;
        const canOpenGoogleMapsWeb = await Linking.canOpenURL(googleMapsWebDirectionsUrl);

        if (!canOpenGoogleMapsWeb) {
          showToast.error(t('error'), t('ride_active_map_unavailable'));
          return;
        }

        await Linking.openURL(googleMapsWebDirectionsUrl);
      } catch {
        showToast.error(t('error'), t('ride_active_map_open_error'));
      }
    };

    void openMaps();
  }, [dropoffLatitude, dropoffLongitude, pickupLatitude, pickupLongitude, t]);

  const handleSupport = useCallback(() => {
    navigation.navigate('RideSupportChat');
  }, [navigation]);

  const handleEmergencyContacts = useCallback(() => {
    void openEmergencyDialer(emergencyContact?.contact_number).catch(() => {
      showToast.info(t('ride_active_emergency_coming_soon'));
    });
  }, [emergencyContact?.contact_number, t]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title={t('safety_screen_title')} />
      <SafetyActionGrid
        emergencyNumber={emergencyContact?.contact_number}
        onShareRide={handleShareRide}
        onSupport={handleSupport}
        onEmergencyContacts={handleEmergencyContacts}
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
