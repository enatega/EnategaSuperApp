import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  handle: {
    borderRadius: 999,
    height: 4,
    width: 48,
  },
  handleWrapper: {
    alignItems: "center",
    paddingTop: 10,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerSide: {
    width: 40,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  inputContainer: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  presetButton: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
});
