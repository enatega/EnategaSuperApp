import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { getReservationById } from '../../data/reservationMockData';
import CancelRideBottomSheet from '../../components/reservation/CancelRideBottomSheet';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type RoutePropType = RouteProp<RideSharingStackParamList, 'ReservationDetail'>;

export default function ReservationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RoutePropType>();
  const { colors } = useTheme();
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Scheduled',
          backgroundColor: '#FEF3C7',
          textColor: '#92400E',
        };
      case 'completed':
        return {
          label: 'Completed',
          backgroundColor: '#D1FAE5',
          textColor: '#065F46',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          backgroundColor: '#FEE2E2',
          textColor: '#B91C1C',
        };
      default:
        return {
          label: status,
          backgroundColor: '#F3F4F6',
          textColor: '#374151',
        };
    }
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
        <ScreenHeader title="Reservation detail" />
        <View style={styles.emptyContainer}>
          <Text variant="subtitle" color={colors.mutedText}>
            Reservation not found
          </Text>
        </View>
      </View>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Reservation detail"
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
        {/* Ride Info Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.rideHeader}>
            <View>
              <Text weight="semiBold" variant="subtitle" style={styles.rideTitle}>
                {reservation.rideTitle}
              </Text>
              {reservation.vehicleInfo && (
                <Text variant="caption" color={colors.mutedText}>
                  {reservation.vehicleInfo.model}, {reservation.vehicleInfo.color}
                </Text>
              )}
            </View>
            {reservation.licensePlate && (
              <Text weight="semiBold">{reservation.licensePlate}</Text>
            )}
          </View>
        </View>

        {/* Scheduled For */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text variant="caption" color={colors.mutedText} style={styles.sectionLabel}>
            Scheduled for
          </Text>
          <View style={styles.dateTimeContainer}>
            <Ionicons name="calendar-outline" size={24} color={colors.mutedText} />
            <Text weight="medium" style={styles.dateTimeText}>
              {formatDate(reservation.dateTime)}
            </Text>
          </View>
        </View>

        {/* Payment */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text variant="caption" color={colors.mutedText} style={styles.sectionLabel}>
            Payment
          </Text>
          <View style={styles.paymentContainer}>
            <View style={[styles.paymentIcon, { backgroundColor: colors.cardMint }]}>
              <Ionicons name="cash-outline" size={24} color={colors.success} />
            </View>
            <Text weight="semiBold" variant="subtitle">
              {reservation.currency} {reservation.price.toFixed(2)}
            </Text>
            <Text variant="caption" color={colors.mutedText} style={styles.paymentMethod}>
              {reservation.paymentMethod === 'cash' ? 'Cash' : 'Card'}
            </Text>
          </View>
        </View>

        {/* Ride Route */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text variant="caption" color={colors.mutedText} style={styles.sectionLabel}>
            Your ride route
          </Text>
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
              <Text style={styles.routeAddress}>{reservation.pickupAddress}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.routeAddress}>{reservation.dropoffAddress}</Text>
            </View>
          </View>
        </View>

        {/* Ride Status */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text variant="caption" color={colors.mutedText} style={styles.sectionLabel}>
            Ride status
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.backgroundColor },
            ]}
          >
            <Text
              weight="semiBold"
              variant="caption"
              color={statusConfig.textColor}
            >
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Things to keep in mind */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text weight="semiBold" variant="subtitle" style={styles.thingsTitle}>
            Things to keep in mind
          </Text>

          {reservation.waitTime && (
            <View style={styles.infoRow}>
              <Ionicons name="hourglass-outline" size={28} color={colors.mutedText} />
              <View style={styles.infoContent}>
                <Text weight="semiBold" style={styles.infoTitle}>
                  Wait time
                </Text>
                <Text variant="caption" color={colors.mutedText}>
                  {reservation.waitTime}
                </Text>
              </View>
            </View>
          )}

          {reservation.cancellationPolicy && (
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={28} color={colors.mutedText} />
              <View style={styles.infoContent}>
                <Text weight="semiBold" style={styles.infoTitle}>
                  Cancellation policy
                </Text>
                <Text variant="caption" color={colors.mutedText}>
                  {reservation.cancellationPolicy}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* More Options Bottom Sheet */}
      {isMoreOptionsVisible && (
        <Pressable
          style={styles.overlay}
          onPress={handleCloseMoreOptions}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text weight="semiBold" variant="subtitle" style={styles.bottomSheetTitle}>
                More options
              </Text>
              <Pressable
                onPress={handleCloseMoreOptions}
                style={({ pressed }) => [
                  styles.closeIconButton,
                  { backgroundColor: colors.gray100 },
                  pressed && styles.closeIconButtonPressed,
                ]}
              >
                <Ionicons name="close" size={20} color={colors.mutedText} />
              </Pressable>
            </View>
            <Pressable
              onPress={handleCancelRidePress}
              style={({ pressed }) => [
                styles.cancelRideButton,
                pressed && styles.cancelRideButtonPressed,
              ]}
            >
              <Text weight="semiBold" color={colors.danger} style={styles.cancelRideButtonText}>
                Cancel the ride
              </Text>
            </Pressable>
          </View>
        </Pressable>
      )}

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
    gap: 16,
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
  card: {
    padding: 16,
    borderRadius: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideTitle: {
    marginBottom: 4,
  },
  section: {
    padding: 16,
    borderRadius: 12,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTimeText: {
    fontSize: 16,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethod: {
    marginLeft: 8,
  },
  routeContainer: {
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
  },
  routeAddress: {
    flex: 1,
    fontSize: 15,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  thingsTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    marginBottom: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconButtonPressed: {
    opacity: 0.7,
  },
  cancelRideButton: {
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelRideButtonPressed: {
    backgroundColor: '#FEF2F2',
  },
  cancelRideButtonText: {
    fontSize: 16,
  },
});
