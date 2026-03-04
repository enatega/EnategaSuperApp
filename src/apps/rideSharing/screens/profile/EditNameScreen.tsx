import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useProfile } from '../../hooks/useProfile';
import { ProfileInputField, ProfileUpdateButton } from '../../components/profile';

export default function EditNameScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const { userProfile, updateName } = useProfile();

  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);

  const handleUpdate = () => {
    updateName({ firstName, lastName });
  };

  const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader />
      <ScrollView
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
            label={t('label_first_name')}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            autoCapitalize="words"
          />

          <ProfileInputField
            label={t('label_last_name')}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            autoCapitalize="words"
          />
        </View>
      </ScrollView>

      {/* Update Button */}
      <ProfileUpdateButton
        label={t('update_button')}
        onPress={handleUpdate}
        disabled={!isFormValid}
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
