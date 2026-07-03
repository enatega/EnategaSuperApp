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
  const { colors, typography } = useTheme();
  const secondaryButtonStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  } as const;
  const labelStyle = {
    fontSize: typography.size.md2,
    lineHeight: typography.lineHeight.md2,
  } as const;
  const shouldUseTwoColumnLayout = shouldShowTrackProgress && shouldShowOrderAgain;

  return (
    <View style={styles.container}>
      {/* {onIncreaseTip ? (
        <Button
          label={t("order_details_increase_tip")}
          onPress={onIncreaseTip}
          style={secondaryButtonStyle}
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
          style={secondaryButtonStyle}
          labelStyle={labelStyle}
          variant="secondary"
        />
      ) : null}
      <View style={shouldUseTwoColumnLayout ? styles.row : styles.stack}>
        {shouldShowOrderAgain ? (
          <Button
            isLoading={isOrderAgainLoading}
            label={t("order_details_order_again")}
            onPress={onOrderAgain}
            style={[
              shouldUseTwoColumnLayout ? styles.rowButton : styles.primaryButton,
              secondaryButtonStyle,
            ]}
            labelStyle={labelStyle}
            variant="secondary"
          />
        ) : null}
        {shouldShowTrackProgress ? (
          <Button
            label={t("order_details_track_progress")}
            onPress={() =>
              navigation.navigate("OrderTrackingScreen", { orderId })
            }
            style={shouldUseTwoColumnLayout ? styles.rowButton : undefined}
            labelStyle={labelStyle}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 24,
    paddingTop: 8,
  },
  primaryButton: {
    marginTop: 0,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowButton: {
    flex: 1,
  },
  stack: {
    gap: 12,
  },
});
