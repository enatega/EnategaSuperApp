import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainContainer from "../../components/orderDetails/MainContainer";
import type { MultiVendorStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<
  MultiVendorStackParamList,
  "OrderDetailsScreen"
>;

export default function OrderDetailsScreen({ navigation, route }: Props) {
  return (
    <MainContainer navigation={navigation} orderId={route.params.orderId} />
  );
}
