import apiClient from './apiClient';
import type {
  LoginSendOtpPayload,
  LoginSendOtpResponse,
  LoginVerifyOtpPayload,
  LoginVerifyOtpResponse,
  SignupSendOtpPayload,
  SignupSendOtpResponse,
  SignupVerifyOtpPayload,
  SignupVerifyOtpResponse,
} from './authTypes';

const SIGNUP_BASE = '/api/v1/auth/shared/signup';
const LOGIN_BASE = '/api/v1/auth/shared/login/phone';

export const authService = {
  sendSignupOtp: (payload: SignupSendOtpPayload) =>
    apiClient.post<SignupSendOtpResponse>(`${SIGNUP_BASE}/send-otp`, payload, {
      skipAuth: true,
    }),

  verifySignupOtp: (payload: SignupVerifyOtpPayload) =>
    apiClient.post<SignupVerifyOtpResponse>(`${SIGNUP_BASE}/verify-otp`, payload, {
      skipAuth: true,
    }),

  sendLoginOtp: (payload: LoginSendOtpPayload) =>
    apiClient.post<LoginSendOtpResponse>(`${LOGIN_BASE}/send-otp`, payload, {
      skipAuth: true,
    }),

  verifyLoginOtp: (payload: LoginVerifyOtpPayload) =>
    apiClient.post<LoginVerifyOtpResponse>(`${LOGIN_BASE}/verify-otp`, payload, {
      skipAuth: true,
    }),
};
