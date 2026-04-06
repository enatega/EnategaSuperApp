import type { CartSelectionInput } from '../api/cartServiceTypes';
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoCustomizationSection,
} from '../api/productInfoServiceTypes';

export type CartCustomizationSummary = {
  hasCustomizations: boolean;
  hasRequiredGroups: boolean;
  isSelectionComplete: boolean;
  requiredGroupIds: string[];
};

export function isCustomizationSectionRequired(
  section: Pick<ProductInfoCustomizationSection, 'minSelect'>,
) {
  return section.minSelect > 0;
}

export function summarizeCartCustomizations(
  customizations?: ProductInfoCustomizationsResponse | null,
  selectedOptions?: CartSelectionInput[],
): CartCustomizationSummary {
  const selectedGroupIds = new Set(
    (selectedOptions ?? []).map((option) => option.groupId),
  );
  const variationSections = customizations?.variations ?? [];
  const addonSections = customizations?.addons ?? [];
  const requiredAddonGroupIds = addonSections
    .filter((section) => isCustomizationSectionRequired(section))
    .map((section) => section.groupId);
  const hasRequiredVariationChoice = variationSections.some((section) =>
    isCustomizationSectionRequired(section),
  );
  const hasSelectedVariation = variationSections.some((section) =>
    selectedGroupIds.has(section.groupId),
  );
  const hasRequiredAddons = requiredAddonGroupIds.length > 0;
  const isAddonSelectionComplete = requiredAddonGroupIds.every((groupId) =>
    selectedGroupIds.has(groupId),
  );
  const hasRequiredGroups = hasRequiredVariationChoice || hasRequiredAddons;
  const requiredGroupIds = [
    ...(hasRequiredVariationChoice ? ['__variation__'] : []),
    ...requiredAddonGroupIds,
  ];

  return {
    hasCustomizations: variationSections.length + addonSections.length > 0,
    hasRequiredGroups,
    isSelectionComplete:
      (!hasRequiredVariationChoice || hasSelectedVariation) && isAddonSelectionComplete,
    requiredGroupIds,
  };
}
