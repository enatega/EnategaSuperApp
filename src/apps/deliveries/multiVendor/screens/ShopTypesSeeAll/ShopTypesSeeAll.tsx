import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../../../general/theme/theme";
import ScreenHeader from "../../../../../general/components/ScreenHeader";
import ShopTypesSeeAllContainer from "../../components/ShopTypesSeeAll/ShopTypesSeeAllContainer";

export default function ShopTypesSeeAll() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader showBack={navigation.canGoBack()} />
      <ShopTypesSeeAllContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 6,
  },
  screen: { flex: 1 },
});
