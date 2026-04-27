import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/theme';
import Icon from './Icon';
import Image from './Image';

type Props = {
  visible: boolean;
  imageUri?: string | null;
  onClose: () => void;
};

export default function FullImagePreviewModal({ visible, imageUri, onClose }: Props) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const previewWidth = Math.max(width - 24, 240);
  const previewHeight = Math.max(height - 160, 280);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onClose}
          style={[
            styles.closeButton,
            {
              backgroundColor: colors.surface,
              top: insets.top,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Close image preview"
        >
          <Icon type="Feather" name="x" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.content}>
          <ScrollView
            style={[styles.previewCard, { width: previewWidth, height: previewHeight }]}
            contentContainerStyle={styles.previewContent}
            minimumZoomScale={1}
            maximumZoomScale={4}
            bouncesZoom
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            centerContent
          >
            <Image
              source={{ uri: imageUri ?? '' }}
              style={[styles.image, { width: previewWidth, height: previewHeight }]}
              resizeMode="contain"
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: 'transparent',
  },
});
