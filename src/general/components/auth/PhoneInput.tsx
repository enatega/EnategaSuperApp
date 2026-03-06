import React, { useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useTheme } from "../../theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  onChangeCountry?: (country: any) => void;
  isActive?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function PhoneNumberInput({
  value,
  onChangeText,
  onChangeFormattedText,
  onChangeCountry,
  isActive = false,
  onFocus,
  onBlur,
}: Props) {
  const { colors } = useTheme();
  const phoneInput = useRef<PhoneInput>(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="US"
        layout="first"
        onChangeText={onChangeText}
        onChangeFormattedText={onChangeFormattedText}
        onChangeCountry={onChangeCountry}
        containerStyle={[
          styles.phoneContainer,
          {
            backgroundColor: colors.gray100,
            borderColor: isActive ? colors.primary : colors.border,
          },
        ]}
        textContainerStyle={[
          styles.textContainer,
          { backgroundColor: colors.surface },
        ]}
        textInputStyle={[styles.textInput, { color: colors.text }]}
        codeTextStyle={[styles.codeText, { color: colors.text }]}
        flagButtonStyle={styles.flagButton}
        countryPickerButtonStyle={styles.countryPickerButton}
        placeholder="(000) 000-0000"
        textInputProps={{
          onFocus,
          onBlur,
        }}
        countryPickerProps={{
          renderFlagButton: false,
          withModal: true,
          withFilter: true,
          modalProps: {
            animationType: "slide",
            statusBarTranslucent: Platform.OS === "android",
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  phoneContainer: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
  },
  textContainer: {
    paddingVertical: 0,
    borderTopEndRadius: 12,
    borderBottomEndRadius: 12,
    backgroundColor: "transparent",
  },
  textInput: {
    fontSize: 16,
    height: 56,
  },
  codeText: {
    fontSize: 16,
  },
  flagButton: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  countryPickerButton: {
    paddingLeft: 12,
    paddingRight: 4,
  },
});
