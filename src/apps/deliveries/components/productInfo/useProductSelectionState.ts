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

const buildDefaultSingleSelections = (sections: ProductSelectionSection[]) =>
  sections.reduce<Record<string, string>>((current, section) => {
    if (section.selectionType === "single" && section.required && section.options[0]) {
      current[section.groupId] = section.options[0].optionId;
    }

    return current;
  }, {});

const areStringMapsEqual = (
  left: Record<string, string>,
  right: Record<string, string>,
) => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => left[key] === right[key]);
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
  const variationSections = useMemo(
    () => buildSelectableSections(variations),
    [variations],
  );
  const addonSections = useMemo(() => buildSelectableSections(addons), [addons]);
  const [selectedVariationOptionIdsByGroup, setSelectedVariationOptionIdsByGroup] =
    useState<Record<string, string>>(() => buildDefaultSingleSelections(variationSections));
  const [selectedAddonOptionIdsByGroup, setSelectedAddonOptionIdsByGroup] =
    useState<Record<string, string[]>>({});

  useEffect(() => {
    setSelectedVariationOptionIdsByGroup((current) => {
      const nextSelections = { ...buildDefaultSingleSelections(variationSections) };

      variationSections.forEach((section) => {
        const currentOptionId = current[section.groupId];
        const hasCurrentOption = section.options.some(
          (option) => option.optionId === currentOptionId,
        );

        if (hasCurrentOption && currentOptionId) {
          nextSelections[section.groupId] = currentOptionId;
        }
      });

      return areStringMapsEqual(current, nextSelections) ? current : nextSelections;
    });
  }, [variationSections]);

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

  const selectedVariationPrice = useMemo(() => {
    return variationSections.reduce((sum, section) => {
      const selectedOptionId = selectedVariationOptionIdsByGroup[section.groupId];
      const selectedOption = section.options.find(
        (option) => option.optionId === selectedOptionId,
      );

      return sum + (selectedOption?.price ?? 0);
    }, 0);
  }, [selectedVariationOptionIdsByGroup, variationSections]);

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
      ...Object.entries(selectedVariationOptionIdsByGroup)
        .filter(([, optionId]) => optionId.length > 0)
        .map(([groupId, optionId]) => ({
          groupId,
          optionId,
        })),
      ...Object.entries(selectedAddonOptionIdsByGroup).flatMap(([groupId, optionIds]) =>
        optionIds.map((optionId) => ({
          groupId,
          optionId,
        })),
      ),
    ],
    [selectedAddonOptionIdsByGroup, selectedVariationOptionIdsByGroup],
  );

  const selectVariationOption = useCallback((groupId: string, optionId: string) => {
    setSelectedVariationOptionIdsByGroup((current) => ({
      ...current,
      [groupId]: optionId,
    }));
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
    selectedVariationPrice,
    selectedVariationOptionIdsByGroup,
    selectVariationOption,
    toggleAddonOption,
    variationSections,
  };
}
