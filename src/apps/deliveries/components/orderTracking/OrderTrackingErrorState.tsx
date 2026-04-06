import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../../../../general/components/Button";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  isRetrying?: boolean;
  onRetry: () => void;
};

export default function OrderTrackingErrorState({
  isRetrying = false,
  onRetry,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: colors.backgroundTertiary,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons color={colors.primary} name="cloud-offline-outline" size={28} />
      </View>

      <Text color={colors.text} style={styles.title} weight="extraBold">
        {t("order_tracking_error_title")}
      </Text>

      <Button
        isLoading={isRetrying}
        label={t("generic_list_retry")}
        onPress={onRetry}
        style={styles.retryButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
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
  retryButton: {
    marginTop: 16,
    minWidth: 160,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
  },
});
