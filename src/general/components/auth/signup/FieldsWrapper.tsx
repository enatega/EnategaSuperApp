import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import NameInput from "../NameInput";
import EmailInput from "../EmailInput";
import PasswordInput from "../PasswordInput";
import PhoneNumberInput from "../PhoneInput";

type Props = {
  onFieldsChange?: (isValid: boolean) => void;
};

export default function FieldsWrapper({ onFieldsChange }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <NameInput
        value={name} 
        onChangeText={setName} 
        placeholder="Name" 
        isFocused={focusedField === "name"}
        onFocus={() => setFocusedField("name")}
        onBlur={() => setFocusedField(null)}
      />
      <EmailInput
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email" 
        isFocused={focusedField === "email"}
        onFocus={() => setFocusedField("email")}
        onBlur={() => setFocusedField(null)}
      />
      <PasswordInput 
        value={password} 
        onChangeText={setPassword} 
        placeholder="Password" 
        isFocused={focusedField === "password"}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField(null)}
      />
      <PhoneNumberInput 
        value={phone} 
        onChangeText={setPhone} 
        isActive={focusedField === "phone"}
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
