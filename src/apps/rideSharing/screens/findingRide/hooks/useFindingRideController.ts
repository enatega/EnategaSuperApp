import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useAuthSessionQuery } from '../../../../../general/hooks/useAuthQueries';
import { socketClient, socketLogger } from '../../../../../general/services/socket';
import { showToast } from '../../../../../general/components/AppToast';
import { getApiErrorMessage } from '../../../../../general/utils/apiError';
import type { AcceptRideBidPayload, ActiveRideRequestPayload, RideAddressSelection } from '../../../api/types';
import { rideService } from '../../../api/rideService';
import { useAcceptRideBid, useCancelRideRequest, useRaiseRideFare, useRejectRideBid } from '../../../hooks/useRideMutations';
import { useActiveRideRequestStore } from '../../../stores/useActiveRideRequestStore';
import { useActiveRideStore } from '../../../stores/useActiveRideStore';
import { useRideBidsStore } from '../../../stores/useRideBidsStore';
import { emitRideSharingEvent } from '../../../socket/rideSharingSocket';
import type { RideSharingClientEventMap } from '../../../socket/rideSharingSocket.types';
import type { RideSharingStackParamList } from '../../../navigation/RideSharingNavigator';
import type { FindingRideBid } from '../types/bids';
import type { FindingRideViewProps } from '../types/view';
import type { RideOptionItem } from '../../../components/rideOptions/types';

const SEARCH_DURATION_SECONDS = 60;
const RAISE_FARE_DEBOUNCE_MS = 500;
const DEFAULT_SEARCH_RADIUS_KM = 1;
const KEEP_SEARCHING_RADIUS_INCREMENT_KM = 1;
const BID_ACCEPT_START_TYPE = 'started';
const SOCKET_CONNECT_TIMEOUT_MS = 5000;
const ACTIVE_RIDE_REFRESH_ATTEMPTS = 3;
const ACTIVE_RIDE_REFRESH_DELAY_MS = 500;

type RaiseFareMutationContext = {
  previousActiveRideRequest: ActiveRideRequestPayload | null;
  previousFare: number;
};

type EmitRaiseFareEventInput = {
  rideRequestData: ActiveRideRequestPayload;
  fromAddress: RideAddressSelection;
  radiusKm: number;
  previousFare?: number;
  newFare?: number;
};

function toCurrencyNumber(value: number) {
  return Number(value.toFixed(2));
}

function buildAcceptBidPayload(input: {
  customerId: string;
  bidId: string;
  paymentVia?: string;
  isScheduled?: boolean;
}): AcceptRideBidPayload {
  return {
    customerId: input.customerId,
    bidId: input.bidId,
    isSchedule: input.isScheduled ?? false,
    payment_via: input.paymentVia ?? 'CASH',
  };
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForSocketConnection(timeoutMs: number = SOCKET_CONNECT_TIMEOUT_MS) {
  const existingSocket = socketClient.getSocket();
  if (existingSocket?.connected) {
    return existingSocket;
  }

  const socket = await socketClient.connect();
  if (socket.connected) {
    return socket;
  }

  return new Promise<typeof socket>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Socket connection timed out.'));
    }, timeoutMs);

    const handleConnect = () => {
      cleanup();
      resolve(socket);
    };

    const handleConnectError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      clearTimeout(timeoutId);
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
  });
}

async function emitRequiredRideSharingEvent<TEvent extends keyof RideSharingClientEventMap>(
  event: TEvent,
  payload: RideSharingClientEventMap[TEvent],
) {
  await waitForSocketConnection();

  if (!emitRideSharingEvent(event, payload)) {
    throw new Error(`Socket emit failed for ${event}.`);
  }
}

async function emitRideRaiseFareEvent({
  rideRequestData,
  fromAddress,
  radiusKm,
  previousFare,
  newFare,
}: EmitRaiseFareEventInput) {
  await emitRequiredRideSharingEvent('ride-request-fare-raised', {
    rideRequestData: {
      ...rideRequestData,
      ...(typeof previousFare === 'number' ? { previousFare } : {}),
      ...(typeof newFare === 'number' ? { newFare } : {}),
    },
    latitude: fromAddress.coordinates.latitude,
    longitude: fromAddress.coordinates.longitude,
    radiusKm,
  });
}

export function useFindingRideController({
  activeRideRequest: currentActiveRideRequest,
  fromAddress,
  selectedRide,
  bids: incomingBids,
  onCancelSuccess,
}: FindingRideViewProps & {
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  selectedRide: RideOptionItem & {
    fare?: number;
    recommendedFare?: number;
  };
}) {
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const authSessionQuery = useAuthSessionQuery();
  const activeRideRequestId = useActiveRideRequestStore((state) => state.activeRideRequest?.id);
  const activeRideRequest = useActiveRideRequestStore((state) => state.activeRideRequest);
  const setActiveRideRequest = useActiveRideRequestStore((state) => state.setActiveRideRequest);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const setActiveRide = useActiveRideStore((state) => state.setActiveRide);
  const clearBids = useRideBidsStore((state) => state.clearBids);
  const removeBid = useRideBidsStore((state) => state.removeBid);

  const cancelRideRequestMutation = useCancelRideRequest();
  const acceptRideBidMutation = useAcceptRideBid();
  const rejectRideBidMutation = useRejectRideBid();

  const minimumFare = selectedRide.recommendedFare ?? selectedRide.fare ?? 0;
  const resolvedRideRequestId = currentActiveRideRequest.id ?? activeRideRequestId;

  const [currentFare, setCurrentFare] = useState<number>(selectedRide.fare ?? minimumFare);
  const [timeLeftSec, setTimeLeftSec] = useState(SEARCH_DURATION_SECONDS);
  const [isKeepSearchingPending, setIsKeepSearchingPending] = useState(false);
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null);
  const [decliningBidId, setDecliningBidId] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasHydratedFareRef = useRef(false);
  const committedFareRef = useRef<number>(selectedRide.fare ?? minimumFare);
  const activeRideRequestRef = useRef(activeRideRequest);
  const isCancellingRef = useRef(false);
  const searchRadiusKmRef = useRef(DEFAULT_SEARCH_RADIUS_KM);
  const skipNextRaiseFareSocketEmitRef = useRef(false);

  const {
    mutate: mutateRaiseRideFare,
    mutateAsync: mutateRaiseRideFareAsync,
    isPending: isRaiseRideFarePending,
  } = useRaiseRideFare<RaiseFareMutationContext>({
    onMutate: async (variables) => {
      const previousActiveRideRequest = activeRideRequestRef.current;
      const previousFare = committedFareRef.current;

      committedFareRef.current = variables.newFare;

      if (previousActiveRideRequest) {
        setActiveRideRequest({
          ...previousActiveRideRequest,
          offeredFair: variables.newFare,
        });
      }

      return {
        previousActiveRideRequest,
        previousFare,
      };
    },
    onError: (error, _variables, context) => {
      if (isCancellingRef.current) {
        return;
      }

      if (context?.previousActiveRideRequest) {
        setActiveRideRequest(context.previousActiveRideRequest);
      }

      committedFareRef.current = context?.previousFare ?? minimumFare;
      setCurrentFare(context?.previousFare ?? minimumFare);
      showToast.error(t('error'), getApiErrorMessage(error, t('ride_estimate_quote_error_description')));
    },
    onSuccess: async (response, variables, context) => {
      if (isCancellingRef.current) {
        return;
      }

      const updatedRideRequest = response.rideReq ?? activeRideRequestRef.current;
      if (!updatedRideRequest) {
        return;
      }

      setActiveRideRequest(updatedRideRequest);
      committedFareRef.current = variables.newFare;

      if (skipNextRaiseFareSocketEmitRef.current) {
        skipNextRaiseFareSocketEmitRef.current = false;
        return;
      }

      try {
        await emitRideRaiseFareEvent({
          rideRequestData: updatedRideRequest,
          fromAddress,
          previousFare: context?.previousFare ?? variables.newFare,
          newFare: variables.newFare,
          radiusKm: searchRadiusKmRef.current,
        });
      } catch (socketError) {
        socketLogger.warn('Ride raise fare socket emit failed after API success', {
          rideRequestId: updatedRideRequest.id,
          error: socketError instanceof Error ? socketError.message : String(socketError),
        });
      }
    },
  });

  useEffect(() => {
    activeRideRequestRef.current = activeRideRequest;
  }, [activeRideRequest]);

  useEffect(() => {
    committedFareRef.current = selectedRide.fare ?? minimumFare;
    setCurrentFare(selectedRide.fare ?? minimumFare);
    hasHydratedFareRef.current = true;
  }, [minimumFare, selectedRide.fare]);

  useEffect(() => {
    if (timeLeftSec <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeftSec((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSec]);

  useEffect(() => {
    if (incomingBids) {
      useRideBidsStore.getState().setBids(incomingBids);
    }
  }, [incomingBids]);

  useEffect(() => {
    if (!hasHydratedFareRef.current) {
      return undefined;
    }

    const normalizedCurrentFare = toCurrencyNumber(currentFare);
    const normalizedCommittedFare = toCurrencyNumber(committedFareRef.current);
    const hasFareChanged = normalizedCurrentFare !== normalizedCommittedFare;

    if (
      !hasFareChanged
      || !resolvedRideRequestId
      || isRaiseRideFarePending
      || cancelRideRequestMutation.isPending
      || isCancellingRef.current
    ) {
      return undefined;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      mutateRaiseRideFare({
        rideRequestId: resolvedRideRequestId,
        newFare: normalizedCurrentFare,
      });
    }, RAISE_FARE_DEBOUNCE_MS);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [
    cancelRideRequestMutation.isPending,
    currentFare,
    isRaiseRideFarePending,
    mutateRaiseRideFare,
    resolvedRideRequestId,
  ]);

  useEffect(() => () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  const handleIncreaseFare = useCallback(() => {
    if (isRaiseRideFarePending) {
      return;
    }

    setCurrentFare((previous) => toCurrencyNumber(previous + 0.5));
  }, [isRaiseRideFarePending]);

  const handleDecreaseFare = useCallback(() => {
    if (isRaiseRideFarePending) {
      return;
    }

    setCurrentFare((previous) => toCurrencyNumber(Math.max(minimumFare, previous - 0.5)));
  }, [isRaiseRideFarePending, minimumFare]);

  const handleCancelRide = useCallback(async () => {
    if (!resolvedRideRequestId || cancelRideRequestMutation.isPending) {
      return;
    }

    isCancellingRef.current = true;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    try {
      await cancelRideRequestMutation.mutateAsync(resolvedRideRequestId);
      clearBids();
      clearActiveRideRequest();
      onCancelSuccess?.();
    } catch (error) {
      isCancellingRef.current = false;
      showToast.error(t('error'), getApiErrorMessage(error, t('ride_estimate_quote_error_description')));
    }
  }, [
    cancelRideRequestMutation,
    clearActiveRideRequest,
    clearBids,
    onCancelSuccess,
    resolvedRideRequestId,
    t,
  ]);

  const handleDeclineBid = useCallback(async (bid: FindingRideBid) => {
    if (decliningBidId || acceptingBidId) {
      return;
    }

    setDecliningBidId(bid.id);

    try {
      await rejectRideBidMutation.mutateAsync({ rideBidId: bid.id });
      removeBid(bid.id);
    } catch (error) {
      showToast.error(t('error'), getApiErrorMessage(error, t('ride_estimate_quote_error_description')));
    } finally {
      setDecliningBidId(null);
    }
  }, [
    acceptingBidId,
    decliningBidId,
    rejectRideBidMutation,
    removeBid,
    t,
  ]);

  const handleAcceptBid = useCallback(async (bid: FindingRideBid) => {
    console.log('handleAcceptBid called with bid:', bid);
    if (!resolvedRideRequestId || acceptingBidId || decliningBidId) {
      return;
    }

    const customerId = authSessionQuery.data?.user?.id;
    const riderSId = bid.riderSId;

    if (!customerId || !riderSId) {
      showToast.error(t('error'), t('ride_create_invalid_response_description'));
      return;
    }

    setAcceptingBidId(bid.id);

    try {
      const acceptedBidResponse = await acceptRideBidMutation.mutateAsync({
        rideBidId: bid.id,
        payload: buildAcceptBidPayload({
          customerId,
          bidId: bid.id,
          paymentVia: activeRideRequestRef.current?.payment_via,
          isScheduled: activeRideRequestRef.current?.is_scheduled,
        }),
      });
      const isScheduledRide = Boolean(
        activeRideRequestRef.current?.is_scheduled
        ?? (acceptedBidResponse as { is_scheduled?: boolean } | null)?.is_scheduled,
      );

      console.log('Bid accepted successfully:', acceptedBidResponse, { isScheduledRide });
      if (isScheduledRide) {
        const scheduledRideId =
         (acceptedBidResponse as { ride_id?: string; rideId?: string; id?: string } | null)?.rideId
        ??  (acceptedBidResponse as { ride_id?: string; rideId?: string; id?: string } | null)?.ride_id
          ?? (acceptedBidResponse as { ride_id?: string; rideId?: string; id?: string } | null)?.id;

        clearBids();
        clearActiveRideRequest();

        if (scheduledRideId) {
          navigation.navigate('ReservationDetail', { rideId: scheduledRideId });
        }
        return;
      }

      try {
        await emitRequiredRideSharingEvent('bid-accepted', {
          rideRequestId: resolvedRideRequestId,
          riderUserId: riderSId,
          startType: BID_ACCEPT_START_TYPE,
        });
      } catch (socketError) {
        socketLogger.warn('Bid accepted socket emit failed after API success', {
          rideRequestId: resolvedRideRequestId,
          bidId: bid.id,
          error: socketError instanceof Error ? socketError.message : String(socketError),
        });
        throw socketError;
      }

      let activeRide = null;
      for (let attempt = 0; attempt < ACTIVE_RIDE_REFRESH_ATTEMPTS; attempt += 1) {
        if (attempt > 0) {
          await delay(ACTIVE_RIDE_REFRESH_DELAY_MS);
        }

        activeRide = await rideService.getActiveRide();
        if (activeRide) {
          break;
        }
      }

      if (!activeRide) {
        socketLogger.warn('Active ride refresh returned no ride after bid acceptance', {
          rideRequestId: resolvedRideRequestId,
          bidId: bid.id,
        });
        throw new Error('Unable to load accepted ride.');
      }

      clearBids();
      clearActiveRideRequest();
      setActiveRide(activeRide);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unable to load accepted ride.') {
        showToast.error(t('error'), 'Ride accepted, but we could not load the active ride yet. Please try again.');
        return;
      }

      if (error instanceof Error && error.message === 'Socket connection timed out.') {
        showToast.error(t('error'), 'Ride accepted, but the live ride session could not start. Please try again.');
        return;
      }

      if (error instanceof Error && error.message.startsWith('Socket emit failed')) {
        showToast.error(t('error'), 'Ride accepted, but the live ride session could not start. Please try again.');
        return;
      }

      showToast.error(t('error'), getApiErrorMessage(error, 'Failed to accept bid. Please try again.'));
    } finally {
      setAcceptingBidId(null);
    }
  }, [
    acceptRideBidMutation,
    acceptingBidId,
    authSessionQuery.data?.user?.id,
    clearActiveRideRequest,
    clearBids,
    decliningBidId,
    navigation,
    resolvedRideRequestId,
    setActiveRide,
    t,
  ]);

  const handleKeepSearching = useCallback(async () => {
    if (
      !resolvedRideRequestId
      || isRaiseRideFarePending
      || cancelRideRequestMutation.isPending
      || isKeepSearchingPending
    ) {
      return;
    }

    setIsKeepSearchingPending(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    const nextRadiusKm = searchRadiusKmRef.current + KEEP_SEARCHING_RADIUS_INCREMENT_KM;
    const normalizedCurrentFare = toCurrencyNumber(currentFare);
    const normalizedCommittedFare = toCurrencyNumber(committedFareRef.current);
    const hasFareChanged = normalizedCurrentFare !== normalizedCommittedFare;

    try {
      let rideRequestForSocket = activeRideRequestRef.current;

      if (hasFareChanged) {
        skipNextRaiseFareSocketEmitRef.current = true;
        const response = await mutateRaiseRideFareAsync({
          rideRequestId: resolvedRideRequestId,
          newFare: normalizedCurrentFare,
        });
        rideRequestForSocket = response.rideReq ?? activeRideRequestRef.current;
      }

      if (!rideRequestForSocket) {
        showToast.error(t('error'), t('ride_create_invalid_response_description'));
        return;
      }

      searchRadiusKmRef.current = nextRadiusKm;

      try {
        await emitRideRaiseFareEvent({
          rideRequestData: rideRequestForSocket,
          fromAddress,
          radiusKm: nextRadiusKm,
          ...(hasFareChanged
            ? {
                previousFare: normalizedCommittedFare,
                newFare: normalizedCurrentFare,
              }
            : {}),
        });
      } catch (socketError) {
        socketLogger.warn('Ride keep searching socket emit failed', {
          rideRequestId: rideRequestForSocket.id,
          radiusKm: nextRadiusKm,
          error: socketError instanceof Error ? socketError.message : String(socketError),
        });
      }

      setTimeLeftSec(SEARCH_DURATION_SECONDS);
    } catch (error) {
      skipNextRaiseFareSocketEmitRef.current = false;
      showToast.error(t('error'), getApiErrorMessage(error, t('ride_estimate_quote_error_description')));
    } finally {
      setIsKeepSearchingPending(false);
    }
  }, [
    cancelRideRequestMutation.isPending,
    currentFare,
    fromAddress,
    isKeepSearchingPending,
    isRaiseRideFarePending,
    mutateRaiseRideFareAsync,
    resolvedRideRequestId,
    t,
  ]);

  return {
    minimumFare,
    currentFare,
    timeLeftSec,
    acceptingBidId,
    decliningBidId,
    isBidInteractionLocked: Boolean(acceptingBidId || decliningBidId),
    isIncreaseDisabled: isRaiseRideFarePending,
    isDecreaseDisabled: isRaiseRideFarePending || currentFare <= minimumFare,
    isKeepSearchingLoading: isRaiseRideFarePending || isKeepSearchingPending,
    isCancelLoading: cancelRideRequestMutation.isPending,
    handleIncreaseFare,
    handleDecreaseFare,
    handleKeepSearching,
    handleCancelRide,
    handleAcceptBid,
    handleDeclineBid,
  };
}
