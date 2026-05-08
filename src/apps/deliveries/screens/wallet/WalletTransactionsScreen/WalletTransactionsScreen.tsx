import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../../general/theme/theme';
import WalletTransactionItem from '../../../components/wallet/WalletTransactionItem';
import WalletTransactionsEmptyState from '../../../components/wallet/WalletTransactionsEmptyState';
import { useWalletTransactionsQuery } from '../../../../../general/api/walletSavedCardsService';

export default function WalletTransactionsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const transactionsQuery = useWalletTransactionsQuery('deliveries', { offset: 0, limit: 50 });
  const transactions = transactionsQuery.data?.data ?? [];

  const renderTransaction = useCallback(({ item }: { item: (typeof transactions)[number] }) => (
    <WalletTransactionItem
      iconType={item.type}
      title={item.title}
      subtitle={item.subtitle}
      time={item.time}
    />
  ), []);

  const keyExtractor = useCallback((item: (typeof transactions)[number]) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('wallet_recent_transactions')} />
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!transactionsQuery.isPending ? <WalletTransactionsEmptyState /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
