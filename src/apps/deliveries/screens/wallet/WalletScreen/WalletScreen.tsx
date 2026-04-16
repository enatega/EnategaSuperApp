import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useDeliveriesCurrencyLabel } from '../../../../../general/stores/useAppConfigStore';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import WalletBalanceHeader from '../../../components/wallet/WalletBalanceHeader';
import SavedCardRow from '../../../components/wallet/SavedCardRow';
import AddCardRow from '../../../components/wallet/AddCardRow';
import WalletTransactionItem from '../../../components/wallet/WalletTransactionItem';
import {
  MOCK_WALLET_BALANCE,
  MOCK_SAVED_CARDS,
  MOCK_TRANSACTIONS,
  type WalletTransaction,
} from '../../../data/walletMockData';
import type { DeliveriesStackParamList } from '../../../navigation/types';

export default function WalletScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const currencyLabel = useDeliveriesCurrencyLabel();
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();

  const handleAddCard = useCallback(() => {
    navigation.navigate('AddCard');
  }, [navigation]);

  const handleSeeAll = useCallback(() => {
    navigation.navigate('WalletTransactions');
  }, [navigation]);

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
      <FlatList
        data={MOCK_TRANSACTIONS}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <WalletBalanceHeader
              balanceLabel={t('wallet_balance_label')}
              balance={MOCK_WALLET_BALANCE}
              currency={currencyLabel}
            />

            {/* Cards section */}
            <View style={styles.section}>
              <Text weight="bold" color={colors.text} style={styles.sectionTitle}>
                {t('wallet_cards_title')}
              </Text>
              {MOCK_SAVED_CARDS.map((card) => (
                <SavedCardRow
                  key={card.id}
                  brand={card.brand}
                  holderName={card.holderName}
                />
              ))}
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
