import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Button from '../../../../../general/components/Button';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  topUpLabel: string;
  cancelLabel: string;
  onTopUp: () => void;
  onCancel: () => void;
};

export default function WalletTopUpPromptModal({
  visible,
  title,
  message,
  topUpLabel,
  cancelLabel,
  onTopUp,
  onCancel,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <Text color={colors.text} style={styles.title} variant="subtitle" weight="bold">
            {title}
          </Text>
          <Text color={colors.mutedText} style={styles.message} variant="body">
            {message}
          </Text>
          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              onPress={onCancel}
              style={styles.actionButton}
              variant="secondary"
            />
            <Button
              label={topUpLabel}
              onPress={onTopUp}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  card: {
    borderRadius: 20,
    elevation: 10,
    marginHorizontal: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  message: {
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.32)',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
