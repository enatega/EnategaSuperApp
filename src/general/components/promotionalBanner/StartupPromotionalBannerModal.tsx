import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslations } from '../../localization/LocalizationProvider';
import { useTheme } from '../../theme/theme';
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
  const { height: windowHeight } = useWindowDimensions();
  const modalHeight = Math.min(windowHeight * 0.8, 760);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.shadowColor,
              maxHeight: modalHeight,
            },
          ]}
        >
          <Pressable
            accessibilityLabel={t('promotional_banner_close')}
            accessibilityRole="button"
            hitSlop={12}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons color={colors.white} name="close" size={34} />
          </Pressable>

          <View style={styles.mediaContainer}>
            <PromotionalBannerMedia uri={mediaUri} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 26,
    right: 24,
    zIndex: 2,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(17, 24, 39, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 0.62,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
});
