import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  conversationName: string;
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
};

export default function SupportDeleteConversationModal({
  conversationName,
  onCancel,
  onConfirm,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
            </View>

            <View style={styles.copy}>
              <Text
                color={colors.text}
                weight="bold"
                style={{ fontSize: typography.size.lg, lineHeight: 28, textAlign: 'center' }}
              >
                {t('support_conversations_delete_title', { name: conversationName })}
              </Text>

              <Text
                color={colors.text}
                style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2, textAlign: 'center' }}
              >
                {t('support_conversations_delete_description')}
              </Text>
            </View>

            <View style={styles.actions}>
              <Button
                label={t('support_conversations_delete_cancel')}
                onPress={onCancel}
                variant="secondary"
                style={styles.button}
              />
              <Button
                label={t('support_conversations_delete_confirm')}
                onPress={onConfirm}
                variant="danger"
                style={styles.button}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    minHeight: 48,
  },
  card: {
    alignItems: 'center',
    borderRadius: 24,
    elevation: 6,
    maxWidth: 361,
    paddingBottom: 16,
    paddingTop: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    width: '100%',
  },
  copy: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    width: '100%',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
