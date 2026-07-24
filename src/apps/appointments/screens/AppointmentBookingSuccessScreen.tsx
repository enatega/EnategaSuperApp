import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../general/components/Button';
import Icon from '../../../general/components/Icon';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import type { AppointmentBookingFlowParamList } from '../navigation/bookingFlowTypes';
import { navigateToActiveAppointmentsTab } from '../navigation/modeNavigation';

type SuccessRouteProp = RouteProp<AppointmentBookingFlowParamList, 'BookingSuccess'>;
type NavigationProp = NativeStackNavigationProp<AppointmentBookingFlowParamList>;

export default function AppointmentBookingSuccessScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SuccessRouteProp>();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.warning}20` }]}>
          <Icon color={colors.warning} name="checkmark" size={44} />
        </View>

        <View style={styles.copy}>
          <Text style={{ color: colors.text, fontSize: typography.size.h5 }} weight="extraBold">
            {t('review_confirm_appointment_confirmed')}
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: typography.size.md }}>
            {t('review_confirm_success_body', {
              orderId: route.params.orderId,
              storeName: route.params.storeName,
            })}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={t('review_confirm_success_bookings')}
          onPress={() => navigateToActiveAppointmentsTab(navigation, 'bookings')}
        />
        <Button
          label={t('review_confirm_success_home')}
          onPress={() => navigateToActiveAppointmentsTab(navigation, 'home')}
          variant="secondary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  copy: {
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    marginBottom: 24,
    width: 88,
  },
  screen: {
    flex: 1,
  },
});
