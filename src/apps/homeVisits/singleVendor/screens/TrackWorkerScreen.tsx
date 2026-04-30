import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import useAddress from '../../../../general/hooks/useAddress';
import AppPopup from '../../../../general/components/AppPopup';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import Skeleton from '../../../../general/components/Skeleton';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import { useTheme } from '../../../../general/theme/theme';
import TrackWorkerBookingContent from '../components/TrackWorker/TrackWorkerBookingContent';
import TrackWorkerFeedbackSection from '../components/TrackWorker/TrackWorkerFeedbackSection';
import TrackWorkerHeader from '../components/TrackWorker/TrackWorkerHeader';
import TrackWorkerMapPreview from '../components/TrackWorker/TrackWorkerMapPreview';
import TrackWorkerStatusBlock from '../components/TrackWorker/TrackWorkerStatusBlock';
import useTrackWorkerRealtime from '../hooks/useTrackWorkerRealtime';
import useSingleVendorBookingDetails from '../hooks/useSingleVendorBookingDetails';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';
import {
  extractDestinationLocation,
  extractWorkerLocation,
} from '../utils/trackWorkerLocation';
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
  const resetLocalFlow = React.useCallback(() => {
    setLocalFlow('none');
  }, []);

  const { liveBookingData, workerLocation } = useTrackWorkerRealtime({
    currentUserId,
    initialBookingData: data,
    onJobStatusUpdated: resetLocalFlow,
    orderId,
    queryClient,
    token,
  });

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
