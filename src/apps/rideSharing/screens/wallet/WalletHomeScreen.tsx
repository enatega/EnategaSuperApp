import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useRideSharingCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import BalanceCard from '../../components/wallet/BalanceCard';
import TransactionFilterTabs from '../../components/wallet/TransactionFilterTabs';
import TransactionItem from '../../components/wallet/TransactionItem';
import type { TransactionFilter, Transaction } from '../../types/wallet';
import { useWalletBalance, useWalletTransactions } from '../../hooks/useUserQueries';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import Skeleton from '../../../../general/components/Skeleton';

function formatWalletTransactionDate(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${month} ${day}. ${time}`;
}

function mapApiTypeToTransactionType(value?: string): Transaction['type'] {
  const normalized = value?.toLowerCase() ?? '';

  if (normalized.includes('deposit') || normalized.includes('refund') || normalized.includes('cashback')) {
    return 'topup';
  }

  if (normalized.includes('courier')) {
    return 'courier';
  }

  if (normalized.includes('women')) {
    return 'women_ride';
  }

  if (normalized.includes('premium')) {
    return 'premium_ride';
  }

  return 'ride';
}

export default function WalletHomeScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const currencyLabel = useRideSharingCurrencyLabel();
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>('all');
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const canLoadMoreRef = useRef(false);
  const walletBalanceQuery = useWalletBalance();
  const transactionApiFilter = useMemo(() => {
    if (activeFilter === 'money_in') {
      return 'deposit' as const;
    }

    if (activeFilter === 'money_out') {
      return 'booking' as const;
    }

    return undefined;
  }, [activeFilter]);
  const walletTransactionsQuery = useWalletTransactions(transactionApiFilter);

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

  const transactions = useMemo<Transaction[]>(
    () =>
      (walletTransactionsQuery.data?.pages ?? []).flatMap((page) =>
        (page.data ?? []).map((item) => {
          const normalizedType = item.type?.toLowerCase() ?? '';
          const isCredit =
            normalizedType.includes('deposit') ||
            normalizedType.includes('refund') ||
            normalizedType.includes('cashback');

          return {
            id: item.id ?? '',
            type: mapApiTypeToTransactionType(item.type),
            title: item.title ?? item.message ?? t('wallet_transaction_default_title'),
            date: formatWalletTransactionDate(item.createdAt ?? item.created_at),
            amount: typeof item.amount === 'number' ? item.amount : 0,
            isCredit,
          };
        }),
      ),
    [t, walletTransactionsQuery.data?.pages],
  );
  const isBalanceInitialLoading = walletBalanceQuery.isLoading && !walletBalanceQuery.data;
  const isTransactionsInitialLoading = walletTransactionsQuery.isLoading && transactions.length === 0;
  const hasNoTransactions = !isTransactionsInitialLoading && transactions.length === 0;
  const isRefreshing = isManualRefreshing;

  useEffect(() => {
    if (!walletTransactionsQuery.isLoading) {
      console.log('[WalletHomeScreen] Transactions state', {
        activeFilter,
        apiFilter: transactionApiFilter ?? 'all',
        pageCount: walletTransactionsQuery.data?.pages.length ?? 0,
        itemCount: transactions.length,
        hasNoTransactions,
        hasNextPage: walletTransactionsQuery.hasNextPage ?? false,
      });
    }
  }, [
    activeFilter,
    hasNoTransactions,
    transactionApiFilter,
    transactions.length,
    walletTransactionsQuery.data?.pages.length,
    walletTransactionsQuery.hasNextPage,
    walletTransactionsQuery.isLoading,
  ]);

  const handleAddFunds = useCallback(() => {
    navigation.push('WalletAddFunds');
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    if (isManualRefreshing) {
      return;
    }

    console.log('[WalletHomeScreen] Manual refresh started', {
      activeFilter,
      apiFilter: transactionApiFilter ?? 'all',
    });

    setIsManualRefreshing(true);

    try {
      await Promise.all([
        walletBalanceQuery.refetch(),
        walletTransactionsQuery.refetch(),
      ]);
    } finally {
      setIsManualRefreshing(false);
      console.log('[WalletHomeScreen] Manual refresh finished');
    }
  }, [
    activeFilter,
    isManualRefreshing,
    transactionApiFilter,
    walletBalanceQuery,
    walletTransactionsQuery,
  ]);

  const handleLoadMore = useCallback(() => {
    console.log('[WalletHomeScreen] onEndReached', {
      canLoadMore: canLoadMoreRef.current,
      isTransactionsInitialLoading,
      itemCount: transactions.length,
      hasNextPage: walletTransactionsQuery.hasNextPage ?? false,
      isFetchingNextPage: walletTransactionsQuery.isFetchingNextPage,
    });

    if (
      canLoadMoreRef.current &&
      !isTransactionsInitialLoading &&
      transactions.length > 0 &&
      walletTransactionsQuery.hasNextPage &&
      !walletTransactionsQuery.isFetchingNextPage
    ) {
      canLoadMoreRef.current = false;
      void walletTransactionsQuery.fetchNextPage();
    }
  }, [isTransactionsInitialLoading, transactions.length, walletTransactionsQuery]);

  const renderTransaction = useCallback(({ item }: { item: Transaction }) => (
    <TransactionItem transaction={item} />
  ), []);

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('wallet_title')}
        rightSlot={(
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('wallet_refresh')}
            disabled={isRefreshing}
            hitSlop={8}
            onPress={() => {
              void handleRefresh();
            }}
            style={({ pressed }) => [
              styles.refreshButton,
              {
                backgroundColor: colors.backgroundTertiary,
                opacity: isRefreshing ? 0.6 : pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              color={colors.text}
              name="refresh"
              size={20}
            />
          </Pressable>
        )}
      />

      <FlatList
        data={transactions}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 24 }}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={() => {
          canLoadMoreRef.current = true;
        }}
        onScrollBeginDrag={() => {
          canLoadMoreRef.current = true;
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          !isTransactionsInitialLoading && walletTransactionsQuery.isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
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
                isLoading={isBalanceInitialLoading}
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
        ListEmptyComponent={
          isTransactionsInitialLoading ? (
            <View style={styles.emptyState}>
              <Skeleton width="100%" height={72} style={styles.transactionSkeleton} />
              <Skeleton width="100%" height={72} style={styles.transactionSkeleton} />
              <Skeleton width="100%" height={72} style={styles.transactionSkeleton} />
            </View>
          ) : hasNoTransactions ? (
            <View style={styles.emptyStateCard}>
              <View style={[styles.emptyStateIcon, { backgroundColor: colors.surfaceSoft }]}>
                <Ionicons name="receipt-outline" size={24} color={colors.mutedText} />
              </View>
              <Text
                variant="subtitle"
                weight="bold"
                color={colors.text}
                style={{ textAlign: 'center' }}
              >
                {t('wallet_transactions_empty_title')}
              </Text>
              <Text
                variant="caption"
                weight="medium"
                color={colors.mutedText}
                style={styles.emptyStateText}
              >
                {t('wallet_transactions_empty_subtitle')}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyStateCard: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  emptyStateIcon: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  emptyStateText: {
    textAlign: 'center',
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 16,
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
  refreshButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  transactionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  transactionSkeleton: {
    borderRadius: 12,
  },
});
