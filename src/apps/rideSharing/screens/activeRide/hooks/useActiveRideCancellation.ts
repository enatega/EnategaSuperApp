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
  chatBoxId?: string;
  onCancelled?: () => void;
};

export function useActiveRideCancellation({
  rideId,
  driverUserId,
  statusCode,
  chatBoxId,
  onCancelled,
}: Params) {
  const { t } = useTranslation('rideSharing');
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
  const suppressRideById = useActiveRideStore((state) => state.suppressRideById);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const cancelRideMutation = useCancelRide();
  const [isCancelSheetVisible, setCancelSheetVisible] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const canCancelRide = useMemo(
    () => Boolean(rideId) && isRideCancellable(statusCode),
    [rideId, statusCode],
  );

  const openCancelSheet = useCallback(() => {
    if (
      !canCancelRide
      || cancelRideMutation.isPending
      || isConfirmingCancel
      || isCancelSheetVisible
    ) {
      return;
    }

    setCancelSheetVisible(true);
  }, [canCancelRide, cancelRideMutation.isPending, isCancelSheetVisible, isConfirmingCancel]);

  const closeCancelSheet = useCallback(() => {
    if (cancelRideMutation.isPending || isConfirmingCancel) {
      return;
    }

    setCancelSheetVisible(false);
  }, [cancelRideMutation.isPending, isConfirmingCancel]);

  const confirmCancelRide = useCallback(async () => {
    if (!rideId || !canCancelRide || cancelRideMutation.isPending || isConfirmingCancel) {
      return;
    }

    setIsConfirmingCancel(true);
    setCancelSheetVisible(false);

    try {
      if (driverUserId) {
        emitRideSharingEvent('ride-cancelled', {
          rideId,
          genericUserId: driverUserId,
        });
      }

      console.log('[useActiveRideCancellation] cancelRide payload:', {
        rideId,
        chatBoxId,
      });
      await cancelRideMutation.mutateAsync({ rideId, chatBoxId });
      suppressRideById(rideId);
      clearActiveRideRequest();
      clearActiveRide();
      onCancelled?.();
      showToast.success(
        t('reservation_cancel_success'),
        t('reservation_cancel_success_message'),
      );
    } catch (error) {
      showToast.error(
        t('reservation_cancel_error'),
        getApiErrorMessage(error, t('reservation_cancel_error_message')),
      );
    } finally {
      setIsConfirmingCancel(false);
    }
  }, [
    canCancelRide,
    cancelRideMutation,
    clearActiveRide,
    suppressRideById,
    clearActiveRideRequest,
    driverUserId,
    chatBoxId,
    isConfirmingCancel,
    onCancelled,
    rideId,
    t,
  ]);

  return {
    canCancelRide,
    isCancelSheetVisible,
    isCancelling: cancelRideMutation.isPending || isConfirmingCancel,
    openCancelSheet,
    closeCancelSheet,
    confirmCancelRide,
  };
}
