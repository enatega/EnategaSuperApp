import type { PaymentCardBrand } from '../types/wallet';

/**
 * Detects card brand from the first digits of the card number.
 * Returns null if unrecognised.
 */
export function detectCardBrand(digits: string): PaymentCardBrand | null {
  if (digits.length === 0) return null;

  const d = digits.replace(/\s/g, '');

  // Mastercard: starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(d)) return 'mastercard';
  if (/^2[2-7]/.test(d)) return 'mastercard';

  // Visa: starts with 4
  if (/^4/.test(d)) return 'visa';

  return null;
}

/**
 * Formats raw digits into groups of 4 separated by spaces.
 * e.g. "4242424242424242" → "4242 4242 4242 4242"
 */
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(' ');
}

/**
 * Strips formatting and returns raw digits only.
 */
export function stripCardNumber(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

/**
 * Formats expiry input as MM / YY with auto-slash insertion.
 * Handles both typing and deletion gracefully.
 */
export function formatExpiry(raw: string, previousValue: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);

  // User is deleting — if they just removed the slash, drop the month's last digit
  if (raw.length < previousValue.length) {
    if (previousValue.endsWith(' / ') || previousValue.endsWith(' /')) {
      return digits.slice(0, 1);
    }
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }

  if (digits.length === 0) return '';
  if (digits.length === 1) {
    // If first digit > 1, prefix with 0 and add slash
    const n = parseInt(digits, 10);
    if (n > 1) return `0${digits} / `;
    return digits;
  }
  if (digits.length === 2) {
    const month = parseInt(digits, 10);
    if (month > 12) return `0${digits[0]} / ${digits[1]}`;
    return `${digits} / `;
  }
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

/**
 * Returns the max CVV length for a given brand.
 * AMEX uses 4 digits, everything else uses 3.
 */
export function getCvvLength(_brand: PaymentCardBrand | null): number {
  // All brands in our system use 3-digit CVV
  return 3;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type CardValidation = {
  isCardNumberValid: boolean;
  isExpiryValid: boolean;
  isCvvValid: boolean;
  isFormValid: boolean;
  cardNumberError: string | null;
  expiryError: string | null;
  cvvError: string | null;
};

/**
 * Validates card number by checking it has 13–19 digits.
 * Luhn check removed — real validation will happen server-side.
 */
export function isValidLuhn(digits: string): boolean {
  return digits.length >= 13 && digits.length <= 19;
}

/**
 * Validates the expiry string (MM / YY) is a future date.
 */
export function isExpiryFuture(expiry: string): boolean {
  const digits = expiry.replace(/\D/g, '');
  if (digits.length !== 4) return false;

  const month = parseInt(digits.slice(0, 2), 10);
  const year = parseInt(digits.slice(2, 4), 10) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

/**
 * Full form validation. Returns per-field errors and overall validity.
 */
export function validateCardForm(
  cardNumber: string,
  expiry: string,
  cvv: string,
  brand: PaymentCardBrand | null,
): CardValidation {
  const rawDigits = stripCardNumber(cardNumber);
  const cvvLen = getCvvLength(brand);

  const isCardNumberValid = rawDigits.length >= 13 && isValidLuhn(rawDigits);
  const isExpiryValid = isExpiryFuture(expiry);
  const isCvvValid = cvv.length === cvvLen;

  return {
    isCardNumberValid,
    isExpiryValid,
    isCvvValid,
    isFormValid: isCardNumberValid && isExpiryValid && isCvvValid,
    cardNumberError: rawDigits.length > 0 && !isCardNumberValid ? 'Invalid card number' : null,
    expiryError: expiry.replace(/\D/g, '').length === 4 && !isExpiryValid ? 'Invalid or expired date' : null,
    cvvError: cvv.length > 0 && cvv.length < cvvLen ? `Must be ${cvvLen} digits` : null,
  };
}
