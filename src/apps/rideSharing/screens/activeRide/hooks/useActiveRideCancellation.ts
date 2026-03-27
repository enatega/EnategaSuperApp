import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../../general/components/AppToast';
import { getApiErrorMessage } from '../../../../../general/utils/apiError';
import { useCancelRide } from '../../../hooks/useRideMutations';
import { emitRideSharingEvent } from '../../../socket/rideSharingSocket';
import { useActiveRideRequestStore } from '../../../stores/useActiveRideRequestStore';
import { useActiveRideStore } from '../../../stores/useActiveRideStore';

function isRideCancellable(statusCode: string | undefined) {
  const normalizedStatus = statusCode?.trim().toUpperCase();

  if (!normalizedStatus) {
    return false;
  }

  return !['IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(normalizedStatus);
}

type Params = {
  rideId?: string;
  driverUserId?: string;
  statusCode?: string;
};

export function useActiveRideCancellation({
  rideId,
  driverUserId,
  statusCode,
}: Params) {
  const { t } = useTranslation('rideSharing');
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const cancelRideMutation = useCancelRide();
  const [isCancelSheetVisible, setCancelSheetVisible] = useState(false);

  const canCancelRide = useMemo(
    () => Boolean(rideId) && isRideCancellable(statusCode),
    [rideId, statusCode],
  );

  const openCancelSheet = useCallback(() => {
    if (!canCancelRide || cancelRideMutation.isPending) {
      return;
    }

    setCancelSheetVisible(true);
  }, [canCancelRide, cancelRideMutation.isPending]);

  const closeCancelSheet = useCallback(() => {
    if (cancelRideMutation.isPending) {
      return;
    }

    setCancelSheetVisible(false);
  }, [cancelRideMutation.isPending]);

  const confirmCancelRide = useCallback(async () => {
    if (!rideId || !canCancelRide || cancelRideMutation.isPending) {
      return;
    }

    try {
      if (driverUserId) {
        emitRideSharingEvent('ride-cancelled', {
          rideId,
          genericUserId: driverUserId,
        });
      }

      await cancelRideMutation.mutateAsync(rideId);
      clearActiveRideRequest();
      clearActiveRide();
      setCancelSheetVisible(false);
      showToast.success(
        t('reservation_cancel_success'),
        t('reservation_cancel_success_message'),
      );
    } catch (error) {
      showToast.error(
        t('reservation_cancel_error'),
        getApiErrorMessage(error, t('reservation_cancel_error_message')),
      );
    }
  }, [
    canCancelRide,
    cancelRideMutation,
    clearActiveRide,
    clearActiveRideRequest,
    driverUserId,
    rideId,
    t,
  ]);

  return {
    canCancelRide,
    isCancelSheetVisible,
    isCancelling: cancelRideMutation.isPending,
    openCancelSheet,
    closeCancelSheet,
    confirmCancelRide,
  };
}
