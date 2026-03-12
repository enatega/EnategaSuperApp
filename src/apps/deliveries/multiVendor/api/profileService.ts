import apiClient from '../../../../general/api/apiClient';

const PROFILE_BASE = '/api/v1/apps/deliveries/profile';

export type ProfileUser = {
  id: string;
  name: string | null;
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
    wallet_balance: number;
  };
};

export type UpdateProfilePayload = {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
};

export type UpdateProfileImagePayload = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

export const profileService = {
  getProfile: () => apiClient.get<ProfileResponse>(PROFILE_BASE),
  getWalletBalance: () =>
    apiClient.get<WalletResponse>(`${PROFILE_BASE}/wallet`),
  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.patch<ProfileResponse>(PROFILE_BASE, payload),
  updateProfileImage: (payload: UpdateProfileImagePayload) => {
    const form = new FormData();
    form.append('image', {
      uri: payload.uri,
      type: payload.mimeType ?? 'image/jpeg',
      name: payload.fileName ?? 'profile.jpg',
    } as unknown as Blob);

    return apiClient.patch<ProfileResponse>(
      `${PROFILE_BASE}/image`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },
};
