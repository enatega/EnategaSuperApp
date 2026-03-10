import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import TextInputField from "../TextInputField";
import PhoneNumberInput from "../PhoneInput";
import { useAuthStore } from "../../../stores/useAuthStore";

export default function FieldsWrapper() {
  const { formData, setFormData } = useAuthStore();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ [field]: value });
  };

  return (
    <View style={styles.container}>
      <TextInputField
        value={formData.name}
        onChangeText={(value) => updateField("name", value)}
        placeholder="name"
        iconName="user"
        isFocused={focusedField === "name"}
        onFocus={() => setFocusedField("name")}
        onBlur={() => setFocusedField(null)}
      />
      <TextInputField
        value={formData.email}
        onChangeText={(value) => updateField("email", value)}
        placeholder="email"
        iconName="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        isFocused={focusedField === "email"}
        onFocus={() => setFocusedField("email")}
        onBlur={() => setFocusedField(null)}
      />
      <TextInputField
        value={formData.password}
        onChangeText={(value) => updateField("password", value)}
        placeholder="password"
        iconName="lock"
        isPassword
        autoCapitalize="none"
        isFocused={focusedField === "password"}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField(null)}
      />
      <PhoneNumberInput
        value={formData.phone}
        onChangeText={(value) => updateField("phone", value)}
        onChangeFormattedText={(formattedValue) => {
          updateField("phone", formattedValue);
        }}
        isActive={focusedField === "phone"}
        onFocus={() => setFocusedField("phone")}
        onBlur={() => setFocusedField(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
});
