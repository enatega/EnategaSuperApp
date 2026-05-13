import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rideKeys, userKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import { userService } from '../api/userService';
import type {
    UpdateUserPayload,
    UpdateProfileImagePayload,
    UpdatePasswordPayload,
    WalletTopUpPayload,
    WalletTopUpResponse,
} from '../api/userService';
import type { UserApiData } from '../api/types';
import type {
    UpdateRiderPhonePayload,
    VerifyRiderPhoneUpdateOtpPayload,
} from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

// ---------------------------------------------------------------------------
// useUpdateUser – PATCH /api/v1/users  (text fields, e.g. name)
// ---------------------------------------------------------------------------

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation<UserApiData, ApiError, UpdateUserPayload>({
        mutationFn: (payload) => userService.updateUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
        onError: (error) => {
            console.error('[useUpdateUser] Failed:', error.message);
        },
    });
}

// ---------------------------------------------------------------------------
// useUpdateProfileImage – PATCH /api/v1/users  (multipart image upload)
// ---------------------------------------------------------------------------

export function useUpdateProfileImage() {
    const queryClient = useQueryClient();

    return useMutation<UserApiData, ApiError, UpdateProfileImagePayload>({
        mutationFn: (payload) => userService.updateProfileImage(payload),
        onSuccess: () => {
            // Invalidate profile so the new avatar URL is fetched
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
        onError: (error) => {
            console.error('[useUpdateProfileImage] Failed:', error.message);
        },
    });
}

// ---------------------------------------------------------------------------
// useUpdatePassword – PATCH /api/v1/users/password
// ---------------------------------------------------------------------------

export function useUpdatePassword() {
    return useMutation<{ message: string }, ApiError, UpdatePasswordPayload>({
        mutationFn: (payload) => userService.updatePassword(payload),
        onError: (error) => {
            console.error('[useUpdatePassword] Failed:', error.message);
        },
    });
}

export function useWalletTopUp() {
    const queryClient = useQueryClient();

    return useMutation<WalletTopUpResponse, ApiError, WalletTopUpPayload>({
        mutationFn: (payload) => userService.topUpWallet(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.walletBalance() });
        },
        onError: (error) => {
            console.error('[useWalletTopUp] Failed:', error.message);
        },
    });
}

export function useUpdateRiderPhone() {
    return useMutation<{ message?: string }, ApiError, UpdateRiderPhonePayload>({
        mutationFn: (payload) => rideService.updateRiderPhone(payload),
        onError: (error) => {
            console.error('[useUpdateRiderPhone] Failed:', error.message);
        },
    });
}

export function useVerifyRiderPhoneUpdateOtp() {
    const queryClient = useQueryClient();

    return useMutation<{ message?: string }, ApiError, VerifyRiderPhoneUpdateOtpPayload>({
        mutationFn: (payload) => rideService.verifyRiderPhoneUpdateOtp(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
            queryClient.invalidateQueries({ queryKey: rideKeys.activeRide() });
        },
        onError: (error) => {
            console.error('[useVerifyRiderPhoneUpdateOtp] Failed:', error.message);
        },
    });
}

export function useResendRiderPhoneUpdateOtp() {
    return useMutation<{ message?: string }, ApiError, UpdateRiderPhonePayload>({
        mutationFn: (payload) => rideService.resendRiderPhoneUpdateOtp(payload),
        onError: (error) => {
            console.error('[useResendRiderPhoneUpdateOtp] Failed:', error.message);
        },
    });
}
