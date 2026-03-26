import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { notificationSettingsService, type NotificationSettingsResponse } from '../api/notificationSettingsService';

export const notificationSettingsKeys = {
  all: ['notification-settings'] as const,
  detail: () => [...notificationSettingsKeys.all, 'detail'] as const,
};

export function useNotificationSettingsQuery() {
  return useQuery<NotificationSettingsResponse, ApiError>({
    queryKey: notificationSettingsKeys.detail(),
    queryFn: notificationSettingsService.getSettings,
    staleTime: 5 * 60 * 1000,
  });
}
