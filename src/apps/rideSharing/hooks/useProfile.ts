import { useState, useCallback, useEffect } from 'react';
import { useUser } from './useUserQueries';
import type { UserApiData } from '../api/types';
import type { PhoneFormData } from '../types/profile';
import { countryCodes } from '../data/profileMockData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Sort by length descending, so `+1809` matches before `+1`
const sortedCountryCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);

/**
 * Splits a phone string like "+923331593578" into { countryCode: "+92", phone: "3331593578" }.
 * Falls back to the full string as the phone number if no match.
 */
function splitPhone(raw: string | null): { countryCode: string; phone: string } {
  if (!raw) return { countryCode: '', phone: '' };

  // 1. Precise match against known country dialling codes
  for (const c of sortedCountryCodes) {
    if (raw.startsWith(c.code)) {
      return { countryCode: c.code, phone: raw.slice(c.code.length).trim() };
    }
  }

  // 2. Generic fallback if not in the list (but starts with '+')
  const match = raw.match(/^(\+\d{1,3})(.*)$/);
  if (match) {
    return { countryCode: match[1], phone: match[2].trim() };
  }

  return { countryCode: '', phone: raw };
}

// ---------------------------------------------------------------------------
// Adapter: UserApiData → shape the screen uses
// ---------------------------------------------------------------------------

export type MappedUserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  countryCode: string;
  phoneVerified: boolean;
  profilePhotoUri: string | undefined;
};

function toMappedProfile(user: UserApiData): MappedUserProfile {
  const { countryCode, phone } = splitPhone(user.phone);
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? '',
    emailVerified: user.email_is_verified,
    phone,
    countryCode,
    phoneVerified: user.phone_is_verified,
    profilePhotoUri: user.profile ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProfile() {
  const { data: apiUser, isLoading, isError, error, refetch } = useUser();

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const userProfile = apiUser ? toMappedProfile(apiUser) : null;

  // 🔍 Debug: log raw API response and mapped profile (remove before production)
  useEffect(() => {
    if (apiUser) {
      console.log('[useProfile] Raw API response:', apiUser);
      console.log('[useProfile] Mapped profile:', toMappedProfile(apiUser));
    }
  }, [apiUser]);

  const updatePhone = useCallback((_data: PhoneFormData) => {
    // TODO: wire to a PATCH /api/v1/users mutation and invalidate userKeys.profile()
  }, []);

  const openPhotoEdit = useCallback(() => setIsEditingPhoto(true), []);
  const closePhotoEdit = useCallback(() => setIsEditingPhoto(false), []);

  return {
    userProfile,
    isLoading,
    isError,
    error,
    refetch,
    isEditingPhoto,
    updatePhone,
    openPhotoEdit,
    closePhotoEdit,
  };
}

