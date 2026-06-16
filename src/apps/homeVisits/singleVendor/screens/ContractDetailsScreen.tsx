import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWalletSavedCardsQuery } from '../../../../general/api/walletSavedCardsService';
import { showToast } from '../../../../general/components/AppToast';
import Button from '../../../../general/components/Button';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';
import useSingleVendorContractDetails from '../hooks/useSingleVendorContractDetails';

type Props = NativeStackScreenProps<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorContractDetails'
>;

function weekdayLabel(day: number) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
    new Date(2024, 0, 7 + day),
  );
}

function formatMoney(amount?: number | null) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
}

function formatDateRange(start: string, end: string) {
  return `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`;
}

export default function ContractDetailsScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const { contractId } = route.params;
  const queryClient = useQueryClient();
  const { data, refetch, isRefetching, isLoading } = useSingleVendorContractDetails(contractId);
  const [cancellationReason, setCancellationReason] = React.useState('');
  const [showCancellationForm, setShowCancellationForm] = React.useState(false);
  const savedCardsQuery = useWalletSavedCardsQuery('home-services');
  const hasSavedCard = (savedCardsQuery.data?.cards?.length ?? 0) > 0;

  const payInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) =>
      homeVisitsSingleVendorDiscoveryService.payContractInvoiceWithSavedCard(invoiceId),
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: homeVisitsKeys.singleVendorContractDetail(contractId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeVisitsKeys.singleVendorContractsBase(),
        }),
      ]);

      const status = `${response.stripeStatus ?? ''}`.toLowerCase();
      const paymentStatus = `${response.paymentStatus ?? ''}`.toLowerCase();

      if (status === 'succeeded' || paymentStatus === 'paid') {
        showToast.success(
          t('single_vendor_contract_invoice_paid_title'),
          t('single_vendor_contract_invoice_paid_message'),
        );
        return;
      }

      showToast.success(
        t('single_vendor_contract_invoice_processing_title'),
        response.message,
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : t('single_vendor_contract_invoice_payment_failed_message');
      showToast.error(t('single_vendor_contract_invoice_payment_failed_title'), message);
    },
  });

  const requestCancellationMutation = useMutation({
    mutationFn: (reason: string) =>
      homeVisitsSingleVendorDiscoveryService.requestContractCancellation(contractId, { reason }),
    onSuccess: async (updatedContract) => {
      await Promise.all([
        queryClient.setQueryData(
          homeVisitsKeys.singleVendorContractDetail(contractId),
          updatedContract,
        ),
        queryClient.invalidateQueries({
          queryKey: homeVisitsKeys.singleVendorContractsBase(),
          exact: false,
        }),
      ]);
      setCancellationReason('');
      setShowCancellationForm(false);
      showToast.success(
        t('single_vendor_contract_contract_cancellation_success_title'),
        t('single_vendor_contract_contract_cancellation_success_message'),
      );
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : undefined;
      showToast.error(
        t('single_vendor_contract_contract_cancellation_error_title'),
        message || t('single_vendor_contract_contract_cancellation_error_title'),
      );
    },
  });

  const onPayInvoice = React.useCallback(
    (invoiceId: string) => {
      if (!hasSavedCard) {
        showToast.error(
          t('single_vendor_contract_saved_card_required_title'),
          t('single_vendor_contract_saved_card_required_message'),
        );
        return;
      }

      payInvoiceMutation.mutate(invoiceId);
    },
    [hasSavedCard, payInvoiceMutation],
  );

  const assignedTeamLabel = React.useMemo(() => {
    if (!data?.assignedWorkers?.length) {
      return t('single_vendor_contract_no_team');
    }

    return data.assignedWorkers
      .map((worker) => {
        const name = worker.name?.trim() || t('single_vendor_contract_worker_fallback');
        const isSupervisor =
          worker.id === data.supervisorWorkerId || worker.role === 'supervisor';
        return isSupervisor ? `${name} (Lead)` : name;
      })
      .join(', ');
  }, [data?.assignedWorkers, data?.supervisorWorkerId, t]);

  const cancellationStatus = data?.cancellationStatus ?? 'none';
  const canRequestCancellation =
    data?.status === 'active' &&
    cancellationStatus !== 'requested' &&
    cancellationStatus !== 'approved';

  const cancellationButtonLabel =
    cancellationStatus === 'rejected'
      ? t('single_vendor_contract_contract_cancellation_request_again_button')
      : t('single_vendor_contract_contract_cancellation_request_button');

  const onSubmitCancellationRequest = React.useCallback(() => {
    const trimmedReason = cancellationReason.trim();
    if (trimmedReason.length < 5) {
      showToast.error(
        t('single_vendor_contract_contract_cancellation_error_title'),
        t('single_vendor_contract_contract_cancellation_reason_placeholder'),
      );
      return;
    }

    requestCancellationMutation.mutate(trimmedReason);
  }, [cancellationReason, requestCancellationMutation, t]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        showBack
        onBack={() => navigation.goBack()}
        title={t('single_vendor_contract_details_title')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <Text style={{ color: colors.text }}>{t('single_vendor_contract_loading')}</Text>
        ) : null}

        {data ? (
          <>
            <Section title={t('single_vendor_contract_overview_title')}>
              <DetailRow label={t('single_vendor_contract_plan_label')} value={data.contractType} />
              <DetailRow
                label={t('single_vendor_contract_status_label')}
                value={
                  data.status === 'pending_approval'
                    ? t('single_vendor_contract_pending_approval')
                    : data.status
                }
              />
              <DetailRow
                label={t('single_vendor_contract_monthly_fee')}
                value={
                  data.monthlyFeeAmount != null
                    ? formatMoney(data.monthlyFeeAmount)
                    : t('single_vendor_contract_pending_approval')
                }
              />
              <DetailRow
                label={t('single_vendor_contract_team_label')}
                value={
                  data.workerType === 'team'
                    ? t('single_vendor_contract_team_value', { count: data.teamSize ?? 0 })
                    : t('single_vendor_contract_individual')
                }
              />
              <DetailRow
                label={t('single_vendor_contract_daily_hours_label')}
                value={t('single_vendor_contract_daily_hours_value', {
                  count: data.workingHours ?? 0,
                })}
              />
              <DetailRow
                label={t('single_vendor_contract_service_center_label')}
                value={data.serviceCenterName ?? '-'}
              />
              <DetailRow
                label={t('single_vendor_contract_visit_days_label')}
                value={
                  (data.selectedWeekdays ?? []).map(weekdayLabel).join(', ') ||
                  t('single_vendor_contract_flexible')
                }
              />
              <DetailRow
                label={t('single_vendor_contract_start_date_label')}
                value={new Date(data.startDate).toLocaleDateString()}
              />
              <DetailRow
                label={t('single_vendor_contract_end_date_label')}
                value={new Date(data.endDate).toLocaleDateString()}
              />
            </Section>

            <Section title={t('single_vendor_contract_assigned_team_title')}>
              <DetailRow
                label={t('single_vendor_contract_supervisor_members_label')}
                value={assignedTeamLabel}
              />
              {data.assignedWorkers.map((worker) => (
                <DetailRow
                  key={worker.id}
                  label={
                    worker.role === 'supervisor'
                      ? t('single_vendor_contract_lead_worker_label')
                      : t('single_vendor_contract_team_member_label')
                  }
                  value={worker.name?.trim() || worker.phone || worker.id}
                />
              ))}
            </Section>

            {data.jobDescription || data.customerNote ? (
              <Section title={t('single_vendor_contract_notes_title')}>
                {data.jobDescription ? (
                  <DetailRow
                    label={t('single_vendor_contract_job_description_label')}
                    value={data.jobDescription}
                  />
                ) : null}
                {data.customerNote ? (
                  <DetailRow
                    label={t('single_vendor_contract_customer_note_label')}
                    value={data.customerNote}
                  />
                ) : null}
              </Section>
            ) : null}

            <Section title={t('single_vendor_contract_billing_title')}>
              <DetailRow
                label={t('single_vendor_contract_saved_card_label')}
                value={
                  hasSavedCard
                    ? t('single_vendor_contract_saved_card_available')
                    : t('single_vendor_contract_saved_card_missing')
                }
              />
              {data.approvedAt ? (
                <DetailRow
                  label={t('single_vendor_contract_approved_at')}
                  value={new Date(data.approvedAt).toLocaleString()}
                />
              ) : null}
            </Section>

            <Section title={t('single_vendor_contract_invoices_title')}>
              {data.status === 'pending_approval' ? (
                <Text style={{ color: colors.text }}>
                  {t('single_vendor_contract_pending_approval')}
                </Text>
              ) : (
                data.invoices.map((invoice) => (
                  <View
                    key={invoice.invoiceId}
                    style={[
                      styles.invoiceCard,
                      { borderColor: colors.border, backgroundColor: colors.surfaceSoft },
                    ]}
                  >
                    <DetailRow
                      label={formatDateRange(invoice.periodStart, invoice.periodEnd)}
                      value={`${invoice.status} • ${formatMoney(invoice.amount)}`}
                    />
                    <DetailRow
                      label={t('single_vendor_contract_due_date_label')}
                      value={new Date(invoice.dueDate).toLocaleDateString()}
                    />
                    <DetailRow
                      label={t('single_vendor_contract_visits_in_invoice_label')}
                      value={`${invoice.visitCount}`}
                    />
                    {invoice.paidAt ? (
                      <DetailRow
                        label={t('single_vendor_contract_paid_at_label')}
                        value={new Date(invoice.paidAt).toLocaleString()}
                      />
                    ) : null}
                    {invoice.status === 'pending' || invoice.status === 'overdue' ? (
                      <Button
                        label={
                          invoice.status === 'overdue'
                            ? t('single_vendor_contract_pay_overdue_invoice')
                            : t('single_vendor_contract_pay_invoice')
                        }
                        onPress={() => onPayInvoice(invoice.invoiceId)}
                        disabled={!hasSavedCard}
                        isLoading={
                          payInvoiceMutation.isPending &&
                          payInvoiceMutation.variables === invoice.invoiceId
                        }
                        style={styles.invoiceButton}
                      />
                    ) : null}
                  </View>
                ))
              )}
            </Section>

            <Section title={t('single_vendor_contract_schedule_title')}>
              <DetailRow
                label={t('single_vendor_contract_visit_days_label')}
                value={
                  (data.selectedWeekdays ?? []).map(weekdayLabel).join(', ') ||
                  t('single_vendor_contract_flexible')
                }
              />
              <DetailRow
                label={t('single_vendor_contract_schedule_coverage_label')}
                value={`${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}`}
              />
              <DetailRow
                label={t('single_vendor_contract_schedule_delivery_label')}
                value={t('single_vendor_contract_schedule_delivery_value')}
              />
            </Section>

            <Section title={t('single_vendor_contract_contract_cancellation_title')}>
              <DetailRow
                label={t('single_vendor_contract_contract_cancellation_status_label')}
                value={t(`single_vendor_contract_contract_cancellation_status_${cancellationStatus}`)}
              />
              {data.cancellationReason ? (
                <DetailRow
                  label={t('single_vendor_contract_contract_cancellation_reason_label')}
                  value={data.cancellationReason}
                />
              ) : null}
              {data.cancellationRequestedAt ? (
                <DetailRow
                  label={t('single_vendor_contract_contract_cancellation_requested_at_label')}
                  value={new Date(data.cancellationRequestedAt).toLocaleString()}
                />
              ) : null}
              {data.cancellationReviewNote ? (
                <DetailRow
                  label={t('single_vendor_contract_contract_cancellation_review_note_label')}
                  value={data.cancellationReviewNote}
                />
              ) : null}
              {data.cancellationReviewedAt ? (
                <DetailRow
                  label={t('single_vendor_contract_contract_cancellation_reviewed_at_label')}
                  value={new Date(data.cancellationReviewedAt).toLocaleString()}
                />
              ) : null}

              {canRequestCancellation ? (
                <>
                  {showCancellationForm ? (
                    <TextInput
                      multiline
                      value={cancellationReason}
                      onChangeText={setCancellationReason}
                      placeholder={t('single_vendor_contract_contract_cancellation_reason_placeholder')}
                      placeholderTextColor={colors.mutedText}
                      style={[
                        styles.reasonInput,
                        {
                          borderColor: colors.border,
                          color: colors.text,
                          backgroundColor: colors.background,
                        },
                      ]}
                    />
                  ) : null}
                  <Button
                    label={
                      requestCancellationMutation.isPending
                        ? t('single_vendor_contract_contract_cancellation_submitting')
                        : showCancellationForm
                        ? t('single_vendor_contract_contract_cancellation_submit')
                        : cancellationButtonLabel
                    }
                    onPress={() => {
                      if (!showCancellationForm) {
                        setShowCancellationForm(true);
                        return;
                      }

                      onSubmitCancellationRequest();
                    }}
                    isLoading={requestCancellationMutation.isPending}
                    style={styles.invoiceButton}
                  />
                </>
              ) : null}
            </Section>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderColor: colors.border, backgroundColor: colors.backgroundTertiary }]}>
      <Text weight="bold" style={{ color: colors.text, marginBottom: 8 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.mutedText, flex: 1 }}>{label}</Text>
      <Text style={{ color: colors.text, flex: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 16,
  },
  invoiceButton: {
    marginTop: 8,
  },
  invoiceCard: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 6,
  },
  reasonInput: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    minHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  screen: {
    flex: 1,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
});
