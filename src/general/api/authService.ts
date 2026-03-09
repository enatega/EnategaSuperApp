import apiClient from "./apiClient";
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
} from "./authTypes";

const SIGNUP_BASE = "/api/v1/auth/shared/signup";
const LOGIN_BASE = "/api/v1/auth/shared/login";

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
    apiClient.post<LoginVerifyOtpResponse>(
      `${LOGIN_BASE}/phone/verify-otp`,
      payload,
      {
        skipAuth: true,
      },
    ),

  emailLogin: (payload: EmailLoginPayload) =>
    apiClient.post<EmailLoginRespoce>(`${LOGIN_BASE}/email`, payload, {
      skipAuth: true,
    }),
};
