import * as AppleAuthentication from "expo-apple-authentication";
import React from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { useAppleLogin } from "../../hooks/useAuthMutations";
import { getPendingAppRoute } from "../../navigation/pendingAppRedirect";
import { showToast } from "../AppToast";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme/theme";
import { getExpoPushTokenForAuth } from "../../services/notifications/expoPushTokenService";
import type { ApiError } from "../../api/apiClient";

function formatAppleName(
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
) {
  if (!fullName) {
    return null;
  }

  const parts = [
    fullName.givenName,
    fullName.middleName,
    fullName.familyName,
  ].filter((value): value is string => Boolean(value?.trim()));

  if (parts.length === 0) {
    return null;
  }

  return parts.join(" ");
}

const AppleLogin = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isAvailable, setIsAvailable] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }

    let isMounted = true;

    const loadAvailability = async () => {
      try {
        const available = await AppleAuthentication.isAvailableAsync();

        if (isMounted) {
          setIsAvailable(available);
        }
      } catch {
        if (isMounted) {
          setIsAvailable(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

  const resolveAppleLoginErrorMessage = (error: ApiError | Error | unknown) => {
    const apiError = error as ApiError | undefined;
    const message =
      typeof apiError?.message === "string" && apiError.message.trim()
        ? apiError.message
        : "Apple sign in failed. Please try again.";

    if (apiError?.status === 400) {
      return message;
    }

    if (apiError?.status === 401 || apiError?.status === 403) {
      return message || "Your account is blocked or inactive.";
    }

    if (apiError?.status === 0) {
      return "Network error. Please check your connection and try again.";
    }

    return message;
  };

  const appleLoginMutation = useAppleLogin({
    onSuccess: async () => {
      showToast.success("Success!", "Logged in successfully.");
      const pendingRoute = await getPendingAppRoute();

      if (!pendingRoute) {
        navigation.navigate("Main" as never);
      }
    },
    onError: (error) => {
      showToast.error("Error!", resolveAppleLoginErrorMessage(error));
    },
  });

  const handleAppleLogin = async () => {
    if (appleLoginMutation.isPending) {
      return;
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        showToast.error(
          "Error!",
          "Unable to verify your Apple account. Please try again.",
        );
        return;
      }

      const devicePushToken = await getExpoPushTokenForAuth();

      appleLoginMutation.mutate({
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode ?? undefined,
        appleUser: credential.user,
        email: credential.email ?? undefined,
        name: formatAppleName(credential.fullName) ?? undefined,
        user_type: "Customer",
        device_push_token: devicePushToken ?? undefined,
      });
    } catch (error: any) {
      if (error?.code === "ERR_REQUEST_CANCELED") {
        return;
      }

      showToast.error(
        "Error!",
        error?.message || "Apple sign in failed. Please try again.",
      );
    }
  };

  if (Platform.OS !== "ios" || !isAvailable) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        cornerRadius={10}
        onPress={handleAppleLogin}
        style={styles.button}
      />
      {appleLoginMutation.isPending ? (
        <View pointerEvents="none" style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.onPrimary} size="small" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  button: {
    width: "100%",
    height: 48,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default AppleLogin;
