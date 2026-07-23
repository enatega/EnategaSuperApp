import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportTicketListItem, { type SupportTicketStatusTone } from '../../../../general/components/support/SupportTicketListItem';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { appointmentSupportKeys, appointmentSupportService } from '../../api/supportService';
import type { AppointmentsStackParamList } from '../../navigation/types';

function getStatusTone(status: string): SupportTicketStatusTone {
  if (status === 'resolved' || status === 'closed') return 'success';
  if (status === 'in_progress') return 'info';
  return 'danger';
}

export default function AppointmentsSupportTicketsScreen() {
  const { colors, typography } = useTheme();
  const navigation = useNavigation<NavigationProp<AppointmentsStackParamList>>();
  const query = useQuery({ queryKey: appointmentSupportKeys.tickets, queryFn: appointmentSupportService.getTickets });
  const tickets = query.data?.tickets ?? [];
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader title="My tickets" backAccessibilityLabel="Go back" rightAccessibilityLabel="Search tickets" rightIconName="search-outline" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text color={colors.text} weight="bold" style={{ fontSize: typography.size.lg }}>Support requests</Text>
        {query.isPending ? <Text color={colors.mutedText}>Loading tickets…</Text> : null}
        {query.isError ? <Text color={colors.danger}>{query.error.message}</Text> : null}
        {!query.isPending && !query.isError && !tickets.length ? <Text color={colors.mutedText}>You have no support tickets yet.</Text> : null}
        {tickets.map((ticket) => <SupportTicketListItem key={ticket.id} dayNumber={ticket.date.day} dateLabel={ticket.date.month} title={ticket.title.replaceAll('_', ' ')} preview={ticket.subtitle} statusLabel={ticket.status.label} statusTone={getStatusTone(ticket.status.key)} unreadCount={ticket.unreadCount} onPress={() => navigation.navigate('SupportTicketDetail', { ticket })} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 }, content: { gap: 12, padding: 16, paddingBottom: 28 } });
