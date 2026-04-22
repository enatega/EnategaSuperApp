import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import Text from '../../../../general/components/Text';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import HomeVisitsSupportConversationItem from '../../components/support/HomeVisitsSupportConversationItem';
import { useSupportConversations } from '../../hooks/useSupportAdmins';
import type { HomeVisitsStackParamList } from '../../navigation/types';
import {
  getSupportChatAvatarLabel,
  getSupportChatAvatarTone,
  getSupportChatBoxId,
  getSupportChatConversationItems,
  getSupportChatDateLabel,
  getSupportChatLastMessageText,
  getSupportChatOtherParticipant,
  getSupportChatParticipantId,
  getSupportChatParticipantName,
} from '../../utils/supportChatMappers';

type HomeVisitsConversationItem = {
  agentName: string;
  avatarLabel: string;
  avatarTone: 'cardPeach' | 'cardBlue' | 'cardMint' | 'cardLavender' | 'primaryDark';
  chatBoxId: string;
  dateLabel: string;
  message: string;
  receiverId: string;
  unreadCount?: number;
};

export default function HomeVisitsSupportConversationsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();
  const sessionQuery = useAuthSessionQuery();
  const conversationsQuery = useSupportConversations();

  const conversations = useMemo<HomeVisitsConversationItem[]>(() => {
    const currentUserId = sessionQuery.data?.user?.id;

    return getSupportChatConversationItems(conversationsQuery.data).map((item, index) => {
      const participant = getSupportChatOtherParticipant(item, currentUserId);
      const agentName =
        getSupportChatParticipantName(participant) ||
        item.title ||
        t('home_visits_support_chat_agent_fallback');

      return {
        agentName,
        avatarLabel: getSupportChatAvatarLabel(agentName),
        avatarTone: getSupportChatAvatarTone(index),
        chatBoxId: getSupportChatBoxId(item),
        dateLabel: getSupportChatDateLabel(item),
        message:
          getSupportChatLastMessageText(item) ||
          t('home_visits_support_chat_empty_message'),
        receiverId: getSupportChatParticipantId(participant),
        unreadCount: item.unreadCount ?? item.unread_count,
      };
    });
  }, [conversationsQuery.data, sessionQuery.data?.user?.id, t]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('home_visits_support_back_action')}
        rightAccessibilityLabel={t('support_call_action')}
        title={t('home_visits_support_conversations_title')}
      />

      {conversationsQuery.isPending ? (
        <View style={styles.centerState}>
          <Text color={colors.mutedText}>{t('home_visits_support_conversations_loading')}</Text>
        </View>
      ) : conversationsQuery.isError ? (
        <View style={styles.centerState}>
          <Text color={colors.danger}>{conversationsQuery.error.message}</Text>
        </View>
      ) : conversations.length ? (
        <FlatList
          data={conversations}
          keyExtractor={(item, index) => item.chatBoxId || `${item.agentName}-${index}`}
          renderItem={({ item }) => (
            <HomeVisitsSupportConversationItem
              avatarLabel={item.avatarLabel}
              avatarTone={item.avatarTone}
              dateLabel={item.dateLabel}
              message={item.message}
              name={item.agentName}
              onPress={() =>
                navigation.navigate('SupportChat', {
                  agentName: item.agentName,
                  chatBoxId: item.chatBoxId,
                  receiverId: item.receiverId || undefined,
                })
              }
              unreadCount={item.unreadCount}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      ) : (
        <View style={styles.centerState}>
          <Text color={colors.mutedText}>{t('home_visits_support_conversations_empty')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  list: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
