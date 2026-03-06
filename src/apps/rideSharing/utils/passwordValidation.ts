import { useTranslation } from 'react-i18next';

export const usePasswordValidation = () => {
  const { t } = useTranslation('rideSharing');

  const validatePassword = (password: string): string | null => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength)
      return t('password_min_length', 'Password must be at least 8 characters');
    if (!hasUpperCase)
      return t('password_uppercase', 'Password must contain at least one uppercase letter');
    if (!hasLowerCase)
      return t('password_lowercase', 'Password must contain at least one lowercase letter');
    if (!hasNumbers)
      return t('password_number', 'Password must contain at least one number');
    if (!hasSpecialChar)
      return t('password_special', 'Password must contain at least one special character');

    return null;
  };

  return { validatePassword };
};
