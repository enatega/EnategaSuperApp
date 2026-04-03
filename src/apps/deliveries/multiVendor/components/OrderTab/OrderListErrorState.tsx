import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Button from "../../../../../general/components/Button";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";

type Props = {
  title: string;
  retryLabel: string;
  isRetrying?: boolean;
  onRetry: () => void;
};

const OrderListErrorState = ({
  title,
  retryLabel,
  isRetrying = false,
  onRetry,
}: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            name="cloud-offline-outline"
            size={28}
          />
        </View>

        <Text
          color={colors.text}
          style={styles.title}
          weight="medium"
        >
          {title}
        </Text>

        <Button
          isLoading={isRetrying}
          label={retryLabel}
          onPress={onRetry}
          style={styles.retryButton}
          disabled={isRetrying}
        />
      </View>
    </View>
  );
};

export default OrderListErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
    fontSize: 18,
    textAlign: "center",
  },
});
