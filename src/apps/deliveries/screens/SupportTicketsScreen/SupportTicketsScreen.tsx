import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SupportHeader from '../../components/support/SupportHeader';
import SupportTicketListItem from '../../components/support/SupportTicketListItem';
import { useSupportMyTicketsQuery } from '../../hooks/useSupportMyTicketsQuery';
import { SupportHomeNavigationProp } from '../../navigation/supportNavigationTypes';
import { mapSupportTicketToListItem } from '../../utils/supportTicketMappers';

export default function SupportTicketsScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<SupportHomeNavigationProp>();
  const supportMyTicketsQuery = useSupportMyTicketsQuery();
  const tickets = supportMyTicketsQuery.data?.tickets.map((ticket) =>
    mapSupportTicketToListItem(ticket, (orderId) => t('support_tickets_order_id', { orderId })),
  ) ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        title={t('support_tickets_title')}
        rightAccessibilityLabel={t('support_tickets_search_action')}
        rightIconName="search-outline"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          color={colors.text}
          weight="bold"
          style={{ fontSize: typography.size.lg, lineHeight: typography.lineHeight.lg2 }}
        >
          {t('support_tickets_heading')}
        </Text>

        {supportMyTicketsQuery.isPending ? (
          <Text color={colors.mutedText}>{t('support_tickets_loading')}</Text>
        ) : null}

        {supportMyTicketsQuery.isError ? (
          <Text color={colors.danger}>{supportMyTicketsQuery.error.message}</Text>
        ) : null}

        {!supportMyTicketsQuery.isPending && !supportMyTicketsQuery.isError && tickets.length === 0 ? (
          <Text color={colors.mutedText}>{t('support_tickets_empty')}</Text>
        ) : null}

        {tickets.map((ticket) => (
          <SupportTicketListItem
            key={ticket.id}
            dateLabel={ticket.dateLabel}
            dayNumber={ticket.dayNumber}
            onPress={() => navigation.navigate('SupportTicketDetail', { ticket })}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
