import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  countBadge: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  expandedContent: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  metaText: {
    letterSpacing: 0,
  },
  previewGroup: {
    alignItems: "center",
    flexDirection: "row",
    minWidth: 36,
  },
  previewImage: {
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36,
  },
  separator: {
    height: 1,
    marginVertical: 12,
  },
  trackingHeader: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
  trackingWrapper: {
    paddingVertical: 0,
  },
});
