import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SupportConversationSectionTitle from '../../../deliveries/components/support/SupportConversationSectionTitle';
import SupportConversationsSkeleton from '../../../deliveries/components/support/SupportConversationsSkeleton';
import SupportSwipeableConversationItem from '../../../deliveries/components/support/SupportSwipeableConversationItem';
import { appointmentSupportService } from '../../api/supportService';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import type { AppointmentsStackParamList } from '../../navigation/types';

type Props = { title?: string };

export default function AppointmentsSupportConversationsScreen({ title = 'My conversations' }: Props) {
  const { colors, typography } = useTheme();
  const navigation = useNavigation<NavigationProp<AppointmentsStackParamList>>();
  const session = useAuthSessionQuery();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const query = useQuery({ queryKey: ['appointments', 'support', 'conversations'], queryFn: appointmentSupportService.getConversations });
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const conversations = (query.data ?? []).filter((item) => {
    if (!normalizedQuery) return true;
    return `${item.title ?? ''} ${item.latestMessage ?? ''}`.toLowerCase().includes(normalizedQuery);
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel="Go back"
        onRightPress={() => {
          setIsSearchOpen((current) => !current);
          if (isSearchOpen) setSearchQuery('');
        }}
        rightAccessibilityLabel="Search conversations"
        rightIconName={isSearchOpen ? 'close-outline' : 'search-outline'}
        title={title}
      />
      {isSearchOpen ? <View style={styles.searchContainer}><TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setSearchQuery} placeholder="Search conversations" placeholderTextColor={colors.mutedText} style={[styles.searchInput, { backgroundColor: colors.backgroundTertiary, color: colors.text, fontSize: typography.size.md }]} value={searchQuery} /></View> : null}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {query.isPending ? <SupportConversationsSkeleton /> : query.isError ? <View style={styles.centerState}><Text color={colors.danger}>{query.error.message}</Text></View> : conversations.length ? <><SupportConversationSectionTitle label="Recent" />{conversations.map((item, index) => {
          const otherParticipant = item.sender?.id === session.data?.user?.id ? item.receiver : item.sender;
          const name = otherParticipant?.name ?? item.title ?? 'Support team';
          const updatedAt = item.latestMessageAt ?? item.updatedAt;
          return <SupportSwipeableConversationItem key={item.id ?? item.chatBoxId ?? String(index)} avatarTone={index % 2 ? 'cardMint' : 'cardLavender'} avatarLabel={name.slice(0, 2).toUpperCase()} dateLabel={updatedAt ? new Date(updatedAt).toLocaleDateString() : ''} message={item.latestMessage ?? 'Support conversation'} name={name} onPress={() => navigation.navigate('SupportChat', { agentName: name, chatBoxId: item.id ?? item.chatBoxId, receiverId: otherParticipant?.id })} />;
        })}</> : <View style={styles.centerState}><Text color={colors.mutedText}>You have no support conversations yet.</Text></View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 }, scroll: { flex: 1 }, content: { flexGrow: 1, paddingBottom: 28 }, searchContainer: { paddingBottom: 8, paddingHorizontal: 16 }, searchInput: { borderRadius: 10, minHeight: 44, paddingHorizontal: 14 }, centerState: { alignItems: 'center', justifyContent: 'center', padding: 32 } });
