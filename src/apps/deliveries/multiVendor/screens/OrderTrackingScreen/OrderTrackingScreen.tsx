import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainContainer from "../../components/orderTracking/MainContainer";
import type { MultiVendorStackParamList } from "../../navigation/types";
import type { DeliveriesStackParamList } from "../../../navigation/types";

type OrderTrackingNavigationParamList =
  DeliveriesStackParamList & MultiVendorStackParamList;

type Props = NativeStackScreenProps<
  MultiVendorStackParamList,
  "OrderTrackingScreen"
>;

export default function OrderTrackingScreen({ navigation, route }: Props) {
  return (
    <MainContainer
      navigation={
        navigation as NativeStackScreenProps<
          OrderTrackingNavigationParamList,
          "OrderTrackingScreen"
        >["navigation"]
      }
      orderId={route.params.orderId}
    />
  );
}
