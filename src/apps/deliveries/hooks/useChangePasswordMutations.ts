import { useMutation } from '@tanstack/react-query';
import { changePasswordService } from '../api/changePasswordService';

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (email: string) => changePasswordService.sendOtp(email),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      changePasswordService.verifyOtp(email, otp),
  });
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => changePasswordService.updatePassword(email, otp, newPassword),
  });
}
