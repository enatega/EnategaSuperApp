import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductInfoCustomizationSection } from "../../api/productInfoServiceTypes";

type AddonSelectableItem = {
  id: string;
  label: string;
  price: number;
};

const buildAddonSelectableItems = (
  addons: ProductInfoCustomizationSection[],
): AddonSelectableItem[] =>
  addons.flatMap((section) => {
    if (section.options.length > 0) {
      return section.options.map((option) => ({
        id: option.optionId,
        label: option.title,
        price: option.price,
      }));
    }

    return [
      {
        id: section.groupId,
        label: section.name,
        price: section.price ?? 0,
      },
    ];
  });

type Props = {
  variations: ProductInfoCustomizationSection[];
  addons: ProductInfoCustomizationSection[];
};

export default function useProductSelectionState({ variations, addons }: Props) {
  const [selectedVariationId, setSelectedVariationId] = useState(
    variations[0]?.groupId ?? "",
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  const addonItems = useMemo(() => buildAddonSelectableItems(addons), [addons]);

  useEffect(() => {
    if (variations.length === 0) {
      return;
    }

    const hasSelectedVariation = variations.some(
      (variation) => variation.groupId === selectedVariationId,
    );

    if (!hasSelectedVariation) {
      setSelectedVariationId(variations[0]?.groupId ?? "");
    }
  }, [selectedVariationId, variations]);

  useEffect(() => {
    setSelectedAddonIds((current) => {
      const validIds = new Set(addonItems.map((item) => item.id));
      const next = current.filter((id) => validIds.has(id));

      return next.length === current.length ? current : next;
    });
  }, [addonItems]);

  const selectedVariationPrice = useMemo(() => {
    const selectedVariation = variations.find(
      (variation) => variation.groupId === selectedVariationId,
    );

    return selectedVariation?.price ?? 0;
  }, [selectedVariationId, variations]);

  const selectedAddonsTotal = useMemo(
    () =>
      addonItems.reduce(
        (sum, item) => (selectedAddonIds.includes(item.id) ? sum + item.price : sum),
        0,
      ),
    [addonItems, selectedAddonIds],
  );

  const toggleAddon = useCallback((id: string) => {
    setSelectedAddonIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  }, []);

  return {
    addonItems,
    selectedAddonIds,
    selectedAddonsTotal,
    selectedVariationId,
    selectedVariationPrice,
    setSelectedVariationId,
    toggleAddon,
  };
}
