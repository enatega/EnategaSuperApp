import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useWalletTransactionsQuery } from '../../../../general/api/walletSavedCardsService';
import WalletTransactionItem from '../../../deliveries/components/wallet/WalletTransactionItem';

export default function HomeVisitsWalletTransactionsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const walletTransactionsQuery = useWalletTransactionsQuery('home-services', { limit: 50, offset: 0 });
  const transactions = walletTransactionsQuery.data?.data ?? [];

  const renderItem = useCallback(({ item }: { item: (typeof transactions)[number] }) => (
    <WalletTransactionItem
      iconType={item.type}
      title={item.title}
      subtitle={item.subtitle}
      time={item.time}
    />
  ), [transactions]);

  const keyExtractor = useCallback((item: (typeof transactions)[number]) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('wallet_recent_transactions')} />
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!walletTransactionsQuery.isPending ? (
          <View style={styles.emptyState}>
            <Text weight="bold" color={colors.text} style={styles.emptyStateTitle}>
              {t('wallet_transactions_empty_title')}
            </Text>
            <Text color={colors.mutedText} style={styles.emptyStateSubtitle}>
              {t('wallet_transactions_empty_description')}
            </Text>
          </View>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  emptyStateTitle: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
});
