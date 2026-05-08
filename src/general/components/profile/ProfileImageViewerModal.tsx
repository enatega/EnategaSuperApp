import React from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/theme';

type Props = {
  imageUri?: string | null;
  isVisible: boolean;
  onClose: () => void;
};

export default function ProfileImageViewerModal({
  imageUri,
  isVisible,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const insets = useSafeAreaInsets();

  if (!imageUri) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.88)' }]}>
        <Pressable
          onPress={onClose}
          accessibilityLabel={t('photo_cancel')}
          accessibilityRole="button"
          style={[
            styles.closeButton,
            {
              backgroundColor: colors.backgroundTertiary,
              top: Math.max(insets.top, 12),
            },
          ]}
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>

        <ScrollView
          bounces={false}
          centerContent
          contentContainerStyle={styles.imageWrap}
          maximumZoomScale={4}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: imageUri }}
            resizeMode="contain"
            style={styles.image}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    width: 40,
    zIndex: 2,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
  },
});
