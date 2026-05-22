import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { formatMinutesToDurationLabel } from '../../components/ServiceCenterServicesList/serviceDuration';
import ServiceModeSection from '../../components/TeamAndSchedule/ServiceModeSection';
import TeamAndScheduleFooter from '../../components/TeamAndSchedule/TeamAndScheduleFooter';
import TeamAndScheduleHeader from '../../components/TeamAndSchedule/TeamAndScheduleHeader';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import type { HomeVisitsWorkerType } from '../../types/teamSchedule';

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

  const [workerType, setWorkerType] = useState<HomeVisitsWorkerType>('individual');
  const workingHours = 5;
  const [serviceMode, setServiceMode] = useState<'one-time' | 'contract'>('one-time');
  const [jobDescription, setJobDescription] = useState('');
  const trimmedJobDescription = jobDescription.trim();
  const [contractDays, setContractDays] = useState(30);
  const teamSize = workerType === 'team' ? 2 : 1;
  const totalPrice = summary.totalPrice + Math.max(teamSize - 1, 0) * 12 * workingHours;
  const totalDurationMinutes = summary.durationMinutes + (workingHours * 60);
  const totalDurationLabel = formatMinutesToDurationLabel(totalDurationMinutes) ?? summary.durationLabel;
  const serviceCountLabel = `${summary.serviceCount} ${
    summary.serviceCount === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural')
  }`;
  const workersLabel = `${teamSize} ${teamSize === 1 ? t('team_worker_singular') : t('team_worker_plural')}`;
  const handleSelectServiceMode = (nextMode: 'one-time' | 'contract') => {
    setServiceMode(nextMode);
  };

  const navigateToChooseDateAndTime = () => {
    if (!trimmedJobDescription) {
      return;
    }

    navigation.push('ChooseDateAndTime', {
      contractDays,
      initialSelection,
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
      jobDescription: trimmedJobDescription,
      workerType,
      teamSize,
      workingHours,
    });
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
        <ServiceModeSection
          onSelect={(nextType) => setWorkerType(nextType as HomeVisitsWorkerType)}
          options={[
            {
              id: 'individual',
              title: t('team_schedule_worker_type_individual_title'),
              description: t('team_schedule_worker_type_individual_description'),
            },
            {
              id: 'team',
              title: t('team_schedule_worker_type_team_title'),
              description: t('team_schedule_worker_type_team_description'),
            },
          ]}
          selectedMode={workerType}
          title={t('team_schedule_worker_type_title')}
        />

        <ServiceModeSection
          onSelect={(nextMode) => handleSelectServiceMode(nextMode as 'one-time' | 'contract')}
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

        <View style={styles.jobDescriptionWrap}>
          <View style={[styles.jobDescriptionCard, { borderColor: colors.border }]}>
            <View style={styles.jobDescriptionHeader}>
              <Icon type="Feather" name="file-text" size={16} color={colors.warning} />
              <Text
                weight="semiBold"
                style={{ color: colors.text }}
              >
                {t('team_schedule_job_description_title')}
              </Text>
            </View>
            <TextInput
              multiline
              onChangeText={setJobDescription}
              placeholder={t('team_schedule_job_description_placeholder')}
              placeholderTextColor={colors.iconMuted}
              style={[
                styles.jobDescriptionInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              textAlignVertical="top"
              value={jobDescription}
            />
          </View>
        </View>
      </ScrollView>

      <TeamAndScheduleFooter
        bottomInset={insets.bottom}
        continueLabel={t('team_schedule_continue')}
        disabled={!trimmedJobDescription}
        durationLabel={totalDurationLabel}
        onContinue={navigateToChooseDateAndTime}
        serviceCountLabel={serviceCountLabel}
        totalPrice={totalPrice}
        workersLabel={workersLabel}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  jobDescriptionCard: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  jobDescriptionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  jobDescriptionInput: {
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 80,
    padding: 10,
  },
  jobDescriptionWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  screen: {
    flex: 1,
  },
});
