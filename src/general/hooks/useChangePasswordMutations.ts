import { useMutation } from '@tanstack/react-query';
import {
  createChangePasswordService,
  type SettingsAppPrefix,
} from '../api/settingsService';

export function useSendOtpMutation(appPrefix: SettingsAppPrefix) {
  const service = createChangePasswordService(appPrefix);

  return useMutation({
    mutationFn: (email: string) => service.sendOtp(email),
  });
}

export function useVerifyOtpMutation(appPrefix: SettingsAppPrefix) {
  const service = createChangePasswordService(appPrefix);

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      service.verifyOtp(email, otp),
  });
}

export function useUpdatePasswordMutation(appPrefix: SettingsAppPrefix) {
  const service = createChangePasswordService(appPrefix);

  return useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => service.updatePassword(email, otp, newPassword),
  });
}
