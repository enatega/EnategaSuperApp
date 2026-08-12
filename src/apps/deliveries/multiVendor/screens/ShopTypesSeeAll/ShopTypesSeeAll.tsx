import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../../../general/theme/theme";
import ScreenHeader from "../../../../../general/components/ScreenHeader";
import ShopTypesSeeAllContainer from "../../components/ShopTypesSeeAll/ShopTypesSeeAllContainer";
import { useTranslation } from "react-i18next";

export default function ShopTypesSeeAll() {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");
  const navigation = useNavigation();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        showBack={navigation.canGoBack()}
        title={t("multi_vendor_shop_types_title")}
      />
      <ShopTypesSeeAllContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
