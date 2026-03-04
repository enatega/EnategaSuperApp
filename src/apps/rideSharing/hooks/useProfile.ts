import { useState, useCallback } from 'react';
import type { UserProfile, NameFormData, PhoneFormData } from '../types/profile';
import { mockUserProfile } from '../data/profileMockData';

export function useProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const updateProfilePhoto = useCallback((photoUri: string) => {
    setUserProfile((prev) => ({
      ...prev,
      profilePhotoUri: photoUri,
    }));
    setIsEditingPhoto(false);
  }, []);

  const updateName = useCallback((data: NameFormData) => {
    setUserProfile((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
    }));
  }, []);

  const updatePhone = useCallback((data: PhoneFormData) => {
    setUserProfile((prev) => ({
      ...prev,
      phone: data.phoneNumber,
      countryCode: data.countryCode,
      phoneVerified: false, // Reset verification when phone changes
    }));
  }, []);

  const openPhotoEdit = useCallback(() => {
    setIsEditingPhoto(true);
  }, []);

  const closePhotoEdit = useCallback(() => {
    setIsEditingPhoto(false);
  }, []);

  return {
    userProfile,
    isEditingPhoto,
    updateProfilePhoto,
    updateName,
    updatePhone,
    openPhotoEdit,
    closePhotoEdit,
  };
}
