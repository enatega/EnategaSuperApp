import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { TrackWorkerStage } from '../../utils/trackWorkerStatus';

type Props = {
  stage: TrackWorkerStage;
  progressStep: number;
  statusMessage?: string | null;
};

export default function TrackWorkerStatusBlock({ stage, progressStep, statusMessage }: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();

  const title = resolveStageTitle(stage, t);
  const subtitle = statusMessage || resolveStageSubtitle(stage, t);
  const etaLabel = resolveStageEta(stage, t);

  if (stage === 'payment_confirmed') {
    return (
      <View style={styles.statusBlockOnly}>
        <View style={[styles.iconCircle, { backgroundColor: '#F59E0B' }]}> 
          <MaterialCommunityIcons color="#fff" name="check" size={38} />
        </View>
        <Text style={[styles.paymentConfirmedTitle, { color: colors.text }]} weight="bold">
          {t('single_vendor_track_worker_payment_confirmed')}
        </Text>
      </View>
    );
  }

  if (stage === 'feedback') {
    return null;
  }

  if (stage === 'payment') {
    return (
      <View style={styles.paymentWrap}>
        <View style={styles.paymentIconOuter}>
          <View style={styles.paymentIconInner}>
            <MaterialCommunityIcons color="#fff" name="check" size={40} />
          </View>
        </View>

        <Text style={[styles.paymentHeading, { color: colors.text }]} weight="bold">
          Job Finished! Complete your transaction
        </Text>

        <Text style={[styles.paymentDescription, { color: colors.text }]} weight="medium">
          {statusMessage || 'Your order is on the way.'}
        </Text>

        <View style={[styles.paymentDivider, { backgroundColor: colors.border }]} />
      </View>
    );
  }

  return (
    <View style={styles.statusBlock}>
      <View style={[styles.iconCircle, { backgroundColor: '#F59E0B' }]}> 
        <MaterialCommunityIcons color="#fff" name={resolveStageIcon(stage)} size={34} />
      </View>

      {etaLabel ? (
        <Text style={[styles.etaLabel, { color: colors.mutedText }]} weight="medium">
          {etaLabel}
        </Text>
      ) : null}

      <Text style={[styles.title, { color: colors.text }]} weight="bold">
        {title}
      </Text>

      {isProgressVisible(stage) ? (
        <View style={styles.progressRow}>
          {Array.from({ length: 4 }).map((_, index) => {
            const isActive = index < progressStep;
            return (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor: isActive ? colors.warning : colors.border,
                  },
                ]}
              />
            );
          })}
        </View>
      ) : null}

      <Text style={[styles.subtitle, { color: colors.text }]} weight="medium">
        {subtitle}
      </Text>
    </View>
  );
}

function isProgressVisible(stage: TrackWorkerStage) {
  return (
    stage === 'preparing' ||
    stage === 'on_way' ||
    stage === 'anytime_now' ||
    stage === 'service_started'
  );
}

function resolveStageIcon(stage: TrackWorkerStage) {
  switch (stage) {
    case 'service_started':
      return 'scissors-cutting';
    case 'payment':
      return 'check';
    case 'cancelled':
      return 'close';
    case 'failed':
      return 'alert';
    default:
      return 'hammer-wrench';
  }
}

function resolveStageTitle(stage: TrackWorkerStage, t: (key: string) => string) {
  switch (stage) {
    case 'on_way':
      return t('single_vendor_track_worker_eta_15_25');
    case 'anytime_now':
      return t('single_vendor_track_worker_anytime_now');
    case 'service_started':
      return t('single_vendor_track_worker_service_started');
    case 'payment':
      return t('single_vendor_track_worker_payment_title');
    case 'cancelled':
      return t('single_vendor_track_worker_cancelled');
    case 'failed':
      return t('single_vendor_track_worker_failed');
    default:
      return t('single_vendor_track_worker_eta_10_15');
  }
}

function resolveStageSubtitle(stage: TrackWorkerStage, t: (key: string) => string) {
  switch (stage) {
    case 'on_way':
      return t('single_vendor_track_worker_on_the_way');
    case 'anytime_now':
      return t('single_vendor_track_worker_anytime_subtitle');
    case 'service_started':
      return t('single_vendor_track_worker_started_subtitle');
    case 'payment':
      return t('single_vendor_track_worker_payment_subtitle');
    case 'cancelled':
      return t('single_vendor_track_worker_cancelled_subtitle');
    case 'failed':
      return t('single_vendor_track_worker_failed_subtitle');
    default:
      return t('single_vendor_track_worker_preparing_subtitle');
  }
}

function resolveStageEta(stage: TrackWorkerStage, t: (key: string) => string) {
  switch (stage) {
    case 'on_way':
    case 'anytime_now':
      return t('single_vendor_track_worker_eta_label');
    case 'preparing':
      return t('single_vendor_track_worker_estimated_service_label');
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  etaLabel: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 2,
    textAlign: 'center',
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    marginBottom: 14,
    width: 88,
  },
  paymentConfirmedTitle: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  paymentDescription: {
    fontSize: 24 / 2,
    lineHeight: 36 / 2,
    textAlign: 'center',
    width: '92%',
  },
  paymentDivider: {
    height: 1,
    marginTop: 12,
    width: '100%',
  },
  paymentHeading: {
    fontSize: 54 / 2,
    lineHeight: 38,
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'center',
    width: '92%',
  },
  paymentIconInner: {
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 52,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  paymentIconOuter: {
    alignItems: 'center',
    backgroundColor: '#F9E9D0',
    borderRadius: 56,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  paymentWrap: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 10,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
    marginTop: 8,
    width: '80%',
  },
  progressSegment: {
    borderRadius: 4,
    flex: 1,
    height: 4,
  },
  statusBlock: {
    alignItems: 'center',
    paddingBottom: 2,
    paddingTop: 8,
  },
  statusBlockOnly: {
    alignItems: 'center',
    minHeight: 520,
    paddingTop: 250,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
});
