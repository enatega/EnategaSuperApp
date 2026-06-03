import apiClient from "./apiClient";
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
} from "./authTypes";

const SIGNUP_BASE = "/api/v1/auth/shared/signup";
const LOGIN_BASE = "/api/v1/auth/shared/login";
const FORGOT_PASSWORD = "/api/v1/otp";

export const authService = {
  sendSignupOtp: (payload: SignupSendOtpPayload) =>
    apiClient.post<SignupSendOtpResponse>(`${SIGNUP_BASE}/send-otp`, payload, {
      skipAuth: true,
    }),

  verifySignupOtp: (payload: SignupVerifyOtpPayload) =>
    apiClient.post<SignupVerifyOtpResponse>(
      `${SIGNUP_BASE}/verify-otp`,
      payload,
      {
        skipAuth: true,
      },
    ),

  sendLoginOtp: (payload: LoginSendOtpPayload) =>
    apiClient.post<LoginSendOtpResponse>(
      `${LOGIN_BASE}/phone/send-otp`,
      payload,
      {
        skipAuth: true,
      },
    ),

  verifyLoginOtp: (payload: LoginVerifyOtpPayload) =>
    (
      console.log('[Auth][LoginVerifyOtp] device_push_token', {
        phone: payload.phone,
        hasDevicePushToken: Boolean(payload.device_push_token),
        device_push_token: payload.device_push_token ?? null,
      }),
      apiClient.post<LoginVerifyOtpResponse>(
        `${LOGIN_BASE}/phone/verify-otp`,
        payload,
        {
          skipAuth: true,
        },
      )
    ),

  emailLogin: (payload: EmailLoginPayload) =>
    (
      console.log('[Auth][EmailLogin] device_push_token', {
        email: payload.email,
        hasDevicePushToken: Boolean(payload.device_push_token),
        device_push_token: payload.device_push_token ?? null,
      }),
      apiClient.post<EmailLoginRespoce>(`${LOGIN_BASE}/email`, payload, {
        skipAuth: true,
      })
    ),

  googleLogin: (payload: GoogleLoginPayload) =>
    apiClient.post<GoogleLoginResponse>(`/api/v1/auth/login/google`, payload, {
      skipAuth: true,
    }),

  sendForgotPasswordOtp: (payload: SendForgotPasswordOtpPayload) =>
    apiClient.post<SendForgotPasswordOtpResponce>(
      `${FORGOT_PASSWORD}/send`,
      payload,
      {
        skipAuth: true,
      },
    ),

  verifyForgotPasswordOtp: (payload: VerifyForgotPasswordOtpPayload) =>
    apiClient.post<VerifyForgotPasswordOtpResponce>(
      `${FORGOT_PASSWORD}/verify`,
      payload,
      {
        skipAuth: true,
      },
    ),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<ResetPasswordResponce>(
      `${FORGOT_PASSWORD}/reset-password`,
      payload,
      {
        skipAuth: true,
      },
    ),
};
