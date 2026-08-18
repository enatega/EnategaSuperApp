import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";


import Button from "../../../../general/components/Button";
import type { DeliveriesStackParamList } from "../../navigation/types";


type Props = {
  navigation: NativeStackNavigationProp<
    DeliveriesStackParamList,
    "OrderDetailsScreen"
  >;
  shouldShowRateOrder: boolean;
  shouldShowTrackProgress: boolean;
  shouldShowOrderAgain: boolean;
  onIncreaseTip?: () => void;
  orderId: string;
  storeName: string;
  isOrderAgainLoading?: boolean;
  onOrderAgain: () => void;
};

export default function OrderDetailsActionsSection({
  navigation,
  shouldShowRateOrder,
  shouldShowTrackProgress,
  shouldShowOrderAgain,
  onIncreaseTip,
  isOrderAgainLoading = false,
  onOrderAgain,
  orderId,
  storeName,
}: Props) {
  const { t } = useTranslation("deliveries");

  return (
    <View style={styles.container}>
      {/* {onIncreaseTip ? (
        <Button
          label={t("order_details_increase_tip")}
          onPress={onIncreaseTip}
          variant="secondary"
        />
      ) : null} */}

      {shouldShowRateOrder ? (
        <Button
          label={t("order_details_rate_order")}
          onPress={() => {
            navigation.navigate("RateOrder", {
              orderId,
              storeName,
            });
          }}
          variant="secondary"
        />
      ) : null}
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
          isLoading={isOrderAgainLoading}
          label={t("order_details_order_again")}
          onPress={onOrderAgain}
          style={styles.primaryButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 24,
    paddingTop: 16,
  },
  primaryButton: {
    marginTop: 4,
  },
});
