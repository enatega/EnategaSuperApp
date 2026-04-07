import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import CheckoutHeader from './CheckoutHeader';
import { CHECKOUT_MESSAGE_MAX_LENGTH } from './checkoutMessageUtils';

type Props = {
  ctaLabel: string;
  description: string;
  onBackPress: () => void;
  onChangeText: (text: string) => void;
  onSavePress: () => void;
  placeholder: string;
  title: string;
  value: string;
};

export default function CheckoutMessageEditorScreen({
  ctaLabel,
  description,
  onBackPress,
  onChangeText,
  onSavePress,
  placeholder,
  title,
  value,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const trimmedValue = value.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <CheckoutHeader
        backIconName="close"
        onBackPress={onBackPress}
        title={title}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.copyBlock}>
          <Text
            weight="extraBold"
            style={{
              fontSize: typography.size.h5,
              lineHeight: typography.lineHeight.h5,
            }}
          >
            {description}
          </Text>
        </View>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <TextInput
            multiline
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedText}
            style={[
              styles.input,
              {
                color: colors.text,
                fontSize: typography.size.md2,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            textAlignVertical="top"
            value={value}
          />
        </View>

        <Text
          color={colors.mutedText}
          style={[
            styles.counter,
            {
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            },
          ]}
        >
          {value.length}/{CHECKOUT_MESSAGE_MAX_LENGTH}
        </Text>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <Button
          label={ctaLabel}
          onPress={onSavePress}
          disabled={trimmedValue.length === 0}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
  },
  content: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  copyBlock: {
    gap: 6,
  },
  counter: {
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  inputWrapper: {
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 112,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  screen: {
    flex: 1,
  },
});
