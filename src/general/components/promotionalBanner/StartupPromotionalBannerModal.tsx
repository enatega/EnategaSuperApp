import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslations } from '../../localization/LocalizationProvider';
import { useTheme } from '../../theme/theme';
import Text from '../Text';
import PromotionalBannerMedia from './PromotionalBannerMedia';

type Props = {
  visible: boolean;
  mediaUri: string;
  onClose: () => void;
};

export default function StartupPromotionalBannerModal({
  visible,
  mediaUri,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslations('general');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Pressable
            accessibilityLabel={t('promotional_banner_skip')}
            accessibilityRole="button"
            hitSlop={12}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text color={colors.white} weight="semiBold">
              {t('promotional_banner_skip')}
            </Text>
          </Pressable>

          <View style={styles.mediaContainer}>
            <PromotionalBannerMedia uri={mediaUri} onVideoEnd={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  card: {
    flex: 1,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 54,
    right: 20,
    zIndex: 2,
    minWidth: 72,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 21,
    backgroundColor: 'rgba(17, 24, 39, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    flex: 1,
    width: '100%',
  },
});
