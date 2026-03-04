import type { UserProfile } from '../types/profile';

// Mock user profile data - will be replaced with API data later
export const mockUserProfile: UserProfile = {
  id: 'user-1',
  firstName: 'Robert',
  lastName: 'Watson',
  email: 'robert.watson141@test.com',
  emailVerified: true,
  phone: '0082110323',
  phoneVerified: true,
  countryCode: '+41',
  profilePhotoUri: undefined,
  rating: 4.89,
  totalRides: 502,
  memberSince: '2023',
};

// Country codes for phone number
export const countryCodes = [
  { code: '+1', label: 'US', flag: '🇺🇸' },
  { code: '+44', label: 'UK', flag: '🇬🇧' },
  { code: '+49', label: 'DE', flag: '🇩' },
  { code: '+33', label: 'FR', flag: '🇫🇷' },
  { code: '+41', label: 'CH', flag: '🇨🇭' },
  { code: '+39', label: 'IT', flag: '🇮🇹' },
  { code: '+34', label: 'ES', flag: '🇪' },
  { code: '+31', label: 'NL', flag: '🇳🇱' },
  { code: '+43', label: 'AT', flag: '🇦🇹' },
  { code: '+32', label: 'BE', flag: '🇧🇪' },
];
