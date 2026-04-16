import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useRideSharingCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import BalanceCard from '../../components/wallet/BalanceCard';
import TransactionFilterTabs from '../../components/wallet/TransactionFilterTabs';
import TransactionItem from '../../components/wallet/TransactionItem';
import { MOCK_TRANSACTIONS } from '../../data/walletMockData';
import type { TransactionFilter, Transaction } from '../../types/wallet';
import { useWalletBalance } from '../../hooks/useUserQueries';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

export default function WalletHomeScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const currencyLabel = useRideSharingCurrencyLabel();
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>('all');
  const walletBalanceQuery = useWalletBalance();

  const tabs = useMemo(() => [
    { key: 'all' as const, label: t('wallet_tab_all') },
    { key: 'money_in' as const, label: t('wallet_tab_money_in') },
    { key: 'money_out' as const, label: t('wallet_tab_money_out') },
  ], [t]);

  const walletBalance = useMemo(() => {
    const parsedAmount = Number(walletBalanceQuery.data?.totalBalanceInWallet);

    return {
      amount: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      currency: currencyLabel,
    };
  }, [currencyLabel, walletBalanceQuery.data?.totalBalanceInWallet]);

  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'money_in') {
      return MOCK_TRANSACTIONS.filter((txn) => txn.isCredit);
    }
    if (activeFilter === 'money_out') {
      return MOCK_TRANSACTIONS.filter((txn) => !txn.isCredit);
    }
    return MOCK_TRANSACTIONS;
  }, [activeFilter]);

  const handleAddFunds = useCallback(() => {
    navigation.navigate('WalletAddFunds');
  }, [navigation]);

  const renderTransaction = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} />
  ), []);

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('wallet_title')} />

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.titleSection}>
              <Text
                variant="title"
                weight="bold"
                color={colors.text}
                style={{ fontSize: 32, lineHeight: 38, letterSpacing: -0.48 }}
              >
                {t('wallet_title')}
              </Text>
              <Text variant="caption" weight="medium" color={colors.mutedText}>
                {t('wallet_subtitle')}
              </Text>
            </View>

            <View style={styles.balanceSection}>
              <BalanceCard
                balance={walletBalance}
                balanceLabel={t('wallet_your_balance')}
                addFundsLabel={t('wallet_add_funds')}
                onAddFunds={handleAddFunds}
              />
            </View>

            <View style={styles.transactionsHeader}>
              <Text
                variant="subtitle"
                weight="bold"
                color={colors.text}
                style={{ fontSize: typography.size.h5, lineHeight: typography.lineHeight.h5, letterSpacing: -0.36 }}
              >
                {t('wallet_transactions')}
              </Text>
            </View>

            <TransactionFilterTabs
              tabs={tabs}
              activeTab={activeFilter}
              onTabChange={setActiveFilter}
            />
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
  titleSection: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  balanceSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  transactionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
