import apiClient from '../../../general/api/apiClient';
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
};

export type WalletTopUpResponse = {
    checkoutUrl: string;
    sessionId: string;
    mode: string;
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

    /** Create a Stripe checkout session for wallet top-up. */
    topUpWallet: async (payload: WalletTopUpPayload): Promise<WalletTopUpResponse> =>
        apiClient.post<WalletTopUpResponse>('/api/v1/wallet/topup', payload),

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
