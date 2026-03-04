import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type Props = {
  profilePhotoUri?: string;
  onEditPress?: () => void;
  visible?: boolean;
  onClose?: () => void;
  onUpdatePhoto?: () => void;
};

export default function ProfilePhoto({
  profilePhotoUri,
  onEditPress,
  visible = false,
  onClose,
  onUpdatePhoto,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();

  const renderAvatar = () => {
    if (profilePhotoUri) {
      return (
        <View style={[styles.avatarContainer, { backgroundColor: colors.cardSoft }]}>
          <Text variant="title" weight="bold">
            {profilePhotoUri.charAt(0).toUpperCase()}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.avatarContainer, { backgroundColor: colors.cardSoft }]}>
        <Icon
          type="Ionicons"
          name="person"
          size={40}
          color={colors.mutedText}
        />
      </View>
    );
  };

  return (
    <>
      {/* Profile Photo with Edit Button */}
      <View style={styles.profilePhotoContainer}>
        {renderAvatar()}
        <TouchableOpacity
          onPress={onEditPress}
          style={[styles.editButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Icon
            type="Ionicons"
            name="pencil"
            size={16}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Photo Update Modal */}
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

              <TouchableOpacity
                onPress={onUpdatePhoto}
                style={[styles.updateButton, { backgroundColor: colors.primary }]}
              >
                <Text
                  variant="subtitle"
                  weight="semiBold"
                  color="#FFFFFF"
                >
                  {t('update_photo_button')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
              >
                <Text
                  variant="subtitle"
                  weight="semiBold"
                  color={colors.text}
                >
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
  updateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
