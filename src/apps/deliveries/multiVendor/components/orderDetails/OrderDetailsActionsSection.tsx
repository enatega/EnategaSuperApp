import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Button from "../../../../../general/components/Button";
import { useTheme } from "../../../../../general/theme/theme";
import type { DeliveryOrderSummary } from "../../../api/ordersServiceTypes";
import type { MultiVendorStackParamList } from "../../navigation/types";
import { View } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<
    MultiVendorStackParamList,
    "OrderDetailsScreen"
  >;
  shouldShowRateOrder: boolean;
  shouldShowTrackProgress: boolean;
  shouldShowOrderAgain: boolean;
  orderId: string;
  paymentMethod: string;
  storeName: string;
  summary: DeliveryOrderSummary;
};

export default function OrderDetailsActionsSection({
  navigation,
  shouldShowRateOrder,
  shouldShowTrackProgress,
  shouldShowOrderAgain,
  orderId,
  paymentMethod,
  storeName,
  summary,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();

  return (
    <View style={{ gap: 8}}>
      {shouldShowRateOrder ? (
        <Button
          label={t("order_details_rate_order")}
          onPress={() => {
            navigation.navigate("RateOrder", {
              orderId,
              storeName,
            });
          }}
          style={{
            marginTop: 4,
            backgroundColor: colors.blue100,
            borderColor: colors.blue100,
          }}
        />
      ) : null}
      {/* Todo: can show the increase tip section in future */}
      {/* <Button
        label={t("order_details_increase_tip")}
        onPress={() => undefined}
        style={{
          marginTop: 4,
          backgroundColor: colors.blue100,
          borderColor: colors.blue100,
        }}
      /> */}
      {shouldShowTrackProgress ? (
        <Button
          label={t("order_details_track_progress")}
          onPress={() =>
            navigation.navigate("OrderTrackingScreen", { orderId })
          }
        />
      ) : null}
      {shouldShowOrderAgain ? (
        <Button
          label={t("order_details_order_again")}
          onPress={() => undefined}
        />
      ) : null}
    </View>
  );
}
