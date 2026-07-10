import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppPopup from '../../../../general/components/AppPopup';
import { showToast } from '../../../../general/components/AppToast';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import useAddress from '../../../../general/hooks/useAddress';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import { getApiErrorMessage } from '../../../../general/utils/apiError';
import { resolveSavedAddressId } from '../../../../general/utils/address';
import { useTheme } from '../../../../general/theme/theme';
import ReviewAddressRowSection from '../../components/ReviewAndConfirm/ReviewAddressRowSection';
import ReviewAndConfirmFooter from '../../components/ReviewAndConfirm/ReviewAndConfirmFooter';
import ReviewAndConfirmHeader from '../../components/ReviewAndConfirm/ReviewAndConfirmHeader';
import ReviewAppointmentConfirmedTransition from '../../components/ReviewAndConfirm/ReviewAppointmentConfirmedTransition';
import ReviewCancellationSection from '../../components/ReviewAndConfirm/ReviewCancellationSection';
import ReviewConfirmBookingPopup from '../../components/ReviewAndConfirm/ReviewConfirmBookingPopup';
import ReviewMapHeroSection from '../../components/ReviewAndConfirm/ReviewMapHeroSection';
import ReviewNotesSection from '../../components/ReviewAndConfirm/ReviewNotesSection';
import ReviewScheduleSection from '../../components/ReviewAndConfirm/ReviewScheduleSection';
import ReviewSummarySection from '../../components/ReviewAndConfirm/ReviewSummarySection';
import ReviewTeamScheduleSection from '../../components/ReviewAndConfirm/ReviewTeamScheduleSection';
import { useBookingSummaryPreview } from '../../hooks/useBookingSummaryPreview';
import { usePlaceBookingOrder } from '../../hooks/usePlaceBookingOrder';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import { buildBookingSummaryPreviewPayload } from '../../utils/buildBookingSummaryPayload';

type ReviewAndConfirmRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'ReviewAndConfirm'
>;

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const CONFIRMATION_TRANSITION_MS = 1400;

function formatScheduleLabel(isoDate: string) {
  const date = new Date(isoDate);
  return `${DATE_FORMATTER.format(date)}, ${TIME_FORMATTER.format(date)}`;
}

function formatWeekdaySummary(weekdays?: number[]) {
  if (!weekdays?.length) {
    return null;
  }

  return weekdays
    .map((day) =>
      new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
        new Date(2024, 0, 7 + day),
      ),
    )
    .join(', ');
}

function getCancellationNoticeKey(scheduledAt: Date) {
  const diffMinutes = Math.max(
    0,
    Math.floor((scheduledAt.getTime() - Date.now()) / (1000 * 60)),
  );

  if (diffMinutes >= 120) {
    return 'review_confirm_cancellation_notice_two_hours';
  }

  if (diffMinutes >= 60) {
    return 'review_confirm_cancellation_notice_thirty_minutes';
  }

  return 'review_confirm_cancellation_notice_fifteen_minutes';
}

export default function ReviewAndConfirm() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const route = useRoute<ReviewAndConfirmRouteProp>();
  const { latitude, longitude, selectedAddress, selectedAddressLabel } = useAddress();
  const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);
  const selectedScheduledAt = useMemo(
    () => new Date(route.params.scheduledAtIso),
    [route.params.scheduledAtIso],
  );
  const [notes, setNotes] = useState(() => route.params.jobDescription ?? '');
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useSavedAddresses('home-services');
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress('home-services');
  const resolvedAddressId = useMemo(
    () => resolveSavedAddressId(selectedAddress?.id, addresses),
    [addresses, selectedAddress?.id],
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const flowNavigation = useMemo(
    () =>
      navigation as unknown as {
        replace: (screen: string, params: Record<string, unknown>) => void;
      },
    [navigation],
  );
  const { summary } = route.params;
  const isContractBooking = route.params.serviceMode === 'contract';
  const isMultiVendorBooking = route.params.bookingFlow === 'multiVendor';
  const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);
  const selectedPaymentMethod = 'cash';
  const discountCode = '';
  const [availabilityPopup, setAvailabilityPopup] = useState<{
    visible: boolean;
    title: string;
    description: string;
  }>({
    visible: false,
    title: '',
    description: '',
  });
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const placeBookingOrderMutation = usePlaceBookingOrder();

  const locationLatitude = latitude ?? 24.8607;
  const locationLongitude = longitude ?? 67.0011;

  const scheduleForLabel = useMemo(
    () => formatScheduleLabel(selectedScheduledAt.toISOString()),
    [selectedScheduledAt],
  );
  const reviewTeamLabel = useMemo(() => {
    const assignmentMode =
      route.params.workerType === 'team'
        ? t('team_schedule_worker_type_team_title')
        : t('team_schedule_worker_type_individual_title');

    return `${assignmentMode} • ${route.params.teamSize} ${
      route.params.teamSize === 1
        ? t('team_worker_singular')
        : t('team_worker_plural')
    }`;
  }, [route.params.teamSize, route.params.workerType, t]);
  const reviewHoursLabel = useMemo(
    () =>
      `${route.params.workingHours} ${
        route.params.workingHours === 1
          ? t('team_schedule_working_hours_hour')
          : t('team_schedule_working_hours_hours')
      }`,
    [route.params.workingHours, t],
  );
  const reviewServiceModeLabel = useMemo(() => {
    if (route.params.serviceMode !== 'contract') {
      return t('team_schedule_service_mode_one_time_title');
    }

    if (route.params.contractType === 'yearly') {
      return t('team_schedule_contract_type_yearly');
    }

    return t('team_schedule_contract_type_monthly');
  }, [route.params.contractType, route.params.serviceMode, t]);
  const reviewScheduleLabel = useMemo(() => {
    if (route.params.serviceMode !== 'contract') {
      return scheduleForLabel;
    }

    const weekdaySummary = formatWeekdaySummary(route.params.selectedWeekdays);
    const datePrefix = DATE_FORMATTER.format(selectedScheduledAt);
    const timeLabel = `${route.params.scheduledSlot.startTime} - ${route.params.scheduledSlot.endTime}`;

    if (!weekdaySummary) {
      return `${datePrefix} • ${timeLabel}`;
    }

    return `${weekdaySummary} • ${timeLabel}`;
  }, [
    route.params.scheduledSlot.endTime,
    route.params.scheduledSlot.startTime,
    route.params.selectedWeekdays,
    route.params.serviceMode,
    scheduleForLabel,
    selectedScheduledAt,
  ]);
  const cancellationNotice = useMemo(
    () => t(getCancellationNoticeKey(selectedScheduledAt)),
    [selectedScheduledAt, t],
  );
  const bookingSummaryPayload = useMemo(
    () =>
      buildBookingSummaryPreviewPayload({
        routeParams: route.params,
        addressId: resolvedAddressId,
        notes,
        customerNote: notes,
        discountCode,
        paymentMethod: selectedPaymentMethod,
        scheduledAtIso: selectedScheduledAt.toISOString(),
        scheduledSlot: route.params.scheduledSlot,
      }),
    [
      discountCode,
      notes,
      route.params,
      resolvedAddressId,
      selectedPaymentMethod,
      selectedScheduledAt,
    ],
  );
  const { data: bookingPreviewData } = useBookingSummaryPreview(bookingSummaryPayload);

  const previewSummary = bookingPreviewData?.summary;
  const serviceCenterLocation = bookingPreviewData?.serviceCenterLocation;

  const summaryRows = useMemo(
    () => {
      if (isContractBooking) {
        return [];
      }

      const rows: Array<{
        id: string;
        label: string;
        value: number;
        isEmphasized?: boolean;
      }> = [];
      const selectedServicesAmount = previewSummary?.subtotal ?? summary.totalPrice;
      const discountAmount = previewSummary?.discountAmount ?? 0;
      const taxAmount = previewSummary?.tax ?? 0;
      const deliveryFeeAmount = previewSummary?.deliveryFee ?? 0;
      const packingChargesAmount = previewSummary?.packingCharges ?? 0;
      const riderTipAmount = previewSummary?.riderTip ?? 0;

      rows.push({
        id: 'services',
        label: t('review_confirm_price_services'),
        value: selectedServicesAmount,
      });

      if (taxAmount > 0) {
        rows.push({
          id: 'tax',
          label: t('review_confirm_price_tax'),
          value: taxAmount,
        });
      }

      if (deliveryFeeAmount > 0) {
        rows.push({
          id: 'delivery-fee',
          label: t('review_confirm_price_delivery_fee'),
          value: deliveryFeeAmount,
        });
      }

      if (packingChargesAmount > 0) {
        rows.push({
          id: 'packing-charges',
          label: t('review_confirm_price_packing_charges'),
          value: packingChargesAmount,
        });
      }

      if (riderTipAmount > 0) {
        rows.push({
          id: 'tip',
          label: t('review_confirm_price_tip'),
          value: riderTipAmount,
        });
      }

      rows.push({
        id: 'discount',
        label: t('review_confirm_discount_title'),
        value: -discountAmount,
      });

      rows.push({
        id: 'total',
        label: t('review_confirm_price_total'),
        value: previewSummary?.payableAmount ?? summary.totalPrice,
        isEmphasized: true,
      });

      return rows;
    },
    [
      isContractBooking,
      previewSummary?.discountAmount,
      previewSummary?.deliveryFee,
      previewSummary?.payableAmount,
      previewSummary?.packingCharges,
      previewSummary?.riderTip,
      previewSummary?.subtotal,
      previewSummary?.tax,
      summary.totalPrice,
      t,
    ],
  );

  const totalForFooter = isContractBooking
    ? null
    : previewSummary?.payableAmount ?? summary.totalPrice;
  const serviceCountForFooter = previewSummary?.serviceCount ?? summary.serviceCount;
  const serviceCountLabel = `${serviceCountForFooter} ${
    serviceCountForFooter === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural')
  }`;
  const handleClosePopup = () => {
    setIsConfirmPopupVisible(false);
  };

  const handleAddressPress = () => {
    setIsAddressSheetVisible(true);
  };

  const handleCloseAddressSheet = () => {
    setIsAddressSheetVisible(false);
  };

  const handleSelectAddress = async (address: (typeof addresses)[number]) => {
    try {
      const isSelected = await selectSavedAddress(address.id);

      if (!isSelected) {
        return;
      }

      void refetchAddresses();
      setIsAddressSheetVisible(false);
    } catch {
      showToast.error(t('address_select_error'));
    }
  };

  const handleAddAddressPress = () => {
    setIsAddressSheetVisible(false);
    navigation.navigate('AddressSearch', {
      appPrefix: 'home-services',
      origin: 'single-vendor-home',
    });
  };

  const handleUseCurrentLocation = () => {
    setIsAddressSheetVisible(false);
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: 'home-services',
      origin: 'single-vendor-home',
    });
  };

  const handleConfirmBooking = () => {
    void (async () => {
      if (selectedScheduledAt.getTime() <= Date.now()) {
        setAvailabilityPopup({
          visible: true,
          title: t('review_confirm_place_order_error_title'),
          description: 'Start time must be in the future.',
        });
        return;
      }

      try {
        const response = await placeBookingOrderMutation.mutateAsync({
          ...bookingSummaryPayload,
          totalAmount: totalForFooter ?? 0,
        });

        if (isContractBooking && response.contractId) {
          setIsConfirmPopupVisible(false);
          flowNavigation.replace(
            isMultiVendorBooking
              ? 'MultiVendorContractDetails'
              : 'SingleVendorContractDetails',
            {
              contractId: response.contractId,
            },
          );
          return;
        }

        if (!response.orderId) {
          setAvailabilityPopup({
            visible: true,
            title: t('review_confirm_place_order_error_title'),
            description: t('review_confirm_place_order_error_description'),
          });
          return;
        }

        setIsConfirmPopupVisible(false);
        setConfirmedOrderId(response.orderId);
      } catch (error) {
        setAvailabilityPopup({
          visible: true,
          title: t('review_confirm_place_order_error_title'),
          description: getApiErrorMessage(
            error,
            t('review_confirm_place_order_error_description'),
          ),
        });
      }
    })();
  };

  const hideAvailabilityPopup = () => {
    setAvailabilityPopup((previous) => ({ ...previous, visible: false }));
  };

  useEffect(() => {
    if (!confirmedOrderId) {
      return;
    }

    const timeoutId = setTimeout(() => {
      flowNavigation.replace(
        isMultiVendorBooking
          ? 'MultiVendorBookingDetails'
          : 'SingleVendorBookingDetails',
        {
          orderId: confirmedOrderId,
        },
      );
    }, CONFIRMATION_TRANSITION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [confirmedOrderId, flowNavigation, isMultiVendorBooking]);

  if (confirmedOrderId) {
    return (
      <ReviewAppointmentConfirmedTransition
        bottomInset={insets.bottom}
        title={t('review_confirm_appointment_confirmed')}
        topInset={insets.top}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ReviewAndConfirmHeader
        onBack={() => navigation.goBack()}
        onClose={() => navigation.popToTop()}
        title={t('review_confirm_title')}
        topInset={insets.top}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ReviewMapHeroSection
          serviceCenterLatitude={serviceCenterLocation?.latitude}
          serviceCenterLongitude={serviceCenterLocation?.longitude}
          userLatitude={locationLatitude}
          userLongitude={locationLongitude}
        />

        <ReviewAddressRowSection
          onPress={handleAddressPress}
          subtitle={selectedAddressLabel ?? t('review_confirm_location_fallback')}
          title={t('review_confirm_home')}
        />

        <ReviewNotesSection
          onChangeText={setNotes}
          optionalLabel={t('review_confirm_optional')}
          placeholder={t('review_confirm_notes_placeholder')}
          title={t('review_confirm_notes_title')}
          value={notes}
        />

        <ReviewScheduleSection
          onAppointmentPress={() => navigation.goBack()}
          appointmentSubtitle={scheduleForLabel}
          appointmentTitle={t('review_confirm_appointment_time')}
          title={t('review_confirm_schedule_for')}
        />

        <ReviewTeamScheduleSection
          dateTimeLabel={t('review_confirm_date_time_label')}
          hoursLabel={t('review_confirm_hours_label')}
          scheduleLabel={reviewScheduleLabel}
          serviceModeLabel={reviewServiceModeLabel}
          teamLabel={t('review_confirm_team_label')}
          teamSizeLabel={reviewTeamLabel}
          title={t('review_confirm_schedule_title')}
          typeLabel={t('review_confirm_type_label')}
          workingHoursLabel={reviewHoursLabel}
        />

        <ReviewCancellationSection
          body={cancellationNotice}
          title={t('review_confirm_cancellation_title')}
        />

        <ReviewSummarySection
          rows={summaryRows}
          emptyMessage={
            isContractBooking ? t('review_confirm_contract_price_pending') : null
          }
          subtitle={t('review_confirm_summary_subtitle')}
          title={t('review_confirm_summary_title')}
        />
      </ScrollView>

      <ReviewAndConfirmFooter
        bottomInset={insets.bottom}
        buttonLabel={t('review_confirm_footer_cta')}
        durationLabel={summary.durationLabel}
        onConfirm={() => setIsConfirmPopupVisible(true)}
        serviceCountLabel={serviceCountLabel}
        totalPrice={totalForFooter}
        supportingText={
          isContractBooking ? t('review_confirm_contract_price_footer_note') : null
        }
      />

      <AddressSelectionBottomSheet
        addresses={addresses}
        isLoading={isAddressesLoading}
        isVisible={isAddressSheetVisible}
        onAddAddress={handleAddAddressPress}
        onClose={handleCloseAddressSheet}
        onSelectAddress={handleSelectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={selectingAddressId}
        selectedAddressId={selectedAddress?.id}
      />

      <ReviewConfirmBookingPopup
        confirmLabel={t('review_confirm_popup_accept')}
        description={`${cancellationNotice}\n\n${t('review_confirm_popup_line_two')}`}
        isConfirmLoading={placeBookingOrderMutation.isPending}
        onClose={handleClosePopup}
        onConfirm={handleConfirmBooking}
        title={t('review_confirm_popup_title')}
        visible={isConfirmPopupVisible}
      />

      <AppPopup
        description={availabilityPopup.description}
        dismissOnOverlayPress
        onRequestClose={hideAvailabilityPopup}
        primaryAction={{
          label: t('ok'),
          onPress: hideAvailabilityPopup,
        }}
        title={availabilityPopup.title}
        visible={availabilityPopup.visible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
