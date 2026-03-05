import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../api/queryKeys';
import { userService } from '../api/userService';
import type { UpdateUserPayload, UpdateProfileImagePayload } from '../api/userService';
import type { UserApiData } from '../api/types';
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

