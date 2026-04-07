import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, type TextInput } from "react-native";

export default function useSearchKeyboardState() {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
      setIsFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
    inputRef.current?.blur();
    setIsFocused(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (!isKeyboardVisible) {
      setIsFocused(false);
    }
  }, [isKeyboardVisible]);

  return {
    inputRef,
    isFocused,
    dismissKeyboard,
    handleFocus,
    handleBlur,
  };
}
