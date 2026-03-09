import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../Text";
import Icon from "../Icon";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
  title: string;
  description: string;
  primaryButtonText?: string;
};

export default function TooManyRequestsModal({
  visible,
  onClose,
  onPrimaryAction,
  title,
  description,
  primaryButtonText = "OK",
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          {/* Close button - positioned absolutely */}
          <TouchableOpacity
            onPress={onClose}
            hitSlop={12}
            style={styles.closeButton}
          >
            <View
              style={{
                backgroundColor: colors.backgroundTertiary,
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Icon type="Feather" name="x" size={20} color={colors.text} />
            </View>
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text
              variant="subtitle"
              weight="bold"
              color={colors.text}
              style={styles.title}
            >
              {t(title)}
            </Text>

            <Text
              variant="body"
              color={colors.mutedText}
              style={styles.description}
            >
              {t(description)}
            </Text>

            <Button
              variant="primary"
              label={primaryButtonText}
              onPress={onPrimaryAction}
              style={[styles.button, { backgroundColor: colors.danger }]}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    position: "relative",
    padding: 24,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    textAlign: "center",
    marginTop: 8,
  },
  description: {
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    marginTop: 8,
  },
});
