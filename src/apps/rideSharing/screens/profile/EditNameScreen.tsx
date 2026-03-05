import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useProfile } from '../../hooks/useProfile';
import { useUpdateUser } from '../../hooks/useUserMutations';
import { ProfileInputField, ProfileUpdateButton } from '../../components/profile';

export default function EditNameScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation();
  const { userProfile } = useProfile();

  const [name, setName] = useState(userProfile?.name ?? '');

  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleUpdate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    updateUser(
      { name: trimmed },
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (error) => {
          Alert.alert(
            'Update Failed',
            error.message ?? 'Something went wrong. Please try again.',
          );
        },
      },
    );
  };

  const isFormValid = name.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('name_screen_title')}
          </Text>
          <Text variant="body" color={colors.mutedText} style={styles.description}>
            {t('name_screen_description')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <ProfileInputField
            label={t('label_name')}
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            autoCapitalize="words"
          />
        </View>
      </ScrollView>

      {/* Update Button */}
      <ProfileUpdateButton
        label={isPending ? 'Updating…' : t('update_button')}
        onPress={handleUpdate}
        disabled={!isFormValid || isPending}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    gap: 4,
  },
  description: {
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
});
