import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhoneInput from "react-native-phone-number-input";
import * as Location from "expo-location";
import { useTheme } from "../../theme/theme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  onChangeCountry?: (country: any) => void;
  resetOnCountryChange?: boolean;
  isActive?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function PhoneNumberInput({
  value,
  onChangeText,
  onChangeFormattedText,
  onChangeCountry,
  resetOnCountryChange = false,
  isActive = false,
  onFocus,
  onBlur,
}: Props) {
  const { colors } = useTheme();
  const phoneInput = useRef<PhoneInput>(null);
  const insets = useSafeAreaInsets();
  const [defaultCountryCode, setDefaultCountryCode] = useState("US");

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted) {
          return;
        }

        const lastKnownPosition = await Location.getLastKnownPositionAsync();
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch(() => null);
        const resolvedPosition = currentPosition ?? lastKnownPosition;

        if (!resolvedPosition) {
          return;
        }

        const [locationResult] = await Location.reverseGeocodeAsync({
          latitude: resolvedPosition.coords.latitude,
          longitude: resolvedPosition.coords.longitude,
        });
        const countryIso = locationResult?.isoCountryCode?.toUpperCase();

        if (!isMounted || !countryIso) {
          return;
        }

        setDefaultCountryCode(countryIso);
      } catch (error) {
        console.warn("Unable to resolve phone default country", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <PhoneInput
        key={`phone-input-${defaultCountryCode}`}
        ref={phoneInput}
        value={value}
        defaultCode={defaultCountryCode}
        layout="first"
        onChangeText={onChangeText}
        onChangeFormattedText={onChangeFormattedText}
        onChangeCountry={(country) => {
          onChangeCountry?.(country);
          if (resetOnCountryChange) {
            onChangeText("");
            onChangeFormattedText?.("");
          }
        }}
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
          withAlphaFilter: true,
          modalProps: {
            animationType: "slide",
            statusBarTranslucent: true,
          },
          flatListProps: {
            contentContainerStyle: {
              paddingBottom: insets.bottom,
            },
          },
          closeButtonStyle: {
            marginTop: insets.top,
          },
          filterProps: {
            style: {
              marginTop: insets.top,
            },
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
