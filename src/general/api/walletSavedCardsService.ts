import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';
import type { ProfileAppPrefix } from './profileService';

export type WalletSavedCard = {
  id: string;
  name?: string | null;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export type WalletSavedCardsResponse = {
  stripeCustomerId: string;
  cards: WalletSavedCard[];
};

export type WalletSetupIntentResponse = {
  setupIntentId: string;
  clientSecret: string;
  stripeCustomerId: string;
};

export type WalletSetDefaultCardResponse = {
  message: string;
};

export type WalletTransactionType = 'cashback' | 'booking' | 'refund';

export type WalletTransaction = {
  id: string;
  type: WalletTransactionType;
  title: string;
  subtitle: string;
  time: string;
};

export type WalletTransactionsResponse = {
  data: WalletTransaction[];
  total?: number;
  offset?: number;
  limit?: number;
};

type WalletTransactionApiItem = {
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  message?: string;
  createdAt?: string;
  created_at?: string;
};

function normalizeWalletTransactionType(value?: string): WalletTransactionType {
  const normalized = value?.toLowerCase();
  if (normalized === 'refund') return 'refund';
  if (normalized === 'cashback') return 'cashback';
  return 'booking';
}

function mapWalletTransaction(item: WalletTransactionApiItem, index: number): WalletTransaction {
  return {
    id: item.id ?? `wallet_txn_${index}`,
    type: normalizeWalletTransactionType(item.type),
    title: item.title ?? item.message ?? 'Transaction',
    subtitle: item.subtitle ?? item.description ?? '',
    time: item.createdAt ?? item.created_at ?? '',
  };
}

function getWalletSavedCardsBase(appPrefix: ProfileAppPrefix) {
  return `/api/v1/apps/${appPrefix}/wallet/saved-cards`;
}

export const walletSavedCardsService = {
  listSavedCards: (appPrefix: ProfileAppPrefix) =>
    apiClient.get<WalletSavedCardsResponse>(getWalletSavedCardsBase(appPrefix)),

  createSetupIntent: (appPrefix: ProfileAppPrefix) =>
    apiClient.post<WalletSetupIntentResponse>(
      `${getWalletSavedCardsBase(appPrefix)}/setup-intent`,
      {},
    ),

  setDefaultSavedCard: (appPrefix: ProfileAppPrefix, paymentMethodId: string) =>
    apiClient.patch<WalletSetDefaultCardResponse>(
      `${getWalletSavedCardsBase(appPrefix)}/${paymentMethodId}/default`,
      {},
    ),

  listTransactions: (
    appPrefix: ProfileAppPrefix,
    input: { offset?: number; limit?: number } = {},
  ) =>
    apiClient.get<{
      data?: WalletTransactionApiItem[];
      total?: number;
      offset?: number;
      limit?: number;
    }>(`/api/v1/apps/${appPrefix}/wallet/transaction-history`, input).then((response) => ({
      data: (response.data ?? []).map(mapWalletTransaction),
      total: response.total,
      offset: response.offset,
      limit: response.limit,
    })),
};

export const walletSavedCardsKeys = {
  all: ['wallet-saved-cards'] as const,
  byApp: (appPrefix: ProfileAppPrefix) =>
    [...walletSavedCardsKeys.all, appPrefix] as const,
  transactionsByApp: (
    appPrefix: ProfileAppPrefix,
    input: { offset?: number; limit?: number } = {},
  ) =>
    [...walletSavedCardsKeys.all, appPrefix, 'transactions', input.offset ?? 0, input.limit ?? 20] as const,
};

export function useWalletSavedCardsQuery(appPrefix: ProfileAppPrefix) {
  return useQuery({
    queryKey: walletSavedCardsKeys.byApp(appPrefix),
    queryFn: () => walletSavedCardsService.listSavedCards(appPrefix),
    staleTime: 60 * 1000,
  });
}

export function useWalletSetupIntentMutation(appPrefix: ProfileAppPrefix) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => walletSavedCardsService.createSetupIntent(appPrefix),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: walletSavedCardsKeys.byApp(appPrefix) });
    },
  });
}

export function useWalletSetDefaultCardMutation(appPrefix: ProfileAppPrefix) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      walletSavedCardsService.setDefaultSavedCard(appPrefix, paymentMethodId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: walletSavedCardsKeys.byApp(appPrefix) });
    },
  });
}

export function useWalletTransactionsQuery(
  appPrefix: ProfileAppPrefix,
  input: { offset?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: walletSavedCardsKeys.transactionsByApp(appPrefix, input),
    queryFn: () => walletSavedCardsService.listTransactions(appPrefix, input),
    staleTime: 60 * 1000,
  });
}
