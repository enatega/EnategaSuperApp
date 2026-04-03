import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "../../../../../general/components/Skeleton";

const SKELETON_ROWS = 4;

const OrderListSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton
        width={180}
        height={28}
        borderRadius={8}
      />
      <View style={styles.list}>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <View
            key={index}
            style={styles.row}
          >
            <Skeleton
              width={48}
              height={48}
              borderRadius={8}
            />
            <View style={styles.info}>
              <Skeleton
                width="58%"
                height={20}
                borderRadius={6}
              />
              <Skeleton
                width="40%"
                height={14}
                borderRadius={6}
              />
              <Skeleton
                width={76}
                height={22}
                borderRadius={6}
              />
            </View>
            <View style={styles.trailing}>
              <Skeleton
                width={68}
                height={18}
                borderRadius={6}
              />
              <Skeleton
                width={24}
                height={24}
                borderRadius={12}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default OrderListSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  list: {
    gap: 16,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  trailing: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },
});
