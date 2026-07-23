import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "../../../../general/components/Skeleton";

export default function AppointmentsCouponsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton borderRadius={8} height={48} width="100%" />
      {[0, 1].map((item) => (
        <Skeleton key={item} borderRadius={14} height={184} width="100%" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, paddingHorizontal: 16, paddingTop: 12 },
});
