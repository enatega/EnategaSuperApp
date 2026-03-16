import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authService } from "../api/authService";
import { authKeys } from "../api/queryKeys";
import type { ApiError } from "../api/apiClient";
import type {
  EmailLoginPayload,
  EmailLoginRespoce,
  GoogleLoginPayload,
  GoogleLoginResponse,
  LoginSendOtpPayload,
  LoginSendOtpResponse,
  LoginVerifyOtpPayload,
  LoginVerifyOtpResponse,
  ResetPasswordPayload,
  ResetPasswordResponce,
  SendForgotPasswordOtpPayload,
  SendForgotPasswordOtpResponce,
  SignupSendOtpPayload,
  SignupSendOtpResponse,
  SignupVerifyOtpPayload,
  SignupVerifyOtpResponse,
  VerifyForgotPasswordOtpPayload,
  VerifyForgotPasswordOtpResponce,
} from "../api/authTypes";
import { authSession } from "../auth/authSession";
import { socketClient } from "../services/socket";

export function useSignupSendOtp(
  options?: UseMutationOptions<
    SignupSendOtpResponse,
    ApiError,
    SignupSendOtpPayload
  >,
) {
  return useMutation<SignupSendOtpResponse, ApiError, SignupSendOtpPayload>({
    mutationFn: authService.sendSignupOtp,
    ...options,
  });
}

export function useSignupVerifyOtp(
  options?: UseMutationOptions<
    SignupVerifyOtpResponse,
    ApiError,
    SignupVerifyOtpPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<SignupVerifyOtpResponse, ApiError, SignupVerifyOtpPayload>(
    {
      mutationFn: authService.verifySignupOtp,
      ...options,
      onSuccess: async (data, variables, context) => {
        await authSession.setSession(data);
        queryClient.setQueryData(authKeys.session(), {
          token: data.accessToken,
          user: data.user,
          profiles: data.profiles,
        });
        queryClient.invalidateQueries({ queryKey: authKeys.session() });
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
}

export function useLoginSendOtp(
  options?: UseMutationOptions<
    LoginSendOtpResponse,
    ApiError,
    LoginSendOtpPayload
  >,
) {
  return useMutation<LoginSendOtpResponse, ApiError, LoginSendOtpPayload>({
    mutationFn: authService.sendLoginOtp,
    ...options,
  });
}

export function useLoginVerifyOtp(
  options?: UseMutationOptions<
    LoginVerifyOtpResponse,
    ApiError,
    LoginVerifyOtpPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<LoginVerifyOtpResponse, ApiError, LoginVerifyOtpPayload>({
    mutationFn: authService.verifyLoginOtp,
    ...options,
    onSuccess: async (data, variables, context) => {
      await authSession.setSession(data);
      queryClient.setQueryData(authKeys.session(), {
        token: data.accessToken,
        user: data.user,
        profiles: data.profiles,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useLogout(options?: UseMutationOptions<void, ApiError, void>) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: async () => {
      await socketClient.updateAuthToken(null);
      socketClient.disconnect();
      await authSession.clearSession();
    },
    ...options,
    onSuccess: async (_data, variables, context) => {
      queryClient.setQueryData(authKeys.session(), {
        token: null,
        user: null,
        profiles: null,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(_data, variables, context);
    },
  });
}

export function useEmailLogin(
  options?: UseMutationOptions<EmailLoginRespoce, ApiError, EmailLoginPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation<EmailLoginRespoce, ApiError, EmailLoginPayload>({
    mutationFn: authService.emailLogin,
    ...options,
    onSuccess: async (data, variables, context) => {
      await authSession.setSession(data);
      queryClient.setQueryData(authKeys.session(), {
        token: data.accessToken,
        user: data.user,
        profiles: data.profiles,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useGoogleLogin(
  options?: UseMutationOptions<
    GoogleLoginResponse,
    ApiError,
    GoogleLoginPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<GoogleLoginResponse, ApiError, GoogleLoginPayload>({
    mutationFn: authService.googleLogin,
    ...options,
    onSuccess: async (data, variables, context) => {
      await authSession.setSession(data);
      queryClient.setQueryData(authKeys.session(), {
        token: data.accessToken,
        user: data.user,
        profiles: data.profiles,
      });
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useForgotPasswordSendOtp(
  options?: UseMutationOptions<
    SendForgotPasswordOtpResponce,
    ApiError,
    SendForgotPasswordOtpPayload
  >,
) {
  return useMutation<
    SendForgotPasswordOtpResponce,
    ApiError,
    SendForgotPasswordOtpPayload
  >({
    mutationFn: authService.sendForgotPasswordOtp,
    ...options,
  });
}

export function useForgotPasswordVerifyOtp(
  options?: UseMutationOptions<
    VerifyForgotPasswordOtpResponce,
    ApiError,
    VerifyForgotPasswordOtpPayload
  >,
) {
  return useMutation<
    VerifyForgotPasswordOtpResponce,
    ApiError,
    VerifyForgotPasswordOtpPayload
  >({
    mutationFn: authService.verifyForgotPasswordOtp,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<
    ResetPasswordResponce,
    ApiError,
    ResetPasswordPayload
  >,
) {
  return useMutation<ResetPasswordResponce, ApiError, ResetPasswordPayload>({
    mutationFn: authService.resetPassword,
    ...options,
  });
}
