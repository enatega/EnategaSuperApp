import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import { useUpdateProfileImage } from '../../hooks/useUserMutations';

type Props = {
  profilePhotoUri?: string;
  onEditPress?: () => void;
  visible?: boolean;
  onClose?: () => void;
  showAvatar?: boolean;
};

export default function ProfilePhoto({
  profilePhotoUri,
  onEditPress,
  visible = false,
  onClose,
  showAvatar = true,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();

  const { mutate: uploadImage, isPending } = useUpdateProfileImage();

  // ── Image picker ──────────────────────────────────────────────────────────

  const handlePickImage = async (source: 'camera' | 'gallery') => {
    // Request permission
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take a photo.');
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Gallery access is needed to pick a photo.');
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
    onClose?.();

    uploadImage(
      {
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'image/jpeg',
        fileName: asset.fileName ?? 'profile.jpg',
      },
      {
        onError: (error) => {
          Alert.alert('Upload Failed', error.message ?? 'Could not update profile photo.');
        },
      },
    );
  };

  // ── Avatar ────────────────────────────────────────────────────────────────

  const renderAvatar = () => {
    if (profilePhotoUri) {
      return (
        <Image
          source={{
            uri: profilePhotoUri,
            cache: 'force-cache',
          }}
          style={styles.avatarContainer}
          resizeMode="cover"
        />
      );
    }
    return (
      <View style={[styles.avatarContainer, { backgroundColor: colors.cardSoft }]}>
        <Icon type="Ionicons" name="person" size={40} color={colors.mutedText} />
      </View>
    );
  };

  return (
    <>
      {showAvatar ? (
        <View style={styles.profilePhotoContainer}>
          {isPending ? (
            <View style={[styles.avatarContainer, styles.loadingOverlay, { backgroundColor: colors.cardSoft }]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            renderAvatar()
          )}
          <TouchableOpacity
            onPress={onEditPress}
            style={[styles.editButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            disabled={isPending}
            accessibilityLabel="Edit profile photo"
          >
            <Icon type="Ionicons" name="pencil" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Photo Options Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
                <View style={[styles.modalIndicator, { backgroundColor: colors.border }]} />
              </View>

              <Text
                variant="title"
                weight="semiBold"
                color={colors.text}
                style={styles.modalTitle}
              >
                {t('profile_photo_title')}
              </Text>

              <Text
                variant="body"
                color={colors.mutedText}
                style={styles.modalDescription}
              >
                {t('profile_photo_description')}
              </Text>

              {/* Camera */}
              <TouchableOpacity
                onPress={() => handlePickImage('camera')}
                style={[styles.optionButton, { backgroundColor: colors.primary }]}
                accessibilityLabel="Take a photo"
              >
                <Icon type="Ionicons" name="camera-outline" size={20} color="#fff" />
                <Text variant="subtitle" weight="semiBold" color="#FFFFFF">
                  Take Photo
                </Text>
              </TouchableOpacity>

              {/* Gallery */}
              <TouchableOpacity
                onPress={() => handlePickImage('gallery')}
                style={[styles.optionButton, { backgroundColor: colors.cardSoft }]}
                accessibilityLabel="Choose from gallery"
              >
                <Icon type="Ionicons" name="image-outline" size={20} color={colors.text} />
                <Text variant="subtitle" weight="semiBold" color={colors.text}>
                  Choose from Gallery
                </Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text variant="subtitle" weight="semiBold" color={colors.text}>
                  {t('cancel_button')}
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
  profilePhotoContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loadingOverlay: {
    opacity: 0.6,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
