import apiClient from '../../../../general/api/apiClient';

const PROFILE_BASE = '/api/v1/apps/deliveries/profile';

export type ProfileUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  image: string | null;
};

export type ProfileResponse = {
  message: string;
  data: {
    user: ProfileUser;
    addresses: unknown[];
  };
};

export type WalletResponse = {
  message: string;
  data: {
    name: string | null;
    last_name: string | null;
    wallet_balance: number;
  };
};

export const profileService = {
  getProfile: () => apiClient.get<ProfileResponse>(PROFILE_BASE),
  getWalletBalance: () =>
    apiClient.get<WalletResponse>(`${PROFILE_BASE}/wallet`),
};
