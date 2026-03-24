import apiClient from '../../../general/api/apiClient';

export interface NotificationSettings {
  id: string;
  user_id: string;
  food_delivery_email: boolean;
  food_delivery_sms: boolean;
  food_delivery_whatsapp: boolean;
  marketing_email: boolean;
  marketing_sms: boolean;
  marketing_whatsapp: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettingsResponse {
  message: string;
  data: NotificationSettings;
}

export type UpdateNotificationSettingsPayload = Partial<
  Pick<
    NotificationSettings,
    | 'food_delivery_email'
    | 'food_delivery_sms'
    | 'food_delivery_whatsapp'
    | 'marketing_email'
    | 'marketing_sms'
    | 'marketing_whatsapp'
  >
>;

export const notificationSettingsService = {
  getSettings: async (): Promise<NotificationSettingsResponse> =>
    apiClient.get<NotificationSettingsResponse>(
      '/api/v1/apps/deliveries/settings/notifications',
    ),

  updateSettings: async (
    payload: UpdateNotificationSettingsPayload,
  ): Promise<NotificationSettingsResponse> =>
    apiClient.patch<NotificationSettingsResponse>(
      '/api/v1/apps/deliveries/settings/notifications',
      payload,
    ),
};
