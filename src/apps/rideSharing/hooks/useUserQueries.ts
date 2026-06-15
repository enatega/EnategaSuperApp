import {
    useInfiniteQuery,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import { userKeys } from '../api/queryKeys';

import {
    userService,
    type UserNotificationsResponse,
    type WalletBalanceResponse,
    type WalletTransactionHistoryFilter,
    type WalletTransactionHistoryResponse,
} from '../api/userService';
import type { UserApiData } from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

// ---------------------------------------------------------------------------
// useUser – current authenticated user's profile
//  • staleTime 5 min (profile rarely changes mid-session)
// ---------------------------------------------------------------------------

type UseUserOptions = Omit<
    UseQueryOptions<UserApiData, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useUser(options?: UseUserOptions) {
    return useQuery<UserApiData, ApiError>({
        queryKey: userKeys.profile(),
        queryFn: () => userService.getUser(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options,
    });
}

type UseWalletBalanceOptions = Omit<
    UseQueryOptions<WalletBalanceResponse, ApiError>,
    'queryKey' | 'queryFn'
>;

export function useWalletBalance(options?: UseWalletBalanceOptions) {
    return useQuery<WalletBalanceResponse, ApiError>({
        queryKey: userKeys.walletBalance(),
        queryFn: () => userService.getWalletBalance(),
        staleTime: 60 * 1000,
        ...options,
    });
}

const DEFAULT_WALLET_TRANSACTIONS_LIMIT = 10;

export function useWalletTransactions(
    filter?: WalletTransactionHistoryFilter,
    limit = DEFAULT_WALLET_TRANSACTIONS_LIMIT,
) {
    return useInfiniteQuery<WalletTransactionHistoryResponse, ApiError>({
        queryKey: userKeys.walletTransactions(filter ?? 'all', limit),
        queryFn: ({ pageParam = 1 }) =>
            userService.getWalletTransactions({
                filter,
                offset: pageParam as number,
                limit,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.isEnd) {
                return undefined;
            }

            const currentOffset = lastPage.offset ?? 0;
            const currentLimit = lastPage.limit ?? limit;
            const currentPageSize = lastPage.data?.length ?? 0;
            const nextOffset = currentOffset + 1;

            if (typeof lastPage.total === 'number') {
                return currentOffset * currentLimit < lastPage.total ? nextOffset : undefined;
            }

            return currentPageSize >= currentLimit ? nextOffset : undefined;
        },
        staleTime: 60 * 1000,
    });
}

const DEFAULT_NOTIFICATIONS_LIMIT = 10;

export function useTodayNotifications(
    userId: string | null | undefined,
) {
    return useInfiniteQuery<UserNotificationsResponse, ApiError>({
        queryKey: userKeys.notificationsToday(userId ?? 'unknown-user', DEFAULT_NOTIFICATIONS_LIMIT),
        queryFn: ({ pageParam = 0 }) =>
            userService.getTodayNotifications(userId!, {
                offset: pageParam as number,
                limit: DEFAULT_NOTIFICATIONS_LIMIT,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
        enabled: Boolean(userId),
        staleTime: 60 * 1000,
    });
}

export function usePastNotifications(
    userId: string | null | undefined,
) {
    return useInfiniteQuery<UserNotificationsResponse, ApiError>({
        queryKey: userKeys.notificationsPast(userId ?? 'unknown-user', DEFAULT_NOTIFICATIONS_LIMIT),
        queryFn: ({ pageParam = 0 }) =>
            userService.getPastNotifications(userId!, {
                offset: pageParam as number,
                limit: DEFAULT_NOTIFICATIONS_LIMIT,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
        enabled: Boolean(userId),
        staleTime: 60 * 1000,
    });
}
