import type { CartSelectionInput } from '../api/cartServiceTypes';
import type { ProductInfoCustomizationsResponse } from '../api/productInfoServiceTypes';

export type CartCustomizationSummary = {
  hasCustomizations: boolean;
  hasRequiredGroups: boolean;
  isSelectionComplete: boolean;
  requiredGroupIds: string[];
};

export function summarizeCartCustomizations(
  customizations?: ProductInfoCustomizationsResponse | null,
  selectedOptions?: CartSelectionInput[],
): CartCustomizationSummary {
  const sections = [
    ...(customizations?.variations ?? []),
    ...(customizations?.addons ?? []),
  ];
  const requiredGroupIds = sections
    .filter((section) => section.required)
    .map((section) => section.groupId);
  const selectedGroupIds = new Set(
    (selectedOptions ?? []).map((option) => option.groupId),
  );

  return {
    hasCustomizations: sections.length > 0,
    hasRequiredGroups: requiredGroupIds.length > 0,
    isSelectionComplete: requiredGroupIds.every((groupId) =>
      selectedGroupIds.has(groupId),
    ),
    requiredGroupIds,
  };
}
