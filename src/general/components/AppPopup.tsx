import React, { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/theme';
import Text from './Text';
import Button from './Button';

type PopupAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Props = {
  visible: boolean;
  title: string;
  description: string;
  illustration?: ReactNode;
  primaryAction: PopupAction;
  secondaryAction?: PopupAction;
  showPrimaryAction?: boolean;
  onRequestClose?: () => void;
  dismissOnOverlayPress?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function AppPopup({
  visible,
  title,
  description,
  illustration,
  primaryAction,
  secondaryAction,
  showPrimaryAction = true,
  onRequestClose,
  dismissOnOverlayPress = false,
  containerStyle,
}: Props) {
  const { colors } = useTheme();
  const showsPrimaryAction = showPrimaryAction;
  const showsActions = showsPrimaryAction || Boolean(secondaryAction);

  const handleOverlayPress = () => {
    if (dismissOnOverlayPress) {
      onRequestClose?.();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.overlay} onPress={handleOverlayPress}>
        <Pressable>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                shadowColor: '#101828',
              },
              containerStyle,
            ]}
          >
            {illustration ? <View style={styles.illustration}>{illustration}</View> : null}

            <View style={styles.content}>
              <View style={styles.copy}>
                <Text variant="subtitle" weight="bold" style={styles.title}>
                  {title}
                </Text>
                <Text style={[styles.description, { color: colors.text }]}>
                  {description}
                </Text>
              </View>

              {showsActions ? (
                <View style={styles.actions}>
                  {showsPrimaryAction ? (
                    <Button
                      label={primaryAction.label}
                      onPress={primaryAction.onPress}
                      variant={primaryAction.variant}
                      isLoading={primaryAction.isLoading}
                      disabled={primaryAction.disabled}
                      style={[styles.button, primaryAction.style]}
                    />
                  ) : null}

                  {secondaryAction ? (
                    <Button
                      label={secondaryAction.label}
                      onPress={secondaryAction.onPress}
                      variant={secondaryAction.variant}
                      isLoading={secondaryAction.isLoading}
                      disabled={secondaryAction.disabled}
                      style={[styles.button, secondaryAction.style]}
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.34)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: 24,
  },
  content: {
    gap: 12,
  },
  copy: {
    gap: 12,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  button: {
    width: '100%',
    borderRadius: 6,
    paddingVertical: 10,
    minHeight: 44,
  },
});
