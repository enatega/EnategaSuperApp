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

export type ProfileAddress = {
  id: string;
  user_id: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  location_name: string | null;
  type: 'HOME' | 'APARTMENT' | 'OFFICE' | 'OTHER';
  createdAt: string;
  updatedAt: string;
};

export type ProfileResponse = {
  message: string;
  data: {
    user: ProfileUser;
    addresses: ProfileAddress[];
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
