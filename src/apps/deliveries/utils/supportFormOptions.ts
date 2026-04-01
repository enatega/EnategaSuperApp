type Translator = (key: string, options?: { defaultValue?: string }) => string;
type Exists = (key: string) => boolean;

export type SupportOption = {
  label: string;
  value: string;
};

const SUPPORT_CATEGORY_DISPLAY_ORDER = [
  'business_support',
  'joining_as_a_business',
  'appointment_support',
];

const toTranslationSuffix = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const toReadableLabel = (value: string) =>
  value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function buildSupportOptions(
  values: string[],
  translationPrefix: string,
  t: Translator,
  exists: Exists,
): SupportOption[] {
  return values.map((value) => {
    const translationKey = `${translationPrefix}${toTranslationSuffix(value)}`;
    const fallbackLabel = toReadableLabel(value);

    return {
      value,
      label: exists(translationKey)
        ? t(translationKey)
        : t(translationKey, { defaultValue: fallbackLabel }),
    };
  });
}

export function orderSupportCategoryKeys(values: string[]) {
  const uniqueValues = Array.from(new Set(values));

  return uniqueValues.sort((left, right) => {
    const leftIndex = SUPPORT_CATEGORY_DISPLAY_ORDER.indexOf(left);
    const rightIndex = SUPPORT_CATEGORY_DISPLAY_ORDER.indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) {
      return left.localeCompare(right);
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
}
