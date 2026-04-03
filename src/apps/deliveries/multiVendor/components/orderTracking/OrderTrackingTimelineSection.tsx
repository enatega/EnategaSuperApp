import React from "react";
import { StyleSheet, View } from "react-native";
import type { DeliveryOrderTimelineItem } from "../../../api/ordersServiceTypes";
import {
  formatCompletedTime,
  getTimelineTone,
} from "../../utils/orderTracking/orderTrackingUtils";
import OrderTrackingTimelineItem from "./OrderTrackingTimelineItem";

type Props = {
  timeline: DeliveryOrderTimelineItem[];
};

export default function OrderTrackingTimelineSection({ timeline }: Props) {
  return (
    <View style={styles.container}>
      {timeline.map((item, index) => (
        <OrderTrackingTimelineItem
          completedAt={formatCompletedTime(item.completedAt)}
          isLastItem={index === timeline.length - 1}
          key={`${item.key}-${index}`}
          stepKey={item.key}
          title={item.title}
          tone={getTimelineTone(item)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
  },
});
