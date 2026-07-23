import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportIssueDropdown, { type SupportIssueOption } from '../../../../general/components/support/SupportIssueDropdown';
import Text from '../../../../general/components/Text';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import { appointmentSupportKeys, appointmentSupportService } from '../../api/supportService';
import type { AppointmentsStackParamList } from '../../navigation/types';

const DEFAULT_REASONS: SupportIssueOption[] = [
  { value: 'my_booking', label: 'My booking' },
  { value: 'cancellation_or_reschedule', label: 'Cancellation or reschedule' },
  { value: 'payment_or_refund', label: 'Payment or refund' },
  { value: 'professional_or_store', label: 'Professional or store' },
  { value: 'account_or_notification', label: 'Account or notifications' },
  { value: 'technical_problem', label: 'Technical problem' },
  { value: 'other', label: 'Other' },
];

export default function AppointmentsSupportContactFormScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<AppointmentsStackParamList>>();
  const route = useRoute<RouteProp<AppointmentsStackParamList, 'SupportContactForm'>>();
  const session = useAuthSessionQuery();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(session.data?.user?.email ?? '');
  const [reason, setReason] = useState<string>();
  const [description, setDescription] = useState('');
  const reasonOptions = useMemo(() => DEFAULT_REASONS, []);
  const createTicket = useMutation({
    mutationFn: appointmentSupportService.createTicket,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: appointmentSupportKeys.tickets });
      showToast.success('Request submitted', 'Your issue is now available in My tickets.');
      navigation.navigate('SupportTickets');
    },
    onError: (error) => showToast.error('Unable to submit request', error.message),
  });
  const isValid = Boolean(email.trim() && reason && description.trim());

  useEffect(() => {
    if (!email && session.data?.user?.email) setEmail(session.data.user.email);
  }, [email, session.data?.user?.email]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader title="Contact support" backAccessibilityLabel="Go back" rightAccessibilityLabel="Support" rightIconName="help-circle-outline" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text weight="extraBold" color={colors.text} style={styles.title}>Tell us how we can help</Text>
        <Text color={colors.mutedText}>Your request will be sent to the General Booking support team and saved in My tickets.</Text>
        <View style={styles.field}>
          <Text weight="medium" color={colors.text}>Issue</Text>
          <View style={[styles.readonly, { borderColor: colors.border }]}><Text color={colors.text}>{route.params.issueLabel}</Text></View>
        </View>
        <View style={styles.field}>
          <Text weight="medium" color={colors.text}>Reason</Text>
          <SupportIssueDropdown options={reasonOptions} placeholder="Select a reason" sheetTitle="Select a reason" value={reason} onChange={setReason} />
        </View>
        <View style={styles.field}>
          <Text weight="medium" color={colors.text}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { borderColor: colors.border, color: colors.text }]} />
        </View>
        <View style={styles.field}>
          <Text weight="medium" color={colors.text}>Description</Text>
          <TextInput value={description} onChangeText={setDescription} multiline placeholder="Describe the issue" placeholderTextColor={colors.mutedText} style={[styles.input, styles.description, { borderColor: colors.border, color: colors.text }]} />
        </View>
        <Button
          label="Submit request"
          disabled={!isValid}
          isLoading={createTicket.isPending}
          onPress={() => createTicket.mutate({ category: route.params.issueValue, reason: reason!, email: email.trim(), description: description.trim() })}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { gap: 18, padding: 16, paddingBottom: 32 }, title: { fontSize: 24 },
  field: { gap: 8 }, input: { borderRadius: 10, borderWidth: 1, minHeight: 48, paddingHorizontal: 14 },
  readonly: { borderRadius: 10, borderWidth: 1, minHeight: 48, justifyContent: 'center', paddingHorizontal: 14 },
  description: { minHeight: 130, paddingTop: 14, textAlignVertical: 'top' },
});
