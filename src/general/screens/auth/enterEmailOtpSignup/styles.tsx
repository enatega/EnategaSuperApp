import { StyleSheet } from "react-native";

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    centerContent: {
      flex: 1,
      paddingHorizontal: 16,
      gap: 18,
      alignItems: 'center'
    }
  });

export default useStyles;
