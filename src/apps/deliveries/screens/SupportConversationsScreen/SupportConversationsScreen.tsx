import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import SupportDeleteConversationModal from '../../components/support/SupportDeleteConversationModal';
import SupportConversationsSkeleton from '../../components/support/SupportConversationsSkeleton';
import SupportConversationSectionTitle from '../../components/support/SupportConversationSectionTitle';
import SupportHeader from '../../components/support/SupportHeader';
import SupportSwipeableConversationItem from '../../components/support/SupportSwipeableConversationItem';
import { useSupportConversations } from '../../hooks/useSupportChatQueries';
import { SupportHomeNavigationProp } from '../../navigation/supportNavigationTypes';
import {
  formatSupportChatDateLabel,
  getSupportChatAvatarLabel,
  getSupportChatAvatarTone,
  getSupportChatBoxId,
  getSupportChatConversationGroups,
  getSupportChatLastMessageText,
  getSupportChatOtherParticipant,
  getSupportChatParticipantId,
  getSupportChatParticipantName,
} from '../../utils/supportChatMappers';

export default function SupportConversationsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<SupportHomeNavigationProp>();
  const sessionQuery = useAuthSessionQuery();
  const supportChatBoxesQuery = useSupportConversations();
  const [deletedConversationIds, setDeletedConversationIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<{
    agentName: string;
    chatBoxId: string;
    name: string;
    section: 'recent' | 'past';
  } | null>(null);
  const conversationGroups = useMemo(() => {
    const currentUserId = sessionQuery.data?.user?.id;
    const rawGroups = getSupportChatConversationGroups(supportChatBoxesQuery.data);
    const deletedIds = new Set(deletedConversationIds);

    const mapItems = (items: typeof rawGroups.recent) =>
      items
        .filter((item) => !deletedIds.has(getSupportChatBoxId(item)))
        .map((item, index) => {
          const participant = getSupportChatOtherParticipant(item, currentUserId);
          const agentName =
            getSupportChatParticipantName(participant) || item.title || t('support_chat_agent_name');

          return {
            agentName,
            avatarLabel: getSupportChatAvatarLabel(agentName),
            avatarTone: getSupportChatAvatarTone(index),
            chatBoxId: getSupportChatBoxId(item),
            dateLabel: formatSupportChatDateLabel(item.updatedAt ?? item.updated_at ?? item.createdAt ?? item.created_at),
            message: getSupportChatLastMessageText(item) || t('support_chat_empty_message'),
            receiverId: getSupportChatParticipantId(participant),
            unreadCount: item.unreadCount ?? item.unread_count,
          };
        });

    return {
      past: mapItems(rawGroups.past),
      recent: mapItems(rawGroups.recent),
    };
  }, [deletedConversationIds, sessionQuery.data?.user?.id, supportChatBoxesQuery.data, t]);

  const handleRequestDelete = (
    chatBoxId: string,
    name: string,
    section: 'recent' | 'past',
    agentName: string,
  ) => {
    setPendingDelete({ agentName, chatBoxId, name, section });
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) {
      return;
    }

    setDeletedConversationIds((current) => [...current, pendingDelete.chatBoxId]);
    setPendingDelete(null);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        title={t('support_conversations_title')}
        rightAccessibilityLabel={t('support_search_action')}
        rightIconName="search-outline"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {supportChatBoxesQuery.isPending ? (
          <SupportConversationsSkeleton />
        ) : supportChatBoxesQuery.isError ? (
          <View style={styles.centerState}>
            <Text color={colors.danger}>{supportChatBoxesQuery.error.message}</Text>
          </View>
        ) : (
          <>
            {conversationGroups.recent.length ? (
              <>
                <SupportConversationSectionTitle label={t('support_conversations_recent')} />
                {conversationGroups.recent.map((conversation) => (
                  <SupportSwipeableConversationItem
                    key={conversation.chatBoxId}
                    avatarTone={conversation.avatarTone}
                    avatarLabel={conversation.avatarLabel}
                    dateLabel={conversation.dateLabel}
                    message={conversation.message}
                    name={conversation.agentName}
                    onPress={() =>
                      navigation.navigate('SupportChat', {
                        agentName: conversation.agentName,
                        chatBoxId: conversation.chatBoxId,
                        receiverId: conversation.receiverId || undefined,
                      })
                    }
                    onDelete={() =>
                      handleRequestDelete(
                        conversation.chatBoxId,
                        conversation.agentName,
                        'recent',
                        conversation.agentName,
                      )
                    }
                    unreadCount={conversation.unreadCount}
                  />
                ))}
              </>
            ) : null}

            {conversationGroups.past.length ? (
              <>
                <SupportConversationSectionTitle label={t('support_conversations_past')} />
                {conversationGroups.past.map((conversation) => (
                  <SupportSwipeableConversationItem
                    key={conversation.chatBoxId}
                    avatarTone={conversation.avatarTone}
                    avatarLabel={conversation.avatarLabel}
                    dateLabel={conversation.dateLabel}
                    message={conversation.message}
                    name={conversation.agentName}
                    onPress={() =>
                      navigation.navigate('SupportChat', {
                        agentName: conversation.agentName,
                        chatBoxId: conversation.chatBoxId,
                        receiverId: conversation.receiverId || undefined,
                      })
                    }
                    onDelete={() =>
                      handleRequestDelete(
                        conversation.chatBoxId,
                        conversation.agentName,
                        'past',
                        conversation.agentName,
                      )
                    }
                  />
                ))}
              </>
            ) : null}

            {!conversationGroups.recent.length && !conversationGroups.past.length ? (
              <View style={styles.centerState}>
                <Text color={colors.mutedText}>{t('support_conversations_empty')}</Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <SupportDeleteConversationModal
        conversationName={pendingDelete?.name ?? ''}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        visible={Boolean(pendingDelete)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  content: {
    paddingBottom: 28,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
