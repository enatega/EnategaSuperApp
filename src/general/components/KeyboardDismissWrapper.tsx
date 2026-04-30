import React from "react";
import { ScrollView, type ViewStyle } from "react-native";
import useKeyboard from "../hooks/useKeyboard";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function KeyboardDismissWrapper({ children, style }: Props) {
  const { dismissKeyboard } = useKeyboard();

  return (
    <ScrollView 
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={dismissKeyboard}
      scrollEnabled={false}
    >
      {children}
    </ScrollView>
  );
}