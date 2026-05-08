import React from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useGoogleLogin } from "../../hooks/useAuthMutations";
import { getPendingAppRoute } from "../../navigation/pendingAppRedirect";
import { showToast } from "../AppToast";
import { useNavigation } from "@react-navigation/native";
import Button from "../Button";
import Svg from "../Svg";
import { useTheme } from "../../theme/theme";
import { useTranslation } from "react-i18next";
import type { ApiError } from "../../api/apiClient";
import { getExpoPushTokenForAuth } from "../../services/notifications/expoPushTokenService";

const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const webClientId =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  ?? process.env.EXPO_PUBLIC_ANDROID_OAUTH_CLIENT_ID;

GoogleSignin.configure({
  iosClientId,
  webClientId,
});

const GoogleLogin = () => {
  const { colors } = useTheme();
  const { t } = useTranslation("general");
  const navigation = useNavigation();

  const resolveGoogleLoginErrorMessage = (error: ApiError | Error | unknown) => {
    const apiError = error as ApiError | undefined;
    const message =
      typeof apiError?.message === "string" && apiError.message.trim()
        ? apiError.message
        : t("something_went_wrong");

    if (apiError?.status === 400) {
      return message || "Invalid Google token or unsupported user type.";
    }

    if (apiError?.status === 401) {
      return message || "Your account is blocked or inactive.";
    }

    if (apiError?.status === 0) {
      return "Network error. Please check your connection and try again.";
    }

    return message;
  };

  const googleLoginMutation = useGoogleLogin({
    onSuccess: async () => {
      showToast.success("Success!", "Logged in successfully.");
      const pendingRoute = await getPendingAppRoute();

      if (!pendingRoute) {
        navigation.navigate("Main" as never);
      }
    },
    onError: (error) => {
      showToast.error("Error!", resolveGoogleLoginErrorMessage(error));
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        showToast.error("Error!", "Unable to fetch Google token. Please try again.");
        return;
      }

      const devicePushToken = await getExpoPushTokenForAuth();

      googleLoginMutation.mutate({
        idToken,
        user_type: "Customer",
        device_push_token: devicePushToken ?? undefined,
      });
    } catch (error: any) {
      if (error?.code === "SIGN_IN_CANCELLED") return;
      if (error?.code === "IN_PROGRESS") return;

      showToast.error(
        "Error!",
        error?.message || "Google sign in failed. Please try again.",
      );
    }
  };

  return (
    <Button
      variant="secondary"
      icon={<Svg name="google" height={20} width={20} />}
      label={t("continue_with_google")}
      style={{ backgroundColor: colors.backgroundTertiary }}
      onPress={handleGoogleLogin}
      isLoading={googleLoginMutation.isPending}
      disabled={googleLoginMutation.isPending}
    />
  );
};

export default GoogleLogin;
