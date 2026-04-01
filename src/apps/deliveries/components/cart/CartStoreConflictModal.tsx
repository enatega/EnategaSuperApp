import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AppPopup from '../../../../general/components/AppPopup';
import { useTheme } from '../../../../general/theme/theme';
import type { CartStoreConflictPrompt } from '../../cart/cartStoreConflictTypes';

type Props = {
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  prompt?: CartStoreConflictPrompt | null;
  visible: boolean;
};

export default function CartStoreConflictModal({
  errorMessage,
  isSubmitting = false,
  onCancel,
  onConfirm,
  prompt,
  visible,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();
  const baseDescription = prompt?.productName
    ? t('cart_store_conflict_message_with_product', {
        incomingStore: prompt?.incomingStoreName || t('cart_store_conflict_store_fallback'),
        product: prompt.productName,
      })
    : t('cart_store_conflict_message', {
        incomingStore: prompt?.incomingStoreName || t('cart_store_conflict_store_fallback'),
      });
  const description = errorMessage
    ? `${baseDescription}\n\n${errorMessage}`
    : baseDescription;

  return (
    <AppPopup
      containerStyle={[styles.popup, { backgroundColor: colors.surface }]}
      description={description}
      dismissOnOverlayPress={!isSubmitting}
      illustration={
        <View style={[styles.illustration, { backgroundColor: colors.blue100 }]}>
          <Ionicons color={colors.primary} name="basket-outline" size={28} />
        </View>
      }
      onRequestClose={isSubmitting ? undefined : onCancel}
      primaryAction={{
        label: t('cart_store_conflict_replace_cart'),
        onPress: onConfirm,
        isLoading: isSubmitting,
        disabled: isSubmitting,
      }}
      secondaryAction={{
        label: t('cart_store_conflict_keep_cart'),
        onPress: onCancel,
        variant: 'secondary',
        disabled: isSubmitting,
      }}
      title={t('cart_store_conflict_title')}
      visible={visible}
    />
  );
}

const styles = StyleSheet.create({
  illustration: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  popup: {
    gap: 0,
  },
});
