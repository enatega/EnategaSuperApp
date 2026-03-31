import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ScreenHeader from "../../../../general/components/ScreenHeader";
import Text from "../../../../general/components/Text";
import Button from "../../../../general/components/Button";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  isRetrying?: boolean;
  onRetry: () => void;
};

export default function ProductInfoErrorState({
  isRetrying = false,
  onRetry,
}: Props) {
  const { t } = useTranslation("deliveries");
  const navigation = useNavigation();
  const { colors } = useTheme();
  const title = t("product_info_error_title");
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader variant="close" />
      <View style={styles.content}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: colors.backgroundTertiary,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            color={colors.primary}
            name={"cloud-offline-outline"}
            size={28}
          />
        </View>

        <Text color={colors.text} style={styles.title} weight="extraBold">
          {title}
        </Text>

        <View style={styles.actions}>
          <Button
            isLoading={isRetrying}
            label={t("generic_list_retry")}
            onPress={onRetry}
            style={styles.primaryAction}
          />
          <Button
            label={t("store_details_action_back")}
            onPress={() => navigation.goBack()}
            style={styles.secondaryAction}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  description: {
    lineHeight: 22,
    textAlign: "center",
  },
  iconWrapper: {
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
    width: 56,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
});
