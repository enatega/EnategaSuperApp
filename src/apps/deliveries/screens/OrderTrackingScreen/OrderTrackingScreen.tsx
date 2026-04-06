import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainContainer from '../../components/orderTracking/MainContainer';
import type { DeliveriesStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<
  DeliveriesStackParamList,
  'OrderTrackingScreen'
>;

export default function OrderTrackingScreen({ navigation, route }: Props) {
  return (
    <MainContainer
      navigation={navigation}
      orderId={route.params.orderId}
    />
  );
}
