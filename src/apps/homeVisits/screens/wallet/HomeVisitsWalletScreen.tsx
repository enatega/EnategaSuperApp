import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import useProfile from '../../../../general/hooks/useProfile';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import {
  type WalletSavedCard,
  useWalletSavedCardsQuery,
  useWalletSetDefaultCardMutation,
  useWalletTransactionsQuery,
} from '../../../../general/api/walletSavedCardsService';
import WalletBalanceHeader from '../../components/wallet/WalletBalanceHeader';
import SavedCardRow from '../../components/wallet/SavedCardRow';
import AddCardRow from '../../components/wallet/AddCardRow';
import WalletTransactionItem from '../../components/wallet/WalletTransactionItem';
import type { HomeVisitsStackParamList } from '../../navigation/types';

export default function HomeVisitsWalletScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();
  const { wallet } = useProfile('home-services');
  const savedCardsQuery = useWalletSavedCardsQuery('home-services');
  const setDefaultCardMutation = useWalletSetDefaultCardMutation('home-services');
  const walletTransactionsQuery = useWalletTransactionsQuery('home-services', { offset: 0, limit: 10 });
  const savedCards = savedCardsQuery.data?.cards ?? [];
  const transactions = walletTransactionsQuery.data?.data ?? [];
  const [updatingCardId, setUpdatingCardId] = React.useState<string | null>(null);

  const handleAddCard = useCallback(() => {
    navigation.navigate('WalletAddCard');
  }, [navigation]);

  const handleSeeAll = useCallback(() => {
    navigation.navigate('WalletTransactions');
  }, [navigation]);

  const renderTransaction = useCallback(({ item }: { item: (typeof transactions)[number] }) => (
    <WalletTransactionItem
      iconType={item.type}
      title={item.title}
      subtitle={item.subtitle}
      time={item.time}
    />
  ), [transactions]);

  const keyExtractor = useCallback((item: (typeof transactions)[number]) => item.id, []);

  const handleSetDefaultCard = useCallback(
    async (cardId: string) => {
      setUpdatingCardId(cardId);
      try {
        await setDefaultCardMutation.mutateAsync(cardId);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('wallet_add_card_error');
        showToast.error(t('wallet_add_card_error'), message);
      } finally {
        setUpdatingCardId(null);
      }
    },
    [setDefaultCardMutation, t],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !walletTransactionsQuery.isPending ? (
            <View style={styles.emptyState}>
              <Text weight="bold" color={colors.text} style={styles.emptyStateTitle}>
                {t('wallet_transactions_empty_title')}
              </Text>
              <Text color={colors.mutedText} style={styles.emptyStateSubtitle}>
                {t('wallet_transactions_empty_description')}
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            <WalletBalanceHeader
              balanceLabel={t('wallet_balance_label')}
              balance={wallet?.wallet_balance ?? 0}
              currency="$"
            />

            <View style={styles.section}>
              <Text weight="bold" color={colors.text} style={styles.sectionTitle}>
                {t('wallet_cards_title')}
              </Text>
              {savedCards.map((card: WalletSavedCard) => (
                <View
                  key={card.id}
                  style={[
                    styles.cardRowWrap,
                    updatingCardId === card.id ? styles.cardRowWrapLoading : null,
                  ]}
                  pointerEvents={updatingCardId ? 'none' : 'auto'}
                >
                  <SavedCardRow
                    brand={card.brand}
                    holderName={card.name?.trim() || `${card.brand.toUpperCase()} Card`}
                    subtitle={`•••• •••• •••• ${card.last4}`}
                    secondarySubtitle={`${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`}
                    isDefault={card.isDefault}
                    onPress={() => {
                      if (!card.isDefault && !updatingCardId) {
                        void handleSetDefaultCard(card.id);
                      }
                    }}
                  />
                </View>
              ))}
              {!savedCardsQuery.isPending && savedCards.length === 0 ? (
                <Text color={colors.mutedText} style={styles.emptyCardsText}>
                  {t('wallet_no_saved_cards')}
                </Text>
              ) : null}
              <AddCardRow label={t('wallet_add_card')} onPress={handleAddCard} />
            </View>

            <View style={styles.transactionsHeader}>
              <Text weight="bold" color={colors.text} style={styles.sectionTitle}>
                {t('wallet_recent_transactions')}
              </Text>
              <Pressable
                onPress={handleSeeAll}
                style={({ pressed }) => [
                  styles.seeAllButton,
                  { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                ]}
                accessibilityRole="button"
              >
                <Text weight="medium" color={colors.text} style={styles.seeAllText}>
                  {t('wallet_see_all')}
                </Text>
              </Pressable>
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingBottom: 8,
    paddingTop: 20,
  },
  cardRowWrap: {
    opacity: 1,
  },
  cardRowWrapLoading: {
    opacity: 0.45,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  emptyCardsText: {
    fontSize: 14,
    lineHeight: 22,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  transactionsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  seeAllButton: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
