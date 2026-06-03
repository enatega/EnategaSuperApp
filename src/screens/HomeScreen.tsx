import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../general/theme/theme";
import type { SelectMiniAppFn } from "../apps/registry/homeSections/types";
import { authSession } from "../general/auth/authSession";
import { resetToSharedRoute } from "../general/navigation/rootNavigation";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SharedStackParamList } from "../general/navigation/navigationTypes";

type Props = {
  onSelectMiniApp?: SelectMiniAppFn;
};

export default function HomeScreen({
  onSelectMiniApp: _onSelectMiniApp,
}: Props) {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<SharedStackParamList, "Home">>();

  useEffect(() => {
    void handleInitialDeliveriesRedirect();
  }, []);

  async function handleInitialDeliveriesRedirect() {
    const token = await authSession.getAccessToken();

    if (token) {
      resetToSharedRoute("Deliveries");
      return;
    }

    navigation.replace("Auth");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
