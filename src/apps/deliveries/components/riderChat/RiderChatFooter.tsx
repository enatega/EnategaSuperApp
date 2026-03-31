import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import RiderChatComposer from './RiderChatComposer';

type Props = {
  bottomInset: number;
  isKeyboardVisible: boolean;
  isSending?: boolean;
  onAttachmentPress: () => void;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  value: string;
};

export default function RiderChatFooter({
  bottomInset,
  isKeyboardVisible,
  isSending = false,
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
      <RiderChatComposer
        onAttachmentPress={onAttachmentPress}
        isSending={isSending}
        value={value}
        onChangeText={onChangeText}
        onSend={onSend}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
