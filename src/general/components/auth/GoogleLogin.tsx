import React from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useGoogleLogin } from "../../hooks/useAuthMutations";
import { showToast } from "../AppToast";
import { useNavigation } from "@react-navigation/native";
import Button from "../Button";
import Svg from "../Svg";
import { useTheme } from "../../theme/theme";
import { useTranslation } from "react-i18next";

const clientId =
  process.env.IOS_CLIENT_ID ||
  "94983896797-o070lskua876d5u5cpu482e256pejgd8.apps.googleusercontent.com";
GoogleSignin.configure({
  iosClientId: clientId,
});

const GoogleLogin = () => {
  const { colors } = useTheme();
  const { t } = useTranslation("general");
  const navigation = useNavigation();

  const googleLoginMutation = useGoogleLogin({
    onSuccess: () => {
      showToast.success("Success!", "Logged in successfully.");
      navigation.navigate("Main" as never);
    },
    onError: (error) => {
      showToast.error("Error!", error?.message);
      console.log("🚀 ~ GoogleLogin ~ error?.message:", error?.message);
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("🚀 ~ handleGoogleLogin ~ userInfo:", userInfo);

      if (userInfo.data?.idToken) {
        googleLoginMutation.mutate({
          idToken: userInfo.data.idToken,
          user_type_id: "1",
          device_push_token: "",
        });
      }
    } catch (error: any) {
      if (error.code !== "SIGN_IN_CANCELLED") {
        showToast.error("Error!", error?.message || "Google sign in failed");
      }
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
