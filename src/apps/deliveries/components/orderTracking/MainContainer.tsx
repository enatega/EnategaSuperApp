import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { showToast } from "../../../../general/components/AppToast";
import { useDeliveriesOrderTrackingVariant } from "../../../../general/stores/useAppConfigStore";
import type { DeliveriesStackParamList } from "../../navigation/types";
import { resolveOrderTrackingVariant } from "../../config/orderTrackingVariant";
import OrderTrackingModernView from "./OrderTrackingModernView";
import OrderTrackingLegacyView from "./OrderTrackingLegacyView";
import { useOrderTrackingViewModel } from "./useOrderTrackingViewModel";

type Props = {
  navigation: NativeStackNavigationProp<
    DeliveriesStackParamList,
    "OrderTrackingScreen"
  >;
  orderId: string;
};

export default function MainContainer({ navigation, orderId }: Props) {
  const { t } = useTranslation("deliveries");

  const configVariant = useDeliveriesOrderTrackingVariant();
  const viewModel = useOrderTrackingViewModel({
    navigation,
    onMissingReceiver: () => showToast.error(t("rider_chat_missing_receiver_error")),
    orderId,
  });
  const variant = resolveOrderTrackingVariant(configVariant);

  if (variant === "modern") {
    return <OrderTrackingModernView viewModel={viewModel} />;
  }

  return <OrderTrackingLegacyView viewModel={viewModel} />;
}
