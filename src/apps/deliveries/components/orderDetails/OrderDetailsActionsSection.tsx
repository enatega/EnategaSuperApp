import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";


import Button from "../../../../general/components/Button";
import { useTheme } from "../../../../general/theme/theme";
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
};

export default function OrderDetailsActionsSection({
  navigation,
  shouldShowRateOrder,
  shouldShowTrackProgress,
  shouldShowOrderAgain,
  onIncreaseTip,
  orderId,
  storeName,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  const secondaryButtonStyle = {
    backgroundColor: colors.blue50,
    borderColor: colors.blue50,
  } as const;

  return (
    <View style={styles.container}>
      {onIncreaseTip ? (
        <Button
          label={t("order_details_increase_tip")}
          onPress={onIncreaseTip}
          style={secondaryButtonStyle}
        />
      ) : null}
    
      {shouldShowRateOrder ? (
        <Button
          label={t("order_details_rate_order")}
          onPress={() => {
            navigation.navigate("RateOrder", {
              orderId,
              storeName,
            });
          }}
          style={secondaryButtonStyle}
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
          label={t("order_details_order_again")}
          onPress={() => undefined}
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
