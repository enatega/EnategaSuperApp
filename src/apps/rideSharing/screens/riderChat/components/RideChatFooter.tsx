import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatComposer from '../../../../../general/components/chat/ChatComposer';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  attachmentAccessibilityLabel: string;
  bottomInset: number;
  isKeyboardVisible: boolean;
  isSending?: boolean;
  messageAccessibilityLabel: string;
  onAttachmentPress: () => void;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  value: string;
};

export default function RideChatFooter({
  attachmentAccessibilityLabel,
  bottomInset,
  isKeyboardVisible,
  isSending = false,
  messageAccessibilityLabel,
  onAttachmentPress,
  onChangeText,
  onSend,
  placeholder,
  value,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: isKeyboardVisible ? 4 : Math.max(bottomInset, 12),
        },
      ]}
    >
      <ChatComposer
        attachmentAccessibilityLabel={attachmentAccessibilityLabel}
        isSending={isSending}
        messageAccessibilityLabel={messageAccessibilityLabel}
        onAttachmentPress={onAttachmentPress}
        onChangeText={onChangeText}
        onSend={onSend}
        placeholder={placeholder}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
