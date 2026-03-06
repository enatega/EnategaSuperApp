import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    scrollView: {
      flex: 1,
    },
    centerContent: {
      flexGrow: 1,
      gap: 18,
      padding: 16
    },
  });

export default useStyles;
