import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  addonList: {
    gap: 2,
  },
  addonText: {
    letterSpacing: 0,
  },
  chevronButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  container: {
    flexDirection: "row",
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  image: {
    borderRadius: 8,
    height: 49,
    width: 56,
  },
  imageFallback: {
    alignItems: "center",
    borderRadius: 8,
    height: 49,
    justifyContent: "center",
    width: 56,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    letterSpacing: 0,
  },
  subtitle: {
    letterSpacing: 0,
  },
  subtitleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  divider: {
    height: 1,
  },
});
