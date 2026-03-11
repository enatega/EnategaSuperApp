import { useCallback, useEffect, useState } from 'react';
import {
  profileService,
  ProfileAddress,
  ProfileUser,
  WalletResponse,
} from '../api/profileService';

type ProfileState = {
  user: ProfileUser | null;
  addresses: ProfileAddress[];
  wallet: WalletResponse['data'] | null;
  isLoading: boolean;
  error: string | null;
};

export default function useProfile() {
  const [state, setState] = useState<ProfileState>({
    user: null,
    addresses: [],
    wallet: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [profileRes, walletRes] = await Promise.all([
        profileService.getProfile(),
        profileService.getWalletBalance(),
      ]);
      setState({
        user: profileRes?.data?.user ?? null,
        addresses: profileRes?.data?.addresses ?? [],
        wallet: walletRes?.data ?? null,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load profile';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
