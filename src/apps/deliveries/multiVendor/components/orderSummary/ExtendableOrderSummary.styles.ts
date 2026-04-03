import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  expandedPanel: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
