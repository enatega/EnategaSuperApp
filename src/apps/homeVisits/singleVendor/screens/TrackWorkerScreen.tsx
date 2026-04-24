import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  AppState,
  type AppStateStatus,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import type { LatLng } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homeVisitsKeys } from '../../api/queryKeys';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import useAddress from '../../../../general/hooks/useAddress';
import AppPopup from '../../../../general/components/AppPopup';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import Skeleton from '../../../../general/components/Skeleton';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import { useTheme } from '../../../../general/theme/theme';
import {
  homeServicesSocketClient,
  subscribeHomeServicesEvent,
} from '../../socket/homeServicesSocket';
import type {
  JobStatusUpdatedEvent,
  WorkerLocationEvent,
} from '../../socket/homeServicesSocket.types';
import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';
import TrackWorkerBookingContent from '../components/TrackWorker/TrackWorkerBookingContent';
import TrackWorkerFeedbackSection from '../components/TrackWorker/TrackWorkerFeedbackSection';
import TrackWorkerHeader from '../components/TrackWorker/TrackWorkerHeader';
import TrackWorkerMapPreview from '../components/TrackWorker/TrackWorkerMapPreview';
import TrackWorkerStatusBlock from '../components/TrackWorker/TrackWorkerStatusBlock';
import useSingleVendorBookingDetails from '../hooks/useSingleVendorBookingDetails';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';
import {
  getProgressStep,
  resolveTrackWorkerStage,
  type TrackWorkerStage,
} from '../utils/trackWorkerStatus';
import { isMapStage } from '../utils/trackWorkerFormatters';

type Props = NativeStackScreenProps<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorTrackWorker'
>;

type LocalFlowState = 'none' | 'payment_confirmed' | 'feedback';

export default function TrackWorkerScreen({ navigation, route }: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { height: viewportHeight } = useWindowDimensions();
  const { orderId } = route.params;
  const { latitude: currentLatitude, longitude: currentLongitude } = useAddress();

  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  const currentUserId = sessionQuery.data?.user?.id ?? null;

  const { data, isLoading } = useSingleVendorBookingDetails({ orderId });

  const [isServiceDetailsExpanded, setIsServiceDetailsExpanded] = React.useState(true);
  const [localFlow, setLocalFlow] = React.useState<LocalFlowState>('none');
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [isAroundCornerDismissed, setIsAroundCornerDismissed] = React.useState(false);
  const [liveBookingData, setLiveBookingData] = React.useState<HomeVisitsSingleVendorBookingDetails | null>(null);
  const [workerLocation, setWorkerLocation] = React.useState<LatLng | null>(null);

  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);
  const currentOrderIdRef = React.useRef(orderId);
  const currentUserIdRef = React.useRef<string | null>(currentUserId);

  React.useEffect(() => {
    currentOrderIdRef.current = orderId;
  }, [orderId]);

  React.useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  React.useEffect(() => {
    if (data) {
      setLiveBookingData(data);
    }
  }, [data]);

  React.useEffect(() => {
    void homeServicesSocketClient.updateSession({ token, userId: currentUserId });
  }, [currentUserId, token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    homeServicesSocketClient.retain();
    void homeServicesSocketClient.connect();

    return () => {
      homeServicesSocketClient.release();
    };
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (previousState === 'active' && nextState !== 'active') {
        homeServicesSocketClient.disconnectIfIdle();
        return;
      }

      if (nextState === 'active' && homeServicesSocketClient.hasActiveConsumers()) {
        void homeServicesSocketClient.connect();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    const unsubscribeStatus = subscribeHomeServicesEvent('job-status-updated', (payload) => {
      console.log('[home-services][track-worker] event received: job-status-updated', payload);

      if (!isJobStatusUpdatedEvent(payload)) {
        console.warn('[home-services][track-worker] ignored invalid job-status-updated payload', payload);
        return;
      }

      if (payload.jobId !== currentOrderIdRef.current) {
        console.log('[home-services][track-worker] ignored job-status-updated for different job', {
          activeOrderId: currentOrderIdRef.current,
          eventJobId: payload.jobId,
        });
        return;
      }

      setLocalFlow('none');
      setLiveBookingData((previous) => {
        const base = previous ?? data;

        if (!base) {
          return {
            orderId: payload.jobId,
            jobStatus: payload.jobStatus,
            status: payload.jobStatus,
            assignedWorker: payload.workerId ? { id: payload.workerId } : null,
          };
        }

        return {
          ...base,
          jobStatus: payload.jobStatus,
          status: payload.jobStatus,
          assignedWorker: {
            ...(base.assignedWorker ?? {}),
            id: payload.workerId ?? base.assignedWorker?.id,
          },
        };
      });

      console.log('[home-services][track-worker] applying job status update to local UI', {
        orderId: payload.jobId,
        previousJobStatus: payload.previousJobStatus,
        jobStatus: payload.jobStatus,
        workerId: payload.workerId,
        message: payload.message,
      });

      queryClient.setQueryData<HomeVisitsSingleVendorBookingDetails>(
        homeVisitsKeys.singleVendorBookingDetail(payload.jobId),
        (cached) => {
          if (!cached) {
            console.log('[home-services][track-worker] cache miss for booking detail', {
              orderId: payload.jobId,
            });
            return cached;
          }

          return {
            ...cached,
            jobStatus: payload.jobStatus,
            status: payload.jobStatus,
            assignedWorker: {
              ...(cached.assignedWorker ?? {}),
              id: payload.workerId ?? cached.assignedWorker?.id,
            },
          };
        },
      );
    });

    const unsubscribeLocation = subscribeHomeServicesEvent('get-worker-location', (payload) => {
      console.log('[home-services][track-worker] event received: get-worker-location', payload);

      if (!isWorkerLocationEvent(payload)) {
        console.warn('[home-services][track-worker] ignored invalid get-worker-location payload', payload);
        return;
      }

      const eventCustomerUserId = readString(payload.customerUserId);
      const activeCustomerUserId = currentUserIdRef.current;

      if (activeCustomerUserId && eventCustomerUserId && activeCustomerUserId !== eventCustomerUserId) {
        console.log('[home-services][track-worker] ignored worker location for different customer', {
          activeCustomerUserId,
          eventCustomerUserId,
        });
        return;
      }

      console.log('[home-services][track-worker] applying worker location update', {
        latitude: payload.latitude,
        longitude: payload.longitude,
        workerUserId: payload.workerUserId,
        customerUserId: payload.customerUserId,
      });

      setWorkerLocation({
        latitude: payload.latitude,
        longitude: payload.longitude,
      });
    });

    return () => {
      unsubscribeStatus();
      unsubscribeLocation();
    };
  }, [data, queryClient, token]);

  const bookingData = liveBookingData ?? data ?? null;
  const stage = resolveTrackWorkerStage(bookingData);
  const stageToRender: TrackWorkerStage =
    localFlow === 'payment_confirmed'
      ? 'payment_confirmed'
      : localFlow === 'feedback'
        ? 'feedback'
        : stage;

  const isMapVisible = isMapStage(stageToRender);

  const showAroundCornerPopupRaw =
    stageToRender === 'on_way' &&
    `${bookingData?.statusMessage ?? ''}`.toLowerCase().includes('around the corner');
  const showAroundCornerPopup = showAroundCornerPopupRaw && !isAroundCornerDismissed;

  const progressStep = getProgressStep(stageToRender);
  const services = bookingData?.services ?? [];

  const destinationLocation = React.useMemo(
    () => extractDestinationLocation(bookingData),
    [bookingData],
  );
  const seededWorkerLocation = React.useMemo(
    () => extractWorkerLocation(bookingData),
    [bookingData],
  );
  const customerLocation = React.useMemo(() => {
    if (typeof currentLatitude === 'number' && typeof currentLongitude === 'number') {
      return { latitude: currentLatitude, longitude: currentLongitude };
    }

    return destinationLocation;
  }, [currentLatitude, currentLongitude, destinationLocation]);

  const sheetExpandedHeight = React.useMemo(() => {
    if (isMapVisible) {
      return Math.min(Math.max(540, viewportHeight * 0.72), viewportHeight - 56);
    }

    return viewportHeight;
  }, [isMapVisible, viewportHeight]);

  const sheetDefaultHeight = React.useMemo(() => {
    if (!isMapVisible) {
      return undefined;
    }

    return Math.min(sheetExpandedHeight - 84, 470 + insets.bottom);
  }, [insets.bottom, isMapVisible, sheetExpandedHeight]);

  const sheetCollapsedHeight = React.useMemo(() => {
    if (isMapVisible) {
      return 220 + insets.bottom;
    }

    return sheetExpandedHeight;
  }, [insets.bottom, isMapVisible, sheetExpandedHeight]);

  const onPressContactWorker = React.useCallback(async () => {
    const phone = bookingData?.assignedWorker?.phone;

    if (!phone) {
      showToast.error(t('single_vendor_track_worker_contact_unavailable'));
      return;
    }

    const url = Platform.select({
      ios: `telprompt:${phone}`,
      default: `tel:${phone}`,
    });

    try {
      await Linking.openURL(url ?? `tel:${phone}`);
    } catch {
      showToast.error(t('single_vendor_track_worker_contact_unavailable'));
    }
  }, [bookingData?.assignedWorker?.phone, t]);

  const onPayNow = React.useCallback(() => {
    setLocalFlow('payment_confirmed');

    setTimeout(() => {
      setLocalFlow('feedback');
    }, 1000);
  }, []);

  const onSubmitFeedback = React.useCallback(() => {
    showToast.success(t('single_vendor_track_worker_feedback_success'));
    navigation.goBack();
  }, [navigation, t]);

  React.useEffect(() => {
    if (!showAroundCornerPopupRaw) {
      setIsAroundCornerDismissed(false);
    }
  }, [showAroundCornerPopupRaw]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      {isMapVisible ? (
        <View style={styles.mapLayer}>
          <TrackWorkerMapPreview
            customerLocation={customerLocation}
            variant="full"
            workerLocation={workerLocation ?? seededWorkerLocation}
          />
        </View>
      ) : null}

      <View style={styles.headerOverlay}>
        <TrackWorkerHeader
          onClose={() => navigation.goBack()}
          title={isMapVisible ? '' : t('single_vendor_track_worker_title')}
          topInset={insets.top}
        />
      </View>

      <SwipeableBottomSheet
        collapsedHeight={sheetCollapsedHeight}
        defaultHeight={sheetDefaultHeight}
        expandedHeight={sheetExpandedHeight}
        handle={isMapVisible ? <BottomSheetHandle color={colors.border} /> : null}
        handleGestureInset={0}
        initialState={isMapVisible ? 'default' : 'expanded'}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            borderTopLeftRadius: isMapVisible ? 24 : 0,
            borderTopRightRadius: isMapVisible ? 24 : 0,
            paddingBottom: insets.bottom + 6,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <FlatList
          data={SHEET_LIST_DATA}
          keyExtractor={keyExtractor}
          renderItem={() => (
            <>
              {isLoading ? (
                <View style={styles.loadingWrap}>
                  <Skeleton height={220} width="100%" />
                </View>
              ) : (
                <>
                  <View style={styles.content}>
                    <TrackWorkerStatusBlock
                      progressStep={progressStep}
                      stage={stageToRender}
                      statusMessage={bookingData?.statusMessage}
                    />
                  </View>

                  {stageToRender === 'payment_confirmed' ? null : stageToRender === 'feedback' ? (
                    <View style={styles.content}>
                      <TrackWorkerFeedbackSection
                        feedback={feedback}
                        onChangeFeedback={setFeedback}
                        onChangeRating={setRating}
                        onSubmit={onSubmitFeedback}
                        rating={rating}
                      />
                    </View>
                  ) : (
                    <View style={styles.content}>
                      <TrackWorkerBookingContent
                        data={bookingData}
                        isServiceDetailsExpanded={isServiceDetailsExpanded}
                        onPressContactWorker={() => {
                          void onPressContactWorker();
                        }}
                        onToggleServiceDetails={() => setIsServiceDetailsExpanded((prev) => !prev)}
                        services={services}
                        stage={stageToRender}
                      />
                    </View>
                  )}

                  {stageToRender === 'payment' ? (
                    <View style={styles.payActionWrap}>
                      <Button label={t('single_vendor_track_worker_pay_now')} onPress={onPayNow} />
                    </View>
                  ) : null}
                </>
              )}
            </>
          )}
          style={styles.sheetList}
          contentContainerStyle={[
            styles.sheetContent,
            {
              paddingTop: isMapVisible ? 0 : insets.top + 62,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        />
      </SwipeableBottomSheet>

      <AppPopup
        description={t('single_vendor_track_worker_around_corner_subtitle')}
        onRequestClose={() => undefined}
        primaryAction={{
          label: t('single_vendor_track_worker_view'),
          onPress: () => setIsAroundCornerDismissed(true),
        }}
        title={t('single_vendor_track_worker_around_corner_title')}
        visible={showAroundCornerPopup}
      />
    </View>
  );
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function toLatLng(value: unknown): LatLng | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const latitude = asNumber(record.latitude ?? record.lat);
  const longitude = asNumber(record.longitude ?? record.lng ?? record.lon);

  if (latitude === null || longitude === null) {
    return null;
  }

  return { latitude, longitude };
}

function extractDestinationLocation(details?: HomeVisitsSingleVendorBookingDetails | null) {
  if (!details) {
    return null;
  }

  const directLocation = toLatLng(details);

  if (directLocation) {
    return directLocation;
  }

  const detailsRecord = asRecord(details);

  if (!detailsRecord) {
    return null;
  }

  const candidates: unknown[] = [
    detailsRecord.serviceCenterLocation,
    detailsRecord.deliveryDetails,
    detailsRecord.location,
    detailsRecord.addressLocation,
    detailsRecord.store,
  ];

  for (const candidate of candidates) {
    const point = toLatLng(candidate);

    if (point) {
      return point;
    }
  }

  const latitude = asNumber(detailsRecord.addressLatitude ?? detailsRecord.deliveryLatitude);
  const longitude = asNumber(detailsRecord.addressLongitude ?? detailsRecord.deliveryLongitude);

  if (latitude !== null && longitude !== null) {
    return { latitude, longitude };
  }

  return null;
}

function extractWorkerLocation(details?: HomeVisitsSingleVendorBookingDetails | null) {
  if (!details) {
    return null;
  }

  const detailsRecord = asRecord(details);

  if (!detailsRecord) {
    return null;
  }

  const candidates: unknown[] = [
    detailsRecord.workerLocation,
    detailsRecord.currentLocation,
    detailsRecord.assignedWorker,
    asRecord(detailsRecord.assignedWorker)?.currentLocation,
  ];

  for (const candidate of candidates) {
    const point = toLatLng(candidate);

    if (point) {
      return point;
    }
  }

  return null;
}

function isJobStatusUpdatedEvent(value: unknown): value is JobStatusUpdatedEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const payload = value as JobStatusUpdatedEvent;

  return (
    typeof payload.jobId === 'string'
    && payload.jobId.trim().length > 0
    && typeof payload.jobStatus === 'string'
    && payload.jobStatus.trim().length > 0
  );
}

function isWorkerLocationEvent(value: unknown): value is WorkerLocationEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const payload = value as WorkerLocationEvent;

  return (
    typeof payload.latitude === 'number'
    && Number.isFinite(payload.latitude)
    && typeof payload.longitude === 'number'
    && Number.isFinite(payload.longitude)
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },
  headerOverlay: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  loadingWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mapLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  payActionWrap: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  screen: {
    flex: 1,
  },
  sheetList: {
    flex: 1,
  },
  sheet: {
    elevation: 10,
    shadowOffset: { height: -3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  sheetContent: {
    paddingBottom: 18,
  },
});

const SHEET_LIST_DATA = ['track-worker-content'];
const keyExtractor = (item: string) => item;
