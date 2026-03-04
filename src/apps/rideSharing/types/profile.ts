export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  countryCode: string;
  profilePhotoUri?: string;
  rating: number;
  totalRides: number;
  memberSince: string;
};

export type ProfilePhotoUpdateOption = {
  id: string;
  label: string;
  icon: string;
};

export type NameFormData = {
  firstName: string;
  lastName: string;
};

export type PhoneFormData = {
  countryCode: string;
  phoneNumber: string;
};

export type ProfileField =
  | 'name'
  | 'phone'
  | 'email'
  | 'profilePhoto';
