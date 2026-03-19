import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  isSending?: boolean;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  value: string;
};

export default function RiderChatComposer({
  isSending = false,
  onChangeText,
  onSend,
  placeholder,
  value,
}: Props) {
  const { colors } = useTheme();
  const isDisabled = !value.trim() || isSending;

  return (
    <View style={[styles.container, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={[styles.input, { color: colors.text }]}
      />

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Add attachment"
          accessibilityRole="button"
          style={styles.iconWrap}
        >
          <Ionicons name="add" size={34} color={colors.text} />
        </Pressable>

        <Pressable
          accessibilityLabel="Send message"
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
            <Ionicons name="paper-plane-outline" size={28} color={colors.iconMuted} />
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
    borderTopWidth: 1,
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconWrap: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  input: {
    fontSize: 18,
    minHeight: 28,
    paddingVertical: 0,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
