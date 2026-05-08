import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { showToast } from '../../../../../general/components/AppToast';
import useProfile from '../../../../../general/hooks/useProfile';
import { useDeliveriesCurrencyLabel } from '../../../../../general/stores/useAppConfigStore';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import {
  useWalletSavedCardsQuery,
  useWalletSetDefaultCardMutation,
  useWalletTransactionsQuery,
} from '../../../../../general/api/walletSavedCardsService';
import WalletBalanceHeader from '../../../components/wallet/WalletBalanceHeader';
import SavedCardRow from '../../../components/wallet/SavedCardRow';
import AddCardRow from '../../../components/wallet/AddCardRow';
import WalletTransactionItem from '../../../components/wallet/WalletTransactionItem';
import WalletTransactionsEmptyState from '../../../components/wallet/WalletTransactionsEmptyState';
import type { DeliveriesStackParamList } from '../../../navigation/types';

export default function WalletScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const currencyLabel = useDeliveriesCurrencyLabel();
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();
  const { wallet } = useProfile('deliveries');
  const savedCardsQuery = useWalletSavedCardsQuery('deliveries');
  const setDefaultCardMutation = useWalletSetDefaultCardMutation('deliveries');
  const walletTransactionsQuery = useWalletTransactionsQuery('deliveries', { offset: 0, limit: 10 });
  const savedCards = savedCardsQuery.data?.cards ?? [];
  const transactions = walletTransactionsQuery.data?.data ?? [];

  React.useEffect(() => {
    console.log('[Wallet][SavedCards][Response]', {
      count: savedCards.length,
      cards: savedCards.map((card) => ({
        id: card.id,
        name: card.name ?? null,
        brand: card.brand,
        last4: card.last4,
        expMonth: card.expMonth,
        expYear: card.expYear,
        isDefault: card.isDefault,
      })),
    });
  }, [savedCards]);

  const handleAddCard = useCallback(() => {
    navigation.navigate('AddCard');
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
  ), []);

  const keyExtractor = useCallback((item: (typeof transactions)[number]) => item.id, []);
  const handleSetDefaultCard = useCallback(
    async (cardId: string) => {
      try {
        await setDefaultCardMutation.mutateAsync(cardId);
      } catch (error) {
        const message = error instanceof Error ? error.message : t('wallet_add_card_error');
        showToast.error(t('wallet_add_card_error'), message);
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
          !walletTransactionsQuery.isPending ? <WalletTransactionsEmptyState compact /> : null
        }
        ListHeaderComponent={
          <>
            <WalletBalanceHeader
              balanceLabel={t('wallet_balance_label')}
              balance={wallet?.wallet_balance ?? 0}
              currency={currencyLabel}
            />

            {/* Cards section */}
            <View style={styles.section}>
              <Text weight="bold" color={colors.text} style={styles.sectionTitle}>
                {t('wallet_cards_title')}
              </Text>
              {savedCards.map((card) => (
                <SavedCardRow
                  key={card.id}
                  brand={card.brand}
                  holderName={card.name?.trim() || `${card.brand.toUpperCase()} Card`}
                  subtitle={`•••• •••• •••• ${card.last4}`}
                  secondarySubtitle={`${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`}
                  isDefault={card.isDefault}
                  onPress={() => {
                    if (!card.isDefault) {
                      void handleSetDefaultCard(card.id);
                    }
                  }}
                />
              ))}
              {!savedCardsQuery.isPending && savedCards.length === 0 ? (
                <Text color={colors.mutedText} style={styles.emptyCardsText}>
                  {t('wallet_no_saved_cards')}
                </Text>
              ) : null}
              <AddCardRow
                label={t('wallet_add_card')}
                onPress={handleAddCard}
              />
            </View>

            {/* Transactions header */}
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
    paddingTop: 20,
    paddingBottom: 8,
  },
  emptyCardsText: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 26,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  transactionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  seeAllButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
