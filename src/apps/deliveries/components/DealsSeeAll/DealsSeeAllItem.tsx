import React from "react";
import type { DeliveryDealItem } from "../../api/dealsServiceTypes";
import StoreMenuProductCard from "../productCard/StoreMenuProductCard";
import type { ProductCardControlState } from "../productCard/types";

type Props = {
  item: DeliveryDealItem;
  onPress: (deal: DeliveryDealItem) => void;
};

export default function DealsSeeAllItem({ item, onPress }: Props) {
  const state = React.useMemo<ProductCardControlState>(
    () => ({
      controlCount: 0,
      controlMode: "add",
      handleAdd: () => onPress(item),
      handleDecrement: undefined,
      handleIncrement: undefined,
      isDisabled: false,
      shouldShowCountBadge: false,
      totalQuantity: 0,
    }),
    [item, onPress],
  );

  return (
    <StoreMenuProductCard
      onPress={() => onPress(item)}
      product={item}
      state={state}
    />
  );
}
