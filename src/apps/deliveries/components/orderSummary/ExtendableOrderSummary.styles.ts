import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  expandedPanel: {
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 16,
  },
  footerBar: {
    gap: 6,
    paddingBottom: 0,
    paddingTop: 12,
  },
  footerBarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerBarTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  footerContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  footerExpandedPanel: {
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingTop: 12,
  },
  footer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 2,
    paddingTop: 4,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingTop: 8,
  },
  staticContent: {
    gap: 14,
    paddingTop: 2,
  },
});
