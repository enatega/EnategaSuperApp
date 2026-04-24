import React from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../../general/components/Button";
import SwipeableBottomSheet from "../../../../general/components/SwipeableBottomSheet";
import Text from "../../../../general/components/Text";
import { useDeliveriesCurrencyLabel } from "../../../../general/stores/useAppConfigStore";
import { useTheme } from "../../../../general/theme/theme";
import { styles } from "./IncreaseTipBottomSheet.styles";

const TIP_PRESETS = ["5.00", "10.00", "20.00", "50.00", "120.50"];

type Props = {
  isVisible: boolean;
  onChangeTipAmount: (value: string) => void;
  onClose: () => void;
  onDone: () => void;
  tipAmount: string;
};

export default function IncreaseTipBottomSheet({
  isVisible,
  onChangeTipAmount,
  onClose,
  onDone,
  tipAmount,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    if (!isVisible) {
      setKeyboardHeight(0);
      return undefined;
    }

    const showEvent = Platform.OS === "ios" ? "keyboardWillChangeFrame" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [isVisible]);

  const keyboardBottomInset = Platform.OS === "ios"
    ? Math.max(keyboardHeight - insets.bottom, 0)
    : 0;
  const handleClose = React.useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleDone = React.useCallback(() => {
    Keyboard.dismiss();
    onDone();
  }, [onDone]);

  if (!isVisible) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.backdrop}>
      <Pressable
        accessibilityRole="button"
        onPress={handleClose}
        style={[styles.backdrop, { backgroundColor: colors.overlayDark20 }]}
      />

      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={330}
        handle={
          <View style={styles.handleWrapper}>
            <View
              style={[styles.handle, { backgroundColor: colors.border }]}
            />
          </View>
        }
        initialState="expanded"
        modal
        onCollapsed={handleClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            bottom: keyboardBottomInset,
          },
        ]}
      >
        <View
          style={[
            styles.content,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
          ]}
        >
            <View style={styles.headerRow}>
              <View style={styles.headerSide} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.h5,
                  lineHeight: typography.lineHeight.h5,
                  textAlign: "center",
                }}
                weight="extraBold"
              >
                {t("order_details_increase_tip")}
              </Text>
              <Pressable
                accessibilityLabel={t("store_details_close")}
                accessibilityRole="button"
                hitSlop={8}
                onPress={handleClose}
                style={[
                  styles.closeButton,
                  { backgroundColor: colors.backgroundTertiary },
                ]}
              >
                <Ionicons color={colors.iconColor} name="close" size={20} />
              </Pressable>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md2,
                }}
                weight="medium"
              >
                {currencyLabel}
              </Text>
              <TextInput
                autoFocus
                keyboardType="decimal-pad"
                onChangeText={onChangeTipAmount}
                placeholder={t("order_details_tip_placeholder")}
                placeholderTextColor={colors.mutedText}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    fontSize: typography.size.md2,
                    lineHeight: typography.lineHeight.md2,
                  },
                ]}
                value={tipAmount}
              />
            </View>

            <View style={styles.presetRow}>
              {TIP_PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => onChangeTipAmount(preset)}
                  style={[
                    styles.presetButton,
                    {
                      backgroundColor:
                        tipAmount === preset ? colors.blue100 : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: typography.size.sm2,
                      lineHeight: typography.lineHeight.md,
                    }}
                    weight="medium"
                  >
                    {`${currencyLabel} ${preset}`}
                  </Text>
                </Pressable>
              ))}
            </View>

          <Button label={t("order_details_tip_done")} onPress={handleDone} />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}
