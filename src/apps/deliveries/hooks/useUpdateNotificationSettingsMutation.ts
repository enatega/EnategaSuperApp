import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import {
  notificationSettingsService,
  type NotificationSettingsResponse,
  type UpdateNotificationSettingsPayload,
} from '../api/notificationSettingsService';
import { notificationSettingsKeys } from './useNotificationSettingsQuery';

type Options = {
  onSuccess?: (data: NotificationSettingsResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useUpdateNotificationSettingsMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<NotificationSettingsResponse, ApiError, UpdateNotificationSettingsPayload>({
    mutationFn: notificationSettingsService.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationSettingsKeys.detail(), data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
