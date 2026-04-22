import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import SupportTicketListItem from '../../../../general/components/support/SupportTicketListItem';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useSupportMyTicketsQuery } from '../../hooks/useSupportMyTicketsQuery';
import type { HomeVisitsStackParamList } from '../../navigation/types';
import { mapSupportTicketToListItem } from '../../utils/supportTicketMappers';

export default function HomeVisitsSupportTicketsScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();
  const ticketsQuery = useSupportMyTicketsQuery();

  const tickets = useMemo(
    () =>
      (ticketsQuery.data?.tickets ?? []).map((ticket) =>
        mapSupportTicketToListItem(ticket, (orderId) =>
          t('home_visits_support_tickets_order_id', { orderId }),
        ),
      ),
    [t, ticketsQuery.data?.tickets],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('home_visits_support_back_action')}
        rightAccessibilityLabel={t('home_visits_support_tickets_search_action')}
        rightIconName="search-outline"
        title={t('home_visits_support_tickets_title')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Text
          color={colors.text}
          style={{ fontSize: typography.size.lg, lineHeight: typography.lineHeight.lg2 }}
          weight="bold"
        >
          {t('home_visits_support_tickets_heading')}
        </Text>

        {ticketsQuery.isPending ? (
          <Text color={colors.mutedText}>{t('home_visits_support_tickets_loading')}</Text>
        ) : null}

        {ticketsQuery.isError ? (
          <Text color={colors.danger}>{ticketsQuery.error.message}</Text>
        ) : null}

        {!ticketsQuery.isPending && !ticketsQuery.isError && tickets.length === 0 ? (
          <Text color={colors.mutedText}>{t('home_visits_support_tickets_empty')}</Text>
        ) : null}

        {tickets.map((ticket) => (
          <SupportTicketListItem
            key={ticket.id}
            dayNumber={ticket.dayNumber}
            dateLabel={ticket.dateLabel}
            onPress={() =>
              navigation.navigate('SupportChat', {
                agentName: ticket.title || t('home_visits_support_ticket_fallback_title'),
                chatBoxId: ticket.chatBoxId || undefined,
                receiverId: ticket.assignedAdminId || undefined,
              })
            }
            orderIdLabel={ticket.orderIdLabel}
            preview={ticket.preview}
            statusLabel={ticket.statusLabel}
            statusTone={ticket.statusTone}
            title={ticket.title}
            unreadCount={ticket.unreadCount}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
