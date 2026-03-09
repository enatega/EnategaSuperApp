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
  LoginSendOtpPayload,
  LoginSendOtpResponse,
  LoginVerifyOtpPayload,
  LoginVerifyOtpResponse,
  SignupSendOtpPayload,
  SignupSendOtpResponse,
  SignupVerifyOtpPayload,
  SignupVerifyOtpResponse,
} from "../api/authTypes";
import { authSession } from "../auth/authSession";

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
