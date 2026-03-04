import * as SecureStore from 'expo-secure-store';
import { tokenManager } from '../api/apiClient';
import type { LoginVerifyOtpResponse, SignupVerifyOtpResponse } from '../api/authTypes';

const USER_KEY = 'super_app_auth_user';
const PROFILES_KEY = 'super_app_auth_profiles';

export type AuthUser = SignupVerifyOtpResponse['user'] | LoginVerifyOtpResponse['user'];
export type AuthProfiles = SignupVerifyOtpResponse['profiles'] | LoginVerifyOtpResponse['profiles'];
export type AuthSession = {
  token: string | null;
  user: AuthUser | null;
  profiles: AuthProfiles | null;
};

const getUser = async (): Promise<AuthUser | null> => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
};

const getProfiles = async (): Promise<AuthProfiles | null> => {
  const raw = await SecureStore.getItemAsync(PROFILES_KEY);
  return raw ? (JSON.parse(raw) as AuthProfiles) : null;
};

export const authSession = {
  setSession: async (payload: SignupVerifyOtpResponse | LoginVerifyOtpResponse) => {
    await tokenManager.setToken(payload.accessToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(payload.user));
    await SecureStore.setItemAsync(PROFILES_KEY, JSON.stringify(payload.profiles));
    return payload;
  },

  getAccessToken: () => tokenManager.getToken(),

  getUser,

  getProfiles,

  getSession: async (): Promise<AuthSession> => {
    const [token, user, profiles] = await Promise.all([
      tokenManager.getToken(),
      getUser(),
      getProfiles(),
    ]);
    return { token, user, profiles };
  },

  clearSession: async () => {
    await tokenManager.clearAll();
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(PROFILES_KEY);
  },
};
