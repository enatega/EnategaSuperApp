import React from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import { useTheme } from "../theme/theme";

export const useToastConfig = (): ToastConfig => {
  const { colors } = useTheme();

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success || "#00C851",
          backgroundColor: colors.background,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          color: colors.text,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.danger || "#FF4444",
          backgroundColor: colors.background,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          color: colors.text,
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.primary,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          color: colors.text,
        }}
      />
    ),
  };
};

export const AppToast = () => {
  const toastConfig = useToastConfig();
  return <Toast config={toastConfig} />;
};

export const showToast = {
  success: (text1: string, text2?: string) => {
    Toast.show({
      type: "success",
      text1,
      text2,
    });
  },
  error: (text1: string, text2?: string) => {
    Toast.show({
      type: "error",
      text1,
      text2,
    });
  },
  info: (text1: string, text2?: string) => {
    Toast.show({
      type: "info",
      text1,
      text2,
    });
  },
};

export default AppToast;
