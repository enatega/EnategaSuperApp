import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useCustomerRideDetail } from '../../hooks/useRideQueries';
import { useCancelRide } from '../../hooks/useRideMutations';
import { showToast } from '../../../../general/components/AppToast';
import CancelRideBottomSheet from '../../components/reservation/CancelRideBottomSheet';
import MoreOptionsBottomSheet from '../../components/reservation/MoreOptionsBottomSheet';
import ReservationRideInfo from '../../components/reservation/ReservationRideInfo';
import ReservationDriverInfo from '../../components/reservation/ReservationDriverInfo';
import ReservationSchedule from '../../components/reservation/ReservationSchedule';
import ReservationPayment from '../../components/reservation/ReservationPayment';
import ReservationRoute from '../../components/reservation/ReservationRoute';
import ReservationStatus from '../../components/reservation/ReservationStatus';
import ReservationInfoSection from '../../components/reservation/ReservationInfoSection';
import ReservationDetailSkeleton from '../../components/reservation/ReservationDetailSkeleton';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import type { CustomerRideDetail } from '../../api/types';
import type { RideStatus } from '../../types/reservation';

type RoutePropType = RouteProp<RideSharingStackParamList, 'ReservationDetail'>;
type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList>;

function mapRideStatus(rideStatus: CustomerRideDetail['rideStatus']): RideStatus {
  switch (rideStatus) {
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    case 'IN_PROGRESS':
      return 'in_progress';
    case 'ASSIGNED':
    case 'SCHEDULED':
    default:
      return 'scheduled';
  }
}

function mapPaymentMethod(paymentVia?: string): 'cash' | 'card' {
  return paymentVia?.toUpperCase() === 'CARD' ? 'card' : 'cash';
}

function formatScheduledDate(dateTime: string): string {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return dateTime;
  }

  const day = date.toLocaleString('en-US', { weekday: 'short' });
  const month = date.toLocaleString('en-US', { month: 'short' });
  const dayNum = date.getDate();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${day}, ${month} ${dayNum}. ${time} GMT`;
}

export default function ReservationDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('rideSharing');
  const [isCancelBottomSheetVisible, setIsCancelBottomSheetVisible] = useState(false);
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);

  const rideId = route.params?.rideId;
  const { data: rideDetail, isLoading, error } = useCustomerRideDetail(rideId);
  const { mutate: cancelRide, isPending: isCancelling } = useCancelRide();
  const detailStatus = useMemo(
    () => (rideDetail ? mapRideStatus(rideDetail.rideStatus) : null),
    [rideDetail],
  );
  const shouldShowSchedule = Boolean(rideDetail?.isScheduled && rideDetail?.scheduledAt);
  const riderVehicle = rideDetail?.riderInfo?.vehicle;
  const stopAddresses = useMemo(
    () => (
      rideDetail?.stops
        ?.slice()
        .sort((left, right) => Number(left.order ?? 0) - Number(right.order ?? 0))
        .map((stop) => stop.address?.trim())
        .filter((address): address is string => Boolean(address))
    ) ?? [],
    [rideDetail?.stops],
  );

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
    if (rideId) {
      cancelRide(rideId, {
        onSuccess: () => {
          setIsCancelBottomSheetVisible(false);
          showToast.success(t('reservation_cancel_success'), t('reservation_cancel_success_message'));
        },
        onError: () => {
          setIsCancelBottomSheetVisible(false);
          showToast.error(t('reservation_cancel_error'), t('reservation_cancel_error_message'));
        },
      });
    }
  }, [rideId, cancelRide, t]);

  if (isLoading || isCancelling) {
    return <ReservationDetailSkeleton />;
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text variant="subtitle" color={colors.danger} style={{ textAlign: 'center' }}>
          {error.message || t('reservation_not_found')}
        </Text>
      </View>
    );
  }

  if (!rideDetail || !detailStatus) {
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
          shouldShowSchedule && (
            <Pressable
              onPress={handleMoreOptionsPress}
              accessibilityLabel={t('reservation_more_options')}
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

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <ReservationRideInfo
          rideTitle={rideDetail.rideType.name}
          price={rideDetail.agreedPrice}
          currency="QAR"
          imageUrl={rideDetail.rideType.imageUrl}
        />

        {rideDetail.riderInfo && (
          <ReservationDriverInfo
            driver={{
              name: rideDetail.riderInfo.name,
              rating: rideDetail.riderInfo.averageRating,
              rideCount: rideDetail.riderInfo.totalCompletedRides,
              image: rideDetail.riderInfo.profile,
            }}
            vehicleInfo={riderVehicle ? {
              model: riderVehicle.vehicle_name,
              color: riderVehicle.vehicle_colour,
            } : undefined}
            licensePlate={riderVehicle?.vehicle_no}
            onPress={() => {
              if (rideDetail.riderInfo?.id) {
                navigation.navigate('DriverProfile', { userId: rideDetail.riderInfo.id });
              }
            }}
          />
        )}

        {shouldShowSchedule ? (
          <ReservationSchedule
            label={t('reservation_scheduled_for')}
            dateTime={formatScheduledDate(rideDetail.scheduledAt!)}
          />
        ) : null}

        <ReservationPayment paymentMethod={mapPaymentMethod(rideDetail.paymentVia)} />

        <ReservationRoute
          pickupAddress={rideDetail.pickup.location}
          dropoffAddress={rideDetail.dropoff.location}
          stopAddresses={stopAddresses}
        />

        <ReservationStatus status={detailStatus} />

        <ReservationInfoSection
          waitTime="5 minutes of wait time included to meet your ride."
          cancellationPolicy="Free cancellation up to 1 hour before pickup."
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
