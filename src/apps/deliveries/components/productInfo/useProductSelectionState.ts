import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartSelectionInput } from "../../api/cartServiceTypes";
import { isCustomizationSectionRequired } from "../../cart/cartCustomizationRules";
import type { ProductInfoCustomizationSection } from "../../api/productInfoServiceTypes";

export type ProductSelectionOption = {
  optionId: string;
  groupId: string;
  label: string;
  price: number;
};

export type ProductVariationOption = ProductSelectionOption & {
  helperText: string | null;
  isMarkedRequired: boolean;
  pricingMode: "additive" | "replace_base";
  required: boolean;
};

export type ProductSelectionSection = {
  groupId: string;
  helperText: string | null;
  isMarkedRequired: boolean;
  label: string;
  required: boolean;
  selectionType: "single" | "multiple";
  options: ProductSelectionOption[];
};

const normalizeSelectionType = (selectionType?: string | null) =>
  selectionType === "single" ? "single" : "multiple";

const buildSelectableSections = (
  sections: ProductInfoCustomizationSection[],
): ProductSelectionSection[] =>
  sections.map((section) => ({
    groupId: section.groupId,
    helperText: section.helperText,
    isMarkedRequired: section.required,
    label: section.name,
    required: isCustomizationSectionRequired(section),
    selectionType: normalizeSelectionType(section.selectionType),
    options: section.options.map((option) => ({
      optionId: option.optionId,
      groupId: section.groupId,
      label: option.title,
      price: option.price,
    })),
  }));

const isOptionlessVariationSection = (
  section: ProductInfoCustomizationSection,
) => {
  const firstOption = section.options[0];

  return (
    section.options.length === 1 &&
    firstOption?.optionId === section.groupId
  );
};

const buildVariationOptions = (
  sections: ProductInfoCustomizationSection[],
): ProductVariationOption[] => {
  if (sections.length === 0) {
    return [];
  }

  const shouldUseOptionlessVariationMode = sections.every(isOptionlessVariationSection);

  if (shouldUseOptionlessVariationMode) {
    const options = sections
      .map((section) => {
        const firstOption = section.options[0];

        if (!firstOption) {
          return null;
        }

        return {
          groupId: section.groupId,
          helperText: section.helperText,
          isMarkedRequired: section.required,
          label: section.name,
          optionId: firstOption.optionId,
          price: firstOption.price,
          pricingMode: "replace_base" as const,
          required: isCustomizationSectionRequired(section),
        };
      });

    return options.filter((option): option is NonNullable<typeof option> => option != null);
  }

  const primarySection = sections[0];

  return primarySection.options.map((option) => ({
    groupId: primarySection.groupId,
    helperText: primarySection.helperText,
    isMarkedRequired: primarySection.required,
    label: option.title,
    optionId: option.optionId,
    price: option.price,
    pricingMode: "replace_base" as const,
    required: isCustomizationSectionRequired(primarySection),
  }));
};

const areStringArrayMapsEqual = (
  left: Record<string, string[]>,
  right: Record<string, string[]>,
) => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => {
    const leftValue = left[key] ?? [];
    const rightValue = right[key] ?? [];

    if (leftValue.length !== rightValue.length) {
      return false;
    }

    return leftValue.every((value, index) => value === rightValue[index]);
  });
};

type Props = {
  variations: ProductInfoCustomizationSection[];
  addons: ProductInfoCustomizationSection[];
};

export default function useProductSelectionState({ variations, addons }: Props) {
  const variationOptions = useMemo(() => buildVariationOptions(variations), [variations]);
  const addonSections = useMemo(() => buildSelectableSections(addons), [addons]);
  const [selectedVariationKey, setSelectedVariationKey] = useState<string | null>(
    () =>
      variationOptions[0]
        ? `${variationOptions[0].groupId}:${variationOptions[0].optionId}`
        : null,
  );
  const [selectedAddonOptionIdsByGroup, setSelectedAddonOptionIdsByGroup] =
    useState<Record<string, string[]>>({});

  useEffect(() => {
    setSelectedVariationKey((current) => {
      if (variationOptions.length === 0) {
        return null;
      }

      if (
        current &&
        variationOptions.some(
          (option) => `${option.groupId}:${option.optionId}` === current,
        )
      ) {
        return current;
      }

      const firstVariation = variationOptions[0];
      return firstVariation
        ? `${firstVariation.groupId}:${firstVariation.optionId}`
        : null;
    });
  }, [variationOptions]);

  useEffect(() => {
    setSelectedAddonOptionIdsByGroup((current) => {
      const next: Record<string, string[]> = {};

      addonSections.forEach((section) => {
        const validOptionIds = new Set(section.options.map((option) => option.optionId));
        const currentSelections = current[section.groupId] ?? [];
        const nextSelections = currentSelections.filter((optionId) =>
          validOptionIds.has(optionId),
        );

        if (nextSelections.length > 0) {
          next[section.groupId] = nextSelections;
        }
      });

      return areStringArrayMapsEqual(current, next) ? current : next;
    });
  }, [addonSections]);

  const selectedVariation = useMemo(
    () =>
      variationOptions.find(
        (option) => `${option.groupId}:${option.optionId}` === selectedVariationKey,
      ) ?? null,
    [selectedVariationKey, variationOptions],
  );

  const variationHelperText = useMemo(
    () => variationOptions.find((option) => option.helperText)?.helperText ?? null,
    [variationOptions],
  );

  const selectedVariationPrice = useMemo(
    () => selectedVariation?.price ?? 0,
    [selectedVariation],
  );

  const selectedAddonsTotal = useMemo(
    () =>
      addonSections.reduce((sum, section) => {
        const selectedOptionIds = selectedAddonOptionIdsByGroup[section.groupId] ?? [];

        return (
          sum +
          section.options.reduce(
            (sectionSum, option) =>
              selectedOptionIds.includes(option.optionId)
                ? sectionSum + option.price
                : sectionSum,
            0,
          )
        );
      }, 0),
    [addonSections, selectedAddonOptionIdsByGroup],
  );

  const cartSelectionInputs = useMemo<CartSelectionInput[]>(
    () => [
      ...(selectedVariation
        ? [
            {
              groupId: selectedVariation.groupId,
              optionId: selectedVariation.optionId,
            },
          ]
        : []),
      ...Object.entries(selectedAddonOptionIdsByGroup).flatMap(([groupId, optionIds]) =>
        optionIds.map((optionId) => ({
          groupId,
          optionId,
        })),
      ),
    ],
    [selectedAddonOptionIdsByGroup, selectedVariation],
  );

  const selectVariationOption = useCallback((groupId: string, optionId: string) => {
    setSelectedVariationKey(`${groupId}:${optionId}`);
  }, []);

  const toggleAddonOption = useCallback((groupId: string, optionId: string) => {
    setSelectedAddonOptionIdsByGroup((current) => {
      const currentSelections = current[groupId] ?? [];
      const section = addonSections.find((item) => item.groupId === groupId);

      if (!section) {
        return current;
      }

      const nextSelections =
        section.selectionType === "single"
          ? currentSelections.includes(optionId)
            ? []
            : [optionId]
          : currentSelections.includes(optionId)
            ? currentSelections.filter((itemId) => itemId !== optionId)
            : [...currentSelections, optionId];

      const nextState =
        nextSelections.length > 0
          ? {
              ...current,
              [groupId]: nextSelections,
            }
          : Object.fromEntries(
              Object.entries(current).filter(([key]) => key !== groupId),
            );

      return areStringArrayMapsEqual(current, nextState) ? current : nextState;
    });
  }, [addonSections]);

  return {
    addonSections,
    cartSelectionInputs,
    selectedAddonsTotal,
    selectedAddonOptionIdsByGroup,
    selectedVariation,
    selectedVariationPrice,
    selectedVariationKey,
    selectVariationOption,
    toggleAddonOption,
    variationHelperText,
    variationOptions,
  };
}
