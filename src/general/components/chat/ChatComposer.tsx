import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/theme';

type Props = {
  attachmentAccessibilityLabel: string;
  isSending?: boolean;
  messageAccessibilityLabel: string;
  onAttachmentPress: () => void;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  value: string;
};

export default function ChatComposer({
  attachmentAccessibilityLabel,
  isSending = false,
  messageAccessibilityLabel,
  onAttachmentPress,
  onChangeText,
  onSend,
  placeholder,
  value,
}: Props) {
  const { colors, typography } = useTheme();
  const isDisabled = !value.trim() || isSending;

  return (
    <View style={[styles.container, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          {
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          },
        ]}
      />

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel={attachmentAccessibilityLabel}
          accessibilityRole="button"
          onPress={onAttachmentPress}
          style={styles.iconWrap}
        >
          <Ionicons name="add" size={30} color={colors.iconColor} />
        </Pressable>

        <Pressable
          accessibilityLabel={messageAccessibilityLabel}
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={onSend}
          style={[
            styles.sendButton,
            { backgroundColor: colors.backgroundTertiary, opacity: isDisabled ? 0.5 : 1 },
          ]}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={colors.iconMuted} />
          ) : (
            <Ionicons name="paper-plane-outline" size={22} color={colors.iconMuted} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  iconWrap: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  input: {
    minHeight: 28,
    paddingVertical: 0,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
