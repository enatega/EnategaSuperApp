import apiClient from '../../../general/api/apiClient';

export const changePasswordService = {
  sendOtp: (email: string) =>
    apiClient.post('/api/v1/apps/deliveries/settings/change-password/send-otp', { email }),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post('/api/v1/apps/deliveries/settings/change-password/verify-otp', { email, otp }),

  updatePassword: (email: string, otp: string, newPassword: string) =>
    apiClient.post('/api/v1/apps/deliveries/settings/change-password/update', {
      email,
      otp,
      newPassword,
    }),
};
