import apiClient from "./apiClient";

export type ProfileAppPrefix = "deliveries" | "home-services";

function getProfileBase(appPrefix: ProfileAppPrefix) {
  return `/api/v1/apps/${appPrefix}/profile`;
}

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
  type: "HOME" | "APARTMENT" | "OFFICE" | "OTHER";
  is_selected: boolean;
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

export function createProfileService(appPrefix: ProfileAppPrefix) {
  const profileBase = getProfileBase(appPrefix);

  return {
    getProfile: () => apiClient.get<ProfileResponse>(profileBase),
    getWalletBalance: () =>
      apiClient.get<WalletResponse>(`${profileBase}/wallet`),
    updateProfile: (payload: UpdateProfilePayload) =>
      apiClient.patch<ProfileResponse>(profileBase, payload),
    updateProfileImage: (payload: UpdateProfileImagePayload) => {
      const form = new FormData();
      form.append("image", {
        uri: payload.uri,
        type: payload.mimeType ?? "image/jpeg",
        name: payload.fileName ?? "profile.jpg",
      } as unknown as Blob);

      return apiClient.patch<ProfileResponse>(`${profileBase}/image`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  };
}

export const profileService = {
  getProfile: (appPrefix: ProfileAppPrefix) =>
    createProfileService(appPrefix).getProfile(),
  getWalletBalance: (appPrefix: ProfileAppPrefix) =>
    createProfileService(appPrefix).getWalletBalance(),
  updateProfile: (appPrefix: ProfileAppPrefix, payload: UpdateProfilePayload) =>
    createProfileService(appPrefix).updateProfile(payload),
  updateProfileImage: (
    appPrefix: ProfileAppPrefix,
    payload: UpdateProfileImagePayload,
  ) => {
    const form = new FormData();
    form.append("image", {
      uri: payload.uri,
      type: payload.mimeType ?? "image/jpeg",
      name: payload.fileName ?? "profile.jpg",
    } as unknown as Blob);

    return apiClient.patch<ProfileResponse>(
      `${getProfileBase(appPrefix)}/image`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};
