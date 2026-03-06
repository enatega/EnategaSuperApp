import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../theme/theme";
import Text from "../../Text";
import Icon from "../../Icon";

type VerificationOption = {
  id: string;
  icon: string;
  title: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  options: VerificationOption[];
  selectedOption: string;
  onSelectOption: (id: string) => void;
  title: string;
};

export default function VerificationMethodModal({
  visible,
  onClose,
  options,
  selectedOption,
  onSelectOption,
  title,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {/* Empty view for balance */}
            </View>
            <Text
              variant="subtitle"
              weight="bold"
              color={colors.text}
              style={styles.headerTitle}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={12}
              style={styles.headerRight}
            >
              <View
                style={{
                  backgroundColor: colors.backgroundTertiary,
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <Icon type="Feather" name="x" size={24} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  {
                    backgroundColor:
                      selectedOption === option.id
                        ? colors.backgroundTertiary
                        : "",
                  },
                ]}
                onPress={() => onSelectOption(option.id)}
              >
                <Icon
                  type="Feather"
                  name={option.icon}
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.optionTitle}>{option.title}</Text>
                {selectedOption === option.id && (
                  <Icon
                    type="Feather"
                    name="check"
                    size={20}
                    color={colors.text}
                  />
                )}
              </TouchableOpacity>
            ))}
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44, // Ensures consistent height
    padding: 20,
  },
  headerLeft: {
    width: 44, // Same width as the close button for balance
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
  },
  headerRight: {
    width: 44,
    alignItems: "flex-end",
  },
  optionsList: {
    gap: 0,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  optionTitle: {
    flex: 1,
  },
});
