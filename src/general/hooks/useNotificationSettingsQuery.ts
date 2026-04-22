import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../api/apiClient';
import {
  createNotificationSettingsService,
  type NotificationSettingsResponse,
  type SettingsAppPrefix,
} from '../api/settingsService';
import { notificationSettingsKeys } from '../api/queryKeys';

export { notificationSettingsKeys };

export function useNotificationSettingsQuery(appPrefix: SettingsAppPrefix) {
  const service = createNotificationSettingsService(appPrefix);

  return useQuery<NotificationSettingsResponse, ApiError>({
    queryKey: notificationSettingsKeys.detail(),
    queryFn: service.getSettings,
    staleTime: 5 * 60 * 1000,
  });
}
