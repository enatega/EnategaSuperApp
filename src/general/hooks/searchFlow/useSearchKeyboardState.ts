import { useCallback, useEffect, useRef, useState } from "react";
import { type TextInput } from "react-native";
import useKeyboard from "../useKeyboard";

export default function useSearchKeyboardState() {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { isKeyboardVisible, dismissKeyboard: dismissKeyboardCore } = useKeyboard();

  useEffect(() => {
    // A pending keyboard hide event can arrive after the input has already
    // regained focus. Only clear focus when the input is actually blurred.
    if (!isKeyboardVisible && !inputRef.current?.isFocused()) {
      setIsFocused(false);
    }
  }, [isKeyboardVisible]);

  const dismissKeyboard = useCallback(() => {
    dismissKeyboardCore();
    inputRef.current?.blur();
    setIsFocused(false);
  }, [dismissKeyboardCore]);

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