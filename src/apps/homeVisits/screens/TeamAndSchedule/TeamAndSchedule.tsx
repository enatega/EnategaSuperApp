import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppPopup from '../../../../general/components/AppPopup';
import { getApiErrorMessage } from '../../../../general/utils/apiError';
import { useTheme } from '../../../../general/theme/theme';
import HomeVisitsDateTimePickerSheet from '../../components/common/HomeVisitsDateTimePickerSheet';
import { formatMinutesToDurationLabel } from '../../components/ServiceCenterServicesList/serviceDuration';
import CustomTeamSizeSheet from '../../components/TeamAndSchedule/CustomTeamSizeSheet';
import ContractTimeRangeSheet from '../../components/TeamAndSchedule/ContractTimeRangeSheet';
import ServiceModeSection from '../../components/TeamAndSchedule/ServiceModeSection';
import TeamAndScheduleFooter from '../../components/TeamAndSchedule/TeamAndScheduleFooter';
import TeamAndScheduleHeader from '../../components/TeamAndSchedule/TeamAndScheduleHeader';
import TeamSizeSection from '../../components/TeamAndSchedule/TeamSizeSection';
import WorkingHoursSection from '../../components/TeamAndSchedule/WorkingHoursSection';
import { homeVisitsSingleVendorDiscoveryService } from '../../singleVendor/api/discoveryService';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import {
  formatBookingDateOnly,
  isBookingTimeAvailable,
  isBookingTimeRangeAvailable,
} from '../../utils/bookingAvailability';
import type { HomeVisitsScheduledSlot } from '../../types/teamSchedule';

type TeamAndScheduleRouteProp = RouteProp<
  HomeVisitsSingleVendorNavigationParamList,
  'TeamAndSchedule'
>;

export default function TeamAndSchedule() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const route = useRoute<TeamAndScheduleRouteProp>();
  const {
    initialSelection,
    selectedServiceIds,
    selectedServices,
    serviceCenterId,
    serviceId,
    summary,
  } = route.params;

  const [teamSize, setTeamSize] = useState(1);
  const [workingHours, setWorkingHours] = useState(6);
  const [serviceMode, setServiceMode] = useState<'one-time' | 'contract'>('one-time');
  const [contractDays, setContractDays] = useState(30);
  const [isCustomSheetOpen, setIsCustomSheetOpen] = useState(false);
  const [isContractRangeSheetOpen, setIsContractRangeSheetOpen] = useState(false);
  const [isDateTimeSheetOpen, setIsDateTimeSheetOpen] = useState(false);
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

  const totalPrice = summary.totalPrice + Math.max(teamSize - 1, 0) * 12 * workingHours;
  const totalDurationMinutes = summary.durationMinutes + (workingHours * 60);
  const totalDurationLabel = formatMinutesToDurationLabel(totalDurationMinutes) ?? summary.durationLabel;
  const serviceCountLabel = `${summary.serviceCount} ${
    summary.serviceCount === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural')
  }`;
  const workersLabel = `${teamSize} ${teamSize === 1 ? t('team_worker_singular') : t('team_worker_plural')}`;
  const buildScheduledSlot = (scheduledAtIso: string): HomeVisitsScheduledSlot => {
    const startDate = new Date(scheduledAtIso);
    const endDate = new Date(startDate.getTime() + (workingHours * 60 * 60 * 1000));
    const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    return {
      startTime,
      endTime,
    };
  };
  const formatContractDaysLabel = (days: number) =>
    `${days} ${days === 1 ? t('team_schedule_day_singular') : t('team_schedule_day_plural')}`;

  const handleSelectServiceMode = (nextMode: 'one-time' | 'contract') => {
    setServiceMode(nextMode);
    if (nextMode === 'contract') {
      setIsContractRangeSheetOpen(true);
    }
  };

  const navigateToReview = (scheduledAtIso: string) => {
    setIsDateTimeSheetOpen(false);
    navigation.push('ReviewAndConfirm', {
      contractDays,
      initialSelection,
      scheduledAtIso,
      scheduledSlot: buildScheduledSlot(scheduledAtIso),
      selectedServiceIds,
      selectedServices,
      serviceCenterId,
      serviceId,
      serviceMode,
      summary: {
        ...summary,
        durationLabel: totalDurationLabel,
        durationMinutes: totalDurationMinutes,
        totalPrice,
      },
      teamSize,
      workingHours,
    });
  };

  const hidePopup = () => {
    setAvailabilityPopup((previous) => ({ ...previous, visible: false }));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <TeamAndScheduleHeader
        onBack={() => navigation.goBack()}
        onClose={() => navigation.popToTop()}
        title={t('team_schedule_title')}
        topInset={insets.top}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <TeamSizeSection
          helperText={t('team_schedule_team_size_helper')}
          onOpenCustom={() => setIsCustomSheetOpen(true)}
          onSelectTeamSize={setTeamSize}
          selectedTeamSize={teamSize}
          title={t('team_schedule_team_size_title')}
        />

        <WorkingHoursSection
          helperText={t('team_schedule_working_hours_helper')}
          hours={workingHours}
          onChangeHours={setWorkingHours}
          title={t('team_schedule_working_hours_title')}
        />

        <ServiceModeSection
          onSelect={handleSelectServiceMode}
          options={[
            {
              id: 'one-time',
              title: t('team_schedule_service_mode_one_time_title'),
              description: t('team_schedule_service_mode_one_time_description'),
            },
            {
              id: 'contract',
              title: t('team_schedule_service_mode_contract_title'),
              description: t('team_schedule_service_mode_contract_description'),
            },
          ]}
          selectedMode={serviceMode}
          title={t('team_schedule_service_mode_title')}
        />
      </ScrollView>

      <TeamAndScheduleFooter
        bottomInset={insets.bottom}
        continueLabel={t('team_schedule_continue')}
        durationLabel={totalDurationLabel}
        onContinue={() => setIsDateTimeSheetOpen(true)}
        serviceCountLabel={serviceCountLabel}
        totalPrice={totalPrice}
        workersLabel={workersLabel}
      />

      <CustomTeamSizeSheet
        addLabel={t('team_schedule_custom_add')}
        fieldLabel={t('team_schedule_custom_field_placeholder')}
        helperText={t('team_schedule_custom_helper')}
        onAdd={setTeamSize}
        onClose={() => setIsCustomSheetOpen(false)}
        title={t('team_schedule_custom_title')}
        visible={isCustomSheetOpen}
      />

      <HomeVisitsDateTimePickerSheet
        isConfirmLoading={isCheckingAvailability}
        onClose={() => setIsDateTimeSheetOpen(false)}
        onConfirm={async (nextDate) => {
          if (isCheckingAvailability) {
            return;
          }

          try {
            setIsCheckingAvailability(true);
            const bookingDate = formatBookingDateOnly(nextDate);

            if (serviceMode === 'contract') {
              const response =
                await homeVisitsSingleVendorDiscoveryService.getBookingAvailabilityRange({
                  serviceCenterId,
                  startDate: bookingDate,
                  days: contractDays,
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

              if (!isBookingTimeRangeAvailable(response, nextDate, teamSize, contractDays)) {
                setAvailabilityPopup({
                  visible: true,
                  title: t('team_schedule_slot_not_available_title'),
                  description: t('team_schedule_slot_not_available_description'),
                });
                return;
              }

              navigateToReview(nextDate.toISOString());
              return;
            }

            const response =
              await homeVisitsSingleVendorDiscoveryService.getBookingAvailability({
                serviceCenterId,
                date: bookingDate,
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

            navigateToReview(nextDate.toISOString());
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
        value={null}
        visible={isDateTimeSheetOpen}
      />

      <ContractTimeRangeSheet
        addLabel={t('team_schedule_contract_range_add')}
        customLabel={t('team_schedule_contract_range_custom')}
        customPlaceholder={t('team_schedule_contract_range_custom_placeholder')}
        formatDaysLabel={formatContractDaysLabel}
        helperText={t('team_schedule_contract_range_helper')}
        initialDays={contractDays}
        onAdd={setContractDays}
        onClose={() => setIsContractRangeSheetOpen(false)}
        title={t('team_schedule_contract_range_title')}
        visible={isContractRangeSheetOpen}
      />

      <AppPopup
        description={availabilityPopup.description}
        dismissOnOverlayPress
        onRequestClose={hidePopup}
        primaryAction={{
          label: t('ok'),
          onPress: hidePopup,
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
