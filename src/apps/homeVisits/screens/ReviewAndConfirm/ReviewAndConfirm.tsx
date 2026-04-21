import React, { useMemo, useState } from 'react';
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
import { useTheme } from '../../../../general/theme/theme';
import { formatPrice } from '../../components/ServiceDetailsPage/serviceDetailsSelection';
import HomeVisitsDateTimePickerSheet from '../../components/common/HomeVisitsDateTimePickerSheet';
import ReviewAddressRowSection from '../../components/ReviewAndConfirm/ReviewAddressRowSection';
import ReviewAndConfirmFooter from '../../components/ReviewAndConfirm/ReviewAndConfirmFooter';
import ReviewAndConfirmHeader from '../../components/ReviewAndConfirm/ReviewAndConfirmHeader';
import ReviewCancellationSection from '../../components/ReviewAndConfirm/ReviewCancellationSection';
import ReviewConfirmBookingPopup from '../../components/ReviewAndConfirm/ReviewConfirmBookingPopup';
import ReviewDiscountCodeBottomSheet from '../../components/ReviewAndConfirm/ReviewDiscountCodeBottomSheet';
import ReviewMapHeroSection from '../../components/ReviewAndConfirm/ReviewMapHeroSection';
import ReviewPaymentMethodBottomSheet, {
  type ReviewPaymentMethod,
} from '../../components/ReviewAndConfirm/ReviewPaymentMethodBottomSheet';
import ReviewNotesSection from '../../components/ReviewAndConfirm/ReviewNotesSection';
import ReviewPaymentSection from '../../components/ReviewAndConfirm/ReviewPaymentSection';
import ReviewScheduleSection from '../../components/ReviewAndConfirm/ReviewScheduleSection';
import ReviewSummarySection from '../../components/ReviewAndConfirm/ReviewSummarySection';
import { homeVisitsSingleVendorDiscoveryService } from '../../singleVendor/api/discoveryService';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import {
  formatBookingDateOnly,
  isBookingTimeAvailable,
} from '../../utils/bookingAvailability';
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

function formatScheduleLabel(isoDate: string) {
  const date = new Date(isoDate);
  return `${DATE_FORMATTER.format(date)}, ${TIME_FORMATTER.format(date)}`;
}

function buildSlotFromDate(date: Date, workingHours: number) {
  const endDate = new Date(date.getTime() + (workingHours * 60 * 60 * 1000));
  const startTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

  return {
    startTime,
    endTime,
  };
}

export default function ReviewAndConfirm() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const route = useRoute<ReviewAndConfirmRouteProp>();
  const { latitude, longitude, selectedAddress, selectedAddressLabel } = useAddress();
  const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);
  const [isDateTimeSheetOpen, setIsDateTimeSheetOpen] = useState(false);
  const [selectedScheduledAt, setSelectedScheduledAt] = useState(() => new Date(route.params.scheduledAtIso));
  const [selectedScheduledSlot, setSelectedScheduledSlot] = useState(route.params.scheduledSlot);
  const [notes, setNotes] = useState('');
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useSavedAddresses('home-services');
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress('home-services');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const {
    selectedServices,
    serviceCenterId,
    serviceMode,
    summary,
    teamSize,
    workingHours,
  } = route.params;
  const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);
  const [isPaymentMethodSheetVisible, setIsPaymentMethodSheetVisible] = useState(false);
  const [isDiscountCodeSheetVisible, setIsDiscountCodeSheetVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<ReviewPaymentMethod>('cash');
  const [discountCode, setDiscountCode] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityPopup, setAvailabilityPopup] = useState<{
    visible: boolean;
    title: string;
    description: string;
  }>({
    visible: false,
    title: '',
    description: '',
  });

  const serviceCountLabel = `${summary.serviceCount} ${
    summary.serviceCount === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural')
  }`;

  const locationLatitude = latitude ?? 24.8607;
  const locationLongitude = longitude ?? 67.0011;

  const scheduleForLabel = useMemo(
    () => formatScheduleLabel(selectedScheduledAt.toISOString()),
    [selectedScheduledAt],
  );
  const paymentTitle = selectedPaymentMethod === 'cash'
    ? t('review_confirm_payment_title')
    : t('review_confirm_payment_card_label');
  const discountSubtitle = discountCode
    ? t('review_confirm_discount_applied', { code: discountCode })
    : t('review_confirm_discount_subtitle');
  const bookingSummaryPayload = useMemo(
    () =>
      buildBookingSummaryPreviewPayload({
        routeParams: route.params,
        selectedAddress,
        notes,
        paymentMethod: selectedPaymentMethod,
        discountCode,
        scheduledAtIso: selectedScheduledAt.toISOString(),
        scheduledSlot: selectedScheduledSlot,
      }),
    [
      discountCode,
      notes,
      route.params,
      selectedAddress,
      selectedPaymentMethod,
      selectedScheduledAt,
      selectedScheduledSlot,
    ],
  );

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
    void bookingSummaryPayload;
    setIsConfirmPopupVisible(false);
    showToast.success(t('review_confirm_success_title'), t('review_confirm_success_body'));
    navigation.navigate('AddressSearch', {
      appPrefix: 'home-services',
      origin: 'single-vendor-home',
    });
  };

  const hideAvailabilityPopup = () => {
    setAvailabilityPopup((previous) => ({ ...previous, visible: false }));
  };

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
          latitude={locationLatitude}
          longitude={locationLongitude}
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
          onAppointmentPress={() => setIsDateTimeSheetOpen(true)}
          appointmentSubtitle={scheduleForLabel}
          appointmentTitle={t('review_confirm_appointment_time')}
          title={t('review_confirm_schedule_for')}
        />

        <ReviewPaymentSection
          discountSubtitle={discountSubtitle}
          discountTitle={t('review_confirm_discount_title')}
          onDiscountPress={() => setIsDiscountCodeSheetVisible(true)}
          onPaymentPress={() => setIsPaymentMethodSheetVisible(true)}
          paymentMethod={selectedPaymentMethod}
          paymentSubtitle={t('review_confirm_payment_subtitle')}
          paymentTitle={paymentTitle}
          title={t('review_confirm_payment_section_title')}
        />

        <ReviewCancellationSection
          body={t('review_confirm_cancellation_body')}
          title={t('review_confirm_cancellation_title')}
        />

        <ReviewSummarySection
          discountCodeLabel={t('review_confirm_discount_title')}
          services={selectedServices}
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
        totalPrice={summary.totalPrice}
      />

      <HomeVisitsDateTimePickerSheet
        isConfirmLoading={isCheckingAvailability}
        onClose={() => setIsDateTimeSheetOpen(false)}
        onConfirm={async (nextDate) => {
          if (isCheckingAvailability) {
            return;
          }

          if (serviceMode === 'contract') {
            setSelectedScheduledAt(nextDate);
            setSelectedScheduledSlot(buildSlotFromDate(nextDate, workingHours));
            setIsDateTimeSheetOpen(false);
            return;
          }

          try {
            setIsCheckingAvailability(true);
            const response =
              await homeVisitsSingleVendorDiscoveryService.getBookingAvailability({
                serviceCenterId,
                date: formatBookingDateOnly(nextDate),
                teamSize,
              });

            if (!response.scheduleAllowed || !response.serviceCenterAvailable) {
              setAvailabilityPopup({
                visible: true,
                title: t('team_schedule_availability_unavailable_title'),
                description: t('team_schedule_availability_unavailable_description'),
              });
              return;
            }

            if (!isBookingTimeAvailable(response, nextDate, teamSize)) {
              setAvailabilityPopup({
                visible: true,
                title: t('team_schedule_slot_not_available_title'),
                description: t('team_schedule_slot_not_available_description'),
              });
              return;
            }

            setSelectedScheduledAt(nextDate);
            setSelectedScheduledSlot(buildSlotFromDate(nextDate, workingHours));
            setIsDateTimeSheetOpen(false);
          } catch (error) {
            setAvailabilityPopup({
              visible: true,
              title: t('team_schedule_availability_error_title'),
              description: getApiErrorMessage(
                error,
                t('team_schedule_availability_error_description'),
              ),
            });
          } finally {
            setIsCheckingAvailability(false);
          }
        }}
        value={selectedScheduledAt}
        visible={isDateTimeSheetOpen}
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
        description={`${t('review_confirm_popup_line_one')}\n\n${t('review_confirm_popup_line_two')}`}
        onClose={handleClosePopup}
        onConfirm={handleConfirmBooking}
        title={t('review_confirm_popup_title')}
        visible={isConfirmPopupVisible}
      />

      <ReviewPaymentMethodBottomSheet
        cardMaskedLabel="**** 9432"
        onChangeMethod={(method) => {
          setSelectedPaymentMethod(method);
          setIsPaymentMethodSheetVisible(false);
        }}
        onClose={() => setIsPaymentMethodSheetVisible(false)}
        selectedMethod={selectedPaymentMethod}
        totalAmountLabel={formatPrice(summary.totalPrice) ?? '$0'}
        visible={isPaymentMethodSheetVisible}
      />

      <ReviewDiscountCodeBottomSheet
        initialCode={discountCode}
        onApply={(code) => {
          setDiscountCode(code);
          setIsDiscountCodeSheetVisible(false);
        }}
        onClose={() => setIsDiscountCodeSheetVisible(false)}
        visible={isDiscountCodeSheetVisible}
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
