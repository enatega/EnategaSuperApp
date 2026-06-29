import React, { useEffect, useMemo, useState } from 'react';
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
  const baseWorkingHours = useMemo(
    () => Math.max(1, Math.ceil((summary.durationMinutes || 60) / 60)),
    [summary.durationMinutes],
  );
  const [workingHours] = useState(baseWorkingHours);
  const [serviceMode, setServiceMode] = useState<'one-time' | 'contract'>('one-time');
  const [jobDescription, setJobDescription] = useState('');
  const trimmedJobDescription = jobDescription.trim();
  const isJobDescriptionRequired = true;
  const isJobDescriptionMissing = isJobDescriptionRequired && trimmedJobDescription.length === 0;
  const [teamSize, setTeamSize] = useState(1);
  useEffect(() => {
    setTeamSize((current) => {
      if (workerType === 'individual') {
        return 1;
      }

      return Math.max(current, 2);
    });
  }, [workerType]);
  const totalPrice = summary.totalPrice + Math.max(teamSize - 1, 0) * 12 * workingHours;
  const totalDurationMinutes = summary.durationMinutes;
  const totalDurationLabel = formatMinutesToDurationLabel(totalDurationMinutes) ?? summary.durationLabel;
  const serviceCountLabel = `${summary.serviceCount} ${
    summary.serviceCount === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural')
  }`;
  const workersLabel = `${teamSize} ${teamSize === 1 ? t('team_worker_singular') : t('team_worker_plural')}`;
  const workerTypeOptions = useMemo(
    () => [
      {
        id: 'individual',
        title: t('team_schedule_worker_type_individual_title'),
        description: t('team_schedule_worker_type_individual_description'),
        iconType: 'MaterialCommunityIcons' as const,
        iconName: 'account',
      },
      {
        id: 'team',
        title: t('team_schedule_worker_type_team_title'),
        description: t('team_schedule_worker_type_team_description'),
        iconType: 'MaterialCommunityIcons' as const,
        iconName: 'account-group',
      },
    ],
    [t],
  );
  const serviceModeOptions = useMemo(
    () => [
      {
        id: 'one-time',
        title: t('team_schedule_service_mode_one_time_title'),
        description: t('team_schedule_service_mode_one_time_description'),
        iconType: 'MaterialCommunityIcons' as const,
        iconName: 'hammer-wrench',
      },
      {
        id: 'contract',
        title: t('team_schedule_service_mode_contract_title'),
        description: t('team_schedule_service_mode_contract_description'),
        iconType: 'MaterialCommunityIcons' as const,
        iconName: 'calendar-month-outline',
      },
    ],
    [t],
  );
  const workerTypeInfoText = useMemo(
    () => workerTypeOptions.find((option) => option.id === workerType)?.description,
    [workerType, workerTypeOptions],
  );
  const serviceModeInfoText = useMemo(
    () => serviceModeOptions.find((option) => option.id === serviceMode)?.description,
    [serviceMode, serviceModeOptions],
  );
  const handleSelectServiceMode = (nextMode: 'one-time' | 'contract') => {
    setServiceMode(nextMode);
  };

  const navigateToChooseDateAndTime = () => {
    if (isJobDescriptionMissing) {
      return;
    }

    navigation.push('ChooseDateAndTime', {
      contractType: serviceMode === 'contract' ? 'monthly' : undefined,
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
      jobDescription: trimmedJobDescription || undefined,
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.jobDescriptionWrap}>
          <View style={styles.jobDescriptionHeader}>
            <Icon type="Feather" name="file-text" size={20} color={colors.warning} />
            <View style={styles.jobDescriptionHeaderTextWrap}>
              <Text
                weight="extraBold"
                style={{
                  color: colors.text,
                  fontSize: 18,
                  lineHeight: 24,
                }}
              >
                {t('team_schedule_job_description_title')}
              </Text>
              {isJobDescriptionRequired ? (
                <Text
                  weight="semiBold"
                  style={{
                    color: colors.mutedText,
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  Required
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.jobDescriptionCard}>
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
            <Text
              weight="medium"
              style={{
                color: colors.mutedText,
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              A short description helps the worker prepare for the visit.
            </Text>
          </View>
        </View>

        <ServiceModeSection
          onSelect={(nextType) => setWorkerType(nextType as HomeVisitsWorkerType)}
          infoText={workerTypeInfoText}
          options={workerTypeOptions}
          selectedMode={workerType}
          title={t('team_schedule_worker_type_title')}
          titleIconType="FontAwesome"
          titleIconName="users"
        />

        <ServiceModeSection
          onSelect={(nextMode) => handleSelectServiceMode(nextMode as 'one-time' | 'contract')}
          infoText={serviceModeInfoText}
          options={serviceModeOptions}
          selectedMode={serviceMode}
          title={t('team_schedule_service_mode_title')}
          titleIconType="Feather"
          titleIconName="briefcase"
        />
      </ScrollView>

        <TeamAndScheduleFooter
          bottomInset={insets.bottom}
          continueLabel={t('team_schedule_continue')}
          durationLabel={totalDurationLabel}
          disabled={isJobDescriptionMissing}
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
    gap: 12,
  },
  jobDescriptionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  jobDescriptionHeaderTextWrap: {
    flex: 1,
    gap: 2,
  },
  jobDescriptionInput: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 110,
    padding: 12,
  },
  jobDescriptionWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 148,
    paddingTop: 8,
  },
});
