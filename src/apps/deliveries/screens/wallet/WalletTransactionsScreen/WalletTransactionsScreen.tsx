import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../../general/theme/theme';
import WalletTransactionItem from '../../../components/wallet/WalletTransactionItem';
import { MOCK_TRANSACTIONS, type WalletTransaction } from '../../../data/walletMockData';

export default function WalletTransactionsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  const renderTransaction = useCallback(({ item }: { item: WalletTransaction }) => (
    <WalletTransactionItem
      iconType={item.iconType}
      title={item.title}
      subtitle={item.subtitle}
      time={item.time}
    />
  ), []);

  const keyExtractor = useCallback((item: WalletTransaction) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('wallet_recent_transactions')} />
      <FlatList
        data={MOCK_TRANSACTIONS}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
