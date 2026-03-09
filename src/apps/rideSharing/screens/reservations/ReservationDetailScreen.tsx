import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { getReservationById } from '../../data/reservationMockData';
import CancelRideBottomSheet from '../../components/reservation/CancelRideBottomSheet';
import MoreOptionsBottomSheet from '../../components/reservation/MoreOptionsBottomSheet';
import ReservationRideInfo from '../../components/reservation/ReservationRideInfo';
import ReservationSchedule from '../../components/reservation/ReservationSchedule';
import ReservationPayment from '../../components/reservation/ReservationPayment';
import ReservationRoute from '../../components/reservation/ReservationRoute';
import ReservationStatus from '../../components/reservation/ReservationStatus';
import ReservationInfoSection from '../../components/reservation/ReservationInfoSection';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type RoutePropType = RouteProp<RideSharingStackParamList, 'ReservationDetail'>;

export default function ReservationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RoutePropType>();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const [isCancelBottomSheetVisible, setIsCancelBottomSheetVisible] = useState(false);
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);

  const reservationId = route.params?.reservationId;
  const reservation = reservationId ? getReservationById(reservationId) : null;

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    const day = date.toLocaleString('en-US', { weekday: 'short' });
    const month = date.toLocaleString('en-US', { month: 'short' });
    const dayNum = date.getDate();
    const time = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day}, ${month} ${dayNum}. ${time} GMT`;
  };

  const handleMoreOptionsPress = useCallback(() => {
    setIsMoreOptionsVisible(true);
  }, []);

  const handleCloseMoreOptions = useCallback(() => {
    setIsMoreOptionsVisible(false);
  }, []);

  const handleCancelRidePress = useCallback(() => {
    setIsMoreOptionsVisible(false);
    setIsCancelBottomSheetVisible(true);
  }, []);

  const handleCloseCancelBottomSheet = useCallback(() => {
    setIsCancelBottomSheetVisible(false);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    // TODO: Integrate with API to cancel reservation
    console.log('Ride cancelled');
  }, []);

  if (!reservation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('reservation_detail_title')} />
        <View style={styles.emptyContainer}>
          <Text variant="subtitle" color={colors.mutedText}>
            {t('reservation_not_found')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('reservation_detail_title')}
        rightSlot={
          reservation.status === 'scheduled' && (
            <Pressable
              onPress={handleMoreOptionsPress}
              style={({ pressed }) => [
                styles.moreOptionsButton,
                { backgroundColor: colors.backgroundTertiary },
                pressed && styles.moreOptionsButtonPressed,
              ]}
            >
              <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
            </Pressable>
          )
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ReservationRideInfo
          rideTitle={reservation.rideTitle}
          vehicleModel={reservation.vehicleInfo?.model}
          vehicleColor={reservation.vehicleInfo?.color}
          licensePlate={reservation.licensePlate}
        />

        <ReservationSchedule
          label={t('reservation_scheduled_for')}
          dateTime={formatDate(reservation.dateTime)}
        />

        <ReservationPayment
          amount={reservation.price}
          currency={reservation.currency}
          paymentMethod={reservation.paymentMethod}
        />

        <ReservationRoute
          pickupAddress={reservation.pickupAddress}
          dropoffAddress={reservation.dropoffAddress}
        />

        <ReservationStatus status={reservation.status} />

        <ReservationInfoSection
          waitTime={reservation.waitTime}
          cancellationPolicy={reservation.cancellationPolicy}
        />
      </ScrollView>

      <MoreOptionsBottomSheet
        isVisible={isMoreOptionsVisible}
        onClose={handleCloseMoreOptions}
        onCancelPress={handleCancelRidePress}
      />

      <CancelRideBottomSheet
        isVisible={isCancelBottomSheetVisible}
        onClose={handleCloseCancelBottomSheet}
        onConfirmCancel={handleConfirmCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  moreOptionsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreOptionsButtonPressed: {
    opacity: 0.7,
  },
});
