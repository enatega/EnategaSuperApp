import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../api/apiClient';
import {
  createNotificationSettingsService,
  type NotificationSettingsResponse,
  type UpdateNotificationSettingsPayload,
  type SettingsAppPrefix,
} from '../api/settingsService';
import { notificationSettingsKeys } from '../api/queryKeys';

type Options = {
  onSuccess?: (data: NotificationSettingsResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useUpdateNotificationSettingsMutation(
  appPrefix: SettingsAppPrefix,
  options?: Options,
) {
  const queryClient = useQueryClient();
  const service = createNotificationSettingsService(appPrefix);

  return useMutation<
    NotificationSettingsResponse,
    ApiError,
    UpdateNotificationSettingsPayload
  >({
    mutationFn: service.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationSettingsKeys.detail(), data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
