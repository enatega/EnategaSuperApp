import apiClient from './apiClient';

export type SettingsAppPrefix = 'deliveries' | 'home-services';

function getSettingsBase(appPrefix: SettingsAppPrefix) {
  return `/api/v1/apps/${appPrefix}/settings`;
}

// ---------------------------------------------------------------------------
// Change Password
// ---------------------------------------------------------------------------

export const createChangePasswordService = (appPrefix: SettingsAppPrefix) => {
  const base = `${getSettingsBase(appPrefix)}/change-password`;

  return {
    sendOtp: (email: string) =>
      apiClient.post(`${base}/send-otp`, { email }),

    verifyOtp: (email: string, otp: string) =>
      apiClient.post(`${base}/verify-otp`, { email, otp }),

    updatePassword: (email: string, otp: string, newPassword: string) =>
      apiClient.post(`${base}/update`, { email, otp, newPassword }),
  };
};

// ---------------------------------------------------------------------------
// Notification Settings
// ---------------------------------------------------------------------------

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

export const createNotificationSettingsService = (
  appPrefix: SettingsAppPrefix,
) => {
  const base = `${getSettingsBase(appPrefix)}/notifications`;

  return {
    getSettings: async (): Promise<NotificationSettingsResponse> =>
      apiClient.get<NotificationSettingsResponse>(base),

    updateSettings: async (
      payload: UpdateNotificationSettingsPayload,
    ): Promise<NotificationSettingsResponse> =>
      apiClient.patch<NotificationSettingsResponse>(base, payload),
  };
};

// ---------------------------------------------------------------------------
// Delete Account
// ---------------------------------------------------------------------------

export type DeleteAccountResponse = {
  message: string;
};

export const deleteAccountService = {
  deleteAccount: (message: string) =>
    apiClient.patch<DeleteAccountResponse>(
      `/api/v1/auth/soft-delete?message=${encodeURIComponent(message)}`,
    ),
};
