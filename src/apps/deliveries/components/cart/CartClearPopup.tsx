import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AppPopup from '../../../../general/components/AppPopup';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
};

export default function CartClearPopup({
  isSubmitting = false,
  onCancel,
  onConfirm,
  visible,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <AppPopup
      containerStyle={[styles.popup, { backgroundColor: colors.surface }]}
      description={t('cart_clear_popup_message')}
      dismissOnOverlayPress={!isSubmitting}
      illustration={
        <View style={[styles.illustration, { backgroundColor: colors.gray100 }]}>
          <Ionicons color={colors.danger} name="trash-outline" size={28} />
        </View>
      }
      onRequestClose={isSubmitting ? undefined : onCancel}
      primaryAction={{
        label: t('cart_clear_popup_confirm'),
        onPress: onConfirm,
        variant: 'danger',
        isLoading: isSubmitting,
        disabled: isSubmitting,
      }}
      secondaryAction={{
        label: t('cart_clear_popup_cancel'),
        onPress: onCancel,
        variant: 'secondary',
        disabled: isSubmitting,
      }}
      title={t('cart_clear_popup_title')}
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
