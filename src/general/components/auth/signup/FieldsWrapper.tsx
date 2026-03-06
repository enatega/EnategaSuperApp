import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import TextInputField from "../TextInputField";
import PhoneNumberInput from "../PhoneInput";
import { isValidEmail } from "../../../utils/validation";

type Props = {
  onFieldsChange?: (isValid: boolean) => void;
};

export default function FieldsWrapper({ onFieldsChange }: Props) {
  const [name, setName] = useState("john");
  const [email, setEmail] = useState("john@gmail.com");
  const [password, setPassword] = useState("johnjohn");
  const [phone, setPhone] = useState("3044639748");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const isFormValid = 
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      isValidEmail(email) &&
      password.trim().length > 0 &&
      phone.trim().length > 0;
    
    onFieldsChange?.(isFormValid);
  }, [name, email, password, phone, onFieldsChange]);

  return (
    <View style={styles.container}>
      <TextInputField
        value={name}
        onChangeText={setName}
        placeholder="name"
        iconName="user"
        isFocused={focusedField === "name"}
        onFocus={() => setFocusedField("name")}
        onBlur={() => setFocusedField(null)}
      />
      <TextInputField
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        iconName="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        isFocused={focusedField === "email"}
        onFocus={() => setFocusedField("email")}
        onBlur={() => setFocusedField(null)}
      />
      <TextInputField
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        iconName="lock"
        isPassword
        autoCapitalize="none"
        isFocused={focusedField === "password"}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField(null)}
      />
      <PhoneNumberInput 
        value={phone} 
        onChangeText={setPhone} 
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
