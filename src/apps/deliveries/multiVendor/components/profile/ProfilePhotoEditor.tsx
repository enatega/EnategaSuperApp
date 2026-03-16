import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import { profileService } from '../../api/profileService';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
};

export default function ProfilePhotoEditor({
  isVisible,
  onClose,
  onUploadComplete,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const [isUploading, setIsUploading] = React.useState(false);

  const handlePickImage = async (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('photo_permission_title'),
          t('photo_permission_camera'),
        );
        return;
      }
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('photo_permission_title'),
          t('photo_permission_gallery'),
        );
        return;
      }
    }

    const result = await (source === 'camera'
      ? ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        }));

    if (result.canceled) return;

    const asset = result.assets[0];
    onClose();
    setIsUploading(true);

    try {
      await profileService.updateProfileImage({
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'image/jpeg',
        fileName: asset.fileName ?? 'profile.jpg',
      });
      onUploadComplete();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('photo_upload_failed');
      Alert.alert(t('photo_upload_error_title'), message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isUploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View style={styles.modalBottom}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.surface,
                  paddingBottom: Math.max(insets.bottom, 20),
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View
                  style={[
                    styles.modalIndicator,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              <Text
                variant="title"
                weight="semiBold"
                color={colors.text}
                style={styles.modalTitle}
              >
                {t('photo_modal_title')}
              </Text>

              <Text
                variant="body"
                color={colors.mutedText}
                style={styles.modalDescription}
              >
                {t('photo_modal_description')}
              </Text>

              <TouchableOpacity
                onPress={() => handlePickImage('camera')}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.primary },
                ]}
                accessibilityLabel={t('photo_take_photo')}
                accessibilityRole="button"
              >
                <Icon
                  type="Ionicons"
                  name="camera-outline"
                  size={20}
                  color={colors.white}
                />
                <Text variant="subtitle" weight="semiBold" color={colors.white}>
                  {t('photo_take_photo')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePickImage('gallery')}
                style={[
                  styles.optionButton,
                  { backgroundColor: colors.cardSoft },
                ]}
                accessibilityLabel={t('photo_choose_gallery')}
                accessibilityRole="button"
              >
                <Icon
                  type="Ionicons"
                  name="image-outline"
                  size={20}
                  color={colors.text}
                />
                <Text variant="subtitle" weight="semiBold" color={colors.text}>
                  {t('photo_choose_gallery')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
                accessibilityLabel={t('photo_cancel')}
                accessibilityRole="button"
              >
                <Text variant="subtitle" weight="semiBold" color={colors.text}>
                  {t('photo_cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalBottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalDescription: {
    marginBottom: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIndicator: {
    borderRadius: 2,
    height: 4,
    width: 40,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  modalTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  optionButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 12,
    paddingVertical: 16,
  },
  uploadingOverlay: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
