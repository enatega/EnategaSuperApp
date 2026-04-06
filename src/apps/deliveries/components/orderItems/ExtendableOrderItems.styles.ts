import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  compactSection: {
    gap: 12,
    paddingBottom: 12,
    paddingTop: 16,
  },
  countBadge: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  countBadgeCompact: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  expandedContent: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
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
  previewImageCompact: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  separator: {
    height: 1,
    marginVertical: 14,
  },
  staticContent: {
    paddingTop: 2,
  },
  trackingHeader: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 2,
    paddingTop: 4,
  },
  trackingHeaderCompact: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  trackingWrapper: {
    paddingVertical: 0,
  },
});
