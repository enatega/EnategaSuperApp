import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useDeliveriesCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import { useTheme } from '../../../../general/theme/theme';
import CheckoutHeader from './CheckoutHeader';

type Props = {
  onBackPress: () => void;
  onChangeTipValue: (value: string) => void;
  onSavePress: () => void;
  tipValue: string;
};

export default function CheckoutCustomTipScreen({
  onBackPress,
  onChangeTipValue,
  onSavePress,
  tipValue,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const parsedTip = Number.parseFloat(tipValue);
  const isSaveDisabled = !Number.isFinite(parsedTip) || parsedTip <= 0;
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top + 62 : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <CheckoutHeader
        backIconName="close"
        onBackPress={onBackPress}
        title={t('checkout_tip_custom_title')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          color={colors.mutedText}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('checkout_tip_description')}
        </Text>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
            }}
          >
            {currencyLabel}
          </Text>

          <TextInput
            autoFocus
            keyboardType="decimal-pad"
            onChangeText={onChangeTipValue}
            placeholder={t('checkout_tip_custom_placeholder')}
            placeholderTextColor={colors.mutedText}
            style={[
              styles.input,
              {
                color: colors.text,
                fontSize: typography.size.md2,
              },
            ]}
            value={tipValue}
          />
        </View>
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
          disabled={isSaveDisabled}
          label={t('checkout_tip_custom_done')}
          onPress={onSavePress}
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
    flexGrow: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  input: {
    flex: 1,
    padding: 0,
    paddingBottom: 0,
    paddingTop: 0,
    textAlignVertical: 'center',
  },
  inputWrapper: {
    alignItems: 'baseline',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  screen: {
    flex: 1,
  },
});
