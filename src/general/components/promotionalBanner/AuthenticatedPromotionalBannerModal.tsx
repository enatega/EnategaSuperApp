import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslations } from '../../localization/LocalizationProvider';
import { useTheme } from '../../theme/theme';
import Button from '../Button';
import Text from '../Text';
import PromotionalBannerMedia from './PromotionalBannerMedia';

type Props = {
  visible: boolean;
  mediaUri: string;
  title?: string | null;
  description?: string | null;
  onClose: () => void;
};

export default function AuthenticatedPromotionalBannerModal({
  visible,
  mediaUri,
  title,
  description,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslations('general');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={() => undefined}
        >
          <Pressable
            accessibilityLabel={t('promotional_banner_close')}
            accessibilityRole="button"
            hitSlop={12}
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.overlayDark20 }]}
          >
            <Text color={colors.white} weight="bold">
              X
            </Text>
          </Pressable>

          <View style={styles.mediaContainer}>
            <PromotionalBannerMedia uri={mediaUri} />
          </View>

          <View style={styles.content}>
            {title ? (
              <Text variant="subtitle" weight="extraBold" color={colors.text}>
                {title}
              </Text>
            ) : null}

            {description ? (
              <Text
                variant="body"
                color={colors.mutedText}
                style={title ? styles.description : undefined}
              >
                {description}
              </Text>
            ) : null}

            <Button
              label={t('promotional_banner_primary_action')}
              onPress={onClose}
              style={styles.actionButton}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    paddingHorizontal: 16,
  },
  sheet: {
    width: '100%',
    minHeight: '54%',
    maxHeight: '72%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    width: '100%',
    height: 280,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 12,
  },
  description: {
    marginTop: -4,
  },
  actionButton: {
    marginTop: 8,
  },
});
