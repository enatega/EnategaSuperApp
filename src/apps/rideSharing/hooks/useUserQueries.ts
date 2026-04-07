import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { userKeys } from '../api/queryKeys';

import { userService, type WalletBalanceResponse } from '../api/userService';
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
