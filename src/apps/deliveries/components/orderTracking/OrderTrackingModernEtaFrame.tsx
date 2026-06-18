import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryOrderStatus } from "../../api/ordersServiceTypes";

type Props = {
  etaLabel: string;
  status: DeliveryOrderStatus;
  showDeliveredTitle: boolean;
};

const ETA_FRAME_STEP_IMAGES = {
  step1: require("../../assets/images/step-1.png"),
  step2: require("../../assets/images/step-2.png"),
  step3: require("../../assets/images/step-3.png"),
  step4: require("../../assets/images/step-4.png"),
} as const;

function getEtaFrameStepImage(status: DeliveryOrderStatus) {
  if (status === "delivered") {
    return ETA_FRAME_STEP_IMAGES.step4;
  }

  if (
    status === "picked_up" ||
    status === "out_for_delivery" ||
    status === "arrived"
  ) {
    return ETA_FRAME_STEP_IMAGES.step3;
  }

  if (
    status === "preparing" ||
    status === "ready" ||
    status === "rider_assigned"
  ) {
    return ETA_FRAME_STEP_IMAGES.step2;
  }

  return ETA_FRAME_STEP_IMAGES.step1;
}

export default function OrderTrackingModernEtaFrame({
  etaLabel,
  status,
  showDeliveredTitle,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.etaContainer,{ backgroundColor: colors.surface }]}>
      <View style={[styles.etaOuter, { backgroundColor:
    colors.border, borderColor: colors.border }]}>
        <Image
          resizeMode='cover'
          source={getEtaFrameStepImage(status)}
          style={styles.etaOuter}
        />
        <View style={[styles.etaInner, { backgroundColor: colors.surface }]}>
          <Text color={colors.text} style={styles.etaText} weight="bold">
            {etaLabel}
          </Text>
          {!showDeliveredTitle ? (
            <Text
              color={colors.mutedText}
              style={styles.etaSubText}
              weight="medium"
            >
              Until Delivered
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  etaFrameImage: {
    position: "absolute",
    right: 0,
    height: '50%',
    width: '50%',
  },
  etaInner: {
    alignItems: "center",
    borderColor: "#9CA3AF",
    borderRadius: 8,
    borderWidth: 1,
    height: 82,
    justifyContent: "center",
    left: 16,
    position: "absolute",
    top: 14,
    width: 190,
    zIndex: 2,
  },
   etaContainer: {
    alignItems: "center",
    
   padding: 12,
   borderRadius: 32,
  },
  etaOuter: {
    // alignItems: "center",
    height: 113,
    // justifyContent: "center",
    overflow: "hidden",
    // position: "relative",
    width: 222,
    // borderWidth: 1,
    borderRadius: 24,
    
    

  },
  etaSubText: {
    fontSize: 14,
    lineHeight: 22,
  },
  etaText: {
    fontSize: 24,
    letterSpacing: -0.36,
    lineHeight: 28,
  },
});
