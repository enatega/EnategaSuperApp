import apiClient, { ApiError, tokenManager } from '../../../general/api/apiClient';
import { apiConfig } from '../../../general/config/apiConfig';
import type { ProfileAppPrefix } from '../../../general/api/profileService';
import type { UserApiData, UserApiResponse } from './types';

// ---------------------------------------------------------------------------
// User Service – all HTTP calls for /api/v1/users live here
// ---------------------------------------------------------------------------

export type UpdateUserPayload = {
    name?: string;
    profile?: string;
};

export type UpdateProfileImagePayload = {
    /** Local file URI from expo-image-picker (e.g. file:///...) */
    uri: string;
    /** MIME type, e.g. "image/jpeg" */
    mimeType?: string;
    /** Original filename */
    fileName?: string;
};

export type UpdatePasswordPayload = {
    previous_password: string;
    new_password: string;
};

export type WalletBalanceResponse = {
    totalBalanceInWallet: string;
};

export type WalletTopUpPayload = {
    amount: number;
    currency: string;
    paymentMethodId: string;
};

export type WalletTopUpResponse = {
    message: string;
    paymentIntentId: string;
    status: string;
    type: string;
    stripeCustomerId?: string;
};

export type WalletTransactionHistoryFilter = 'deposit' | 'booking';

type WalletTransactionHistoryApiItem = {
    id?: string;
    type?: string;
    status?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    message?: string;
    amount?: number | string;
    transactionAmount?: number | string;
    paymentAmount?: number | string;
    value?: number | string;
    createdAt?: string;
    created_at?: string;
};

export type WalletTransactionHistoryResponse = {
    data: WalletTransactionHistoryApiItem[];
    total?: number;
    offset?: number;
    limit?: number;
    isEnd?: boolean;
};

type WalletTransactionHistoryApiResponse = {
    data?: WalletTransactionHistoryApiItem[];
    transactions?: WalletTransactionHistoryApiItem[];
    total?: number;
    offset?: number;
    limit?: number;
    isEnd?: boolean;
};

export type UserNotificationsQueryParams = {
    offset?: number;
    limit?: number;
    search?: string;
};

export type UserNotificationItem = {
    id: string;
    title: string;
    description: string;
    createdAt: string;
};

export type UserNotificationsResponse = {
    items: UserNotificationItem[];
    offset: number;
    limit: number;
    total: number;
    isEnd: boolean;
    nextOffset: number | null;
};

function buildApiUrl(path: string) {
    const normalizedBaseUrl = apiConfig.baseUrl.replace(/\/+$/, '');
    return `${normalizedBaseUrl}${path}`;
}

function readNumber(...values: unknown[]) {
    for (const value of values) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === 'string') {
            const parsedValue = Number.parseFloat(value);
            if (Number.isFinite(parsedValue)) {
                return parsedValue;
            }
        }
    }

    return 0;
}

export const userService = {
    // ── Queries ───────────────────────────────────────────────────────────

    /** Fetch the current authenticated user's profile. */
    getUser: async (): Promise<UserApiData> => {
        const response = await apiClient.get<UserApiResponse>('api/v1/users');
        return response.user;
    },

    /** Fetch the current authenticated customer's wallet balance. */
    getWalletBalance: async (): Promise<WalletBalanceResponse> =>
        apiClient.get<WalletBalanceResponse>('/api/v1/apps/ride-hailing/wallet/balance/customer'),

    /** Fetch customer wallet transaction history. */
    getWalletTransactions: async (input: {
        filter?: WalletTransactionHistoryFilter;
        offset?: number;
        limit?: number;
    }): Promise<WalletTransactionHistoryResponse> =>
        apiClient.get<WalletTransactionHistoryApiResponse>(
            '/api/v1/apps/ride-hailing/wallet/transaction-history/customer',
            {
                filter: input.filter,
                offset: input.offset ?? 1,
                limit: input.limit ?? 10,
            },
        ).then((response) => {
            const sourceTransactions = response.transactions ?? response.data ?? [];
            const normalizedResponse = {
                data: sourceTransactions.map((item, index) => ({
                    ...item,
                    id: item.id ?? `wallet_transaction_${input.offset ?? 1}_${index}`,
                    amount: readNumber(
                        item.amount,
                        item.transactionAmount,
                        item.paymentAmount,
                        item.value,
                    ),
                })),
                total: response.total,
                offset: response.offset ?? input.offset ?? 1,
                limit: response.limit ?? input.limit ?? 10,
                isEnd: response.isEnd,
            };

            console.log('[userService.getWalletTransactions] Response', {
                filter: input.filter ?? 'all',
                requestedOffset: input.offset ?? 1,
                requestedLimit: input.limit ?? 10,
                responseKeys: Object.keys(response),
                receivedCount: normalizedResponse.data.length,
                total: normalizedResponse.total,
                offset: normalizedResponse.offset,
                limit: normalizedResponse.limit,
                isEnd: normalizedResponse.isEnd,
            });

            return normalizedResponse;
        }),

    /** Charge a saved card for wallet top-up. */
    topUpWallet: async (
        appPrefix: ProfileAppPrefix,
        payload: WalletTopUpPayload,
    ): Promise<WalletTopUpResponse> => {
        const path = `/api/v1/apps/${appPrefix}/wallet/topup`;
        const token = await tokenManager.getToken();

        console.log('[userService.topUpWallet] Request', {
            appPrefix,
            url: buildApiUrl(path),
            hasAuthToken: Boolean(token),
            payload,
        });

        try {
            const response = await apiClient.post<WalletTopUpResponse>(path, payload);
            console.log('[userService.topUpWallet] Response', response);
            return response;
        } catch (error) {
            if (error instanceof ApiError) {
                console.error('[userService.topUpWallet] ApiError', {
                    appPrefix,
                    url: buildApiUrl(path),
                    status: error.status,
                    message: error.message,
                    code: error.code,
                    data: error.data,
                    payload,
                });
            } else {
                console.error('[userService.topUpWallet] Unknown error', {
                    appPrefix,
                    url: buildApiUrl(path),
                    payload,
                    error,
                });
            }

            throw error;
        }
    },

    /** Fetch today's notifications for a ride-hailing user. */
    getTodayNotifications: async (
        userId: string,
        params?: UserNotificationsQueryParams,
    ): Promise<UserNotificationsResponse> => {
        const response = await apiClient.get<UserNotificationsResponse>(
            `/users-notifications/user/today/${userId}`,
            params,
        );
        console.log('[userService.getTodayNotifications] response:', {
            userId,
            params,
            count: response.items?.length ?? 0,
            total: response.total,
            offset: response.offset,
            nextOffset: response.nextOffset,
        });
        return response;
    },

    /** Fetch past notifications for a ride-hailing user. */
    getPastNotifications: async (
        userId: string,
        params?: UserNotificationsQueryParams,
    ): Promise<UserNotificationsResponse> => {
        const response = await apiClient.get<UserNotificationsResponse>(
            `/users-notifications/user/past/${userId}`,
            params,
        );
        console.log('[userService.getPastNotifications] response:', {
            userId,
            params,
            count: response.items?.length ?? 0,
            total: response.total,
            offset: response.offset,
            nextOffset: response.nextOffset,
        });
        return response;
    },

    // ── Mutations ─────────────────────────────────────────────────────────

    /** Update the current authenticated user's text fields (e.g. name). */
    updateUser: async (payload: UpdateUserPayload): Promise<UserApiData> => {
        const response = await apiClient.patch<UserApiResponse>('api/v1/users', payload);
        return response.user;
    },

    /** Upload a new profile image via multipart/form-data PATCH. */
    updateProfileImage: async (payload: UpdateProfileImagePayload): Promise<UserApiData> => {
        const form = new FormData();

        // React Native's FormData accepts this object shape for file uploads
        form.append('profile', {
            uri: payload.uri,
            type: payload.mimeType ?? 'image/jpeg',
            name: payload.fileName ?? 'profile.jpg',
        } as unknown as Blob);

        const response = await apiClient.patch<UserApiResponse>(
            'api/v1/users',
            form,
            // Override Content-Type so Axios sets the correct multipart boundary
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.user;
    },

    /** Update the current authenticated user's password. */
    updatePassword: async (payload: UpdatePasswordPayload): Promise<{ message: string }> => {
        const response = await apiClient.patch<{ message: string }>('/api/v1/ride-hailing/users/password', payload);
        console.log('Update password response:', JSON.stringify(response, null, 2));
        return response;
    },
};
