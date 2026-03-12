import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Button from '../../../../../general/components/Button';
import { useTheme } from '../../../../../general/theme/theme';
import { showToast } from '../../../../../general/components/AppToast';
import { profileService, UpdateProfilePayload } from '../../api/profileService';
import EditProfileForm from '../../components/profile/EditProfileForm';

type RouteParams = {
  EditProfile: {
    name: string;
    dateOfBirth: string | null;
    gender: string | null;
  };
};

function parseDob(iso: string | null) {
  if (!iso) return { day: '', month: '', year: '' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: '', month: '', year: '' };
  return {
    day: d.getDate().toString(),
    month: (d.getMonth() + 1).toString(),
    year: d.getFullYear().toString(),
  };
}

function buildDobString(day: string, month: string, year: string): string {
  if (!day || !month || !year) return '';
  const mm = month.padStart(2, '0');
  const dd = day.padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'EditProfile'>>();

  const {
    name: initialName,
    dateOfBirth: initialDob,
    gender: initialGender,
  } = route.params;

  const initialParsed = parseDob(initialDob);

  const [name, setName] = useState(initialName);
  const [dobDay, setDobDay] = useState(initialParsed.day);
  const [dobMonth, setDobMonth] = useState(initialParsed.month);
  const [dobYear, setDobYear] = useState(initialParsed.year);
  const [gender, setGender] = useState<string | null>(initialGender);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showToast.error(t('edit_profile_error'), t('edit_profile_name_required'));
      return;
    }

    const payload: UpdateProfilePayload = {};
    const newDob = buildDobString(dobDay, dobMonth, dobYear);
    const oldDob = buildDobString(initialParsed.day, initialParsed.month, initialParsed.year);

    if (trimmedName !== initialName) payload.name = trimmedName;
    if (newDob && newDob !== oldDob) payload.dateOfBirth = newDob;
    if (gender !== initialGender) payload.gender = gender ?? undefined;

    if (Object.keys(payload).length === 0) {
      navigation.goBack();
      return;
    }

    setIsSaving(true);
    try {
      await profileService.updateProfile(payload);
      showToast.success(t('edit_profile_success'), t('edit_profile_success_message'));
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('edit_profile_failed');
      showToast.error(t('edit_profile_error'), message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('edit_profile_title')} />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <EditProfileForm
          name={name}
          dobDay={dobDay}
          dobMonth={dobMonth}
          dobYear={dobYear}
          gender={gender}
          nameLabel={t('edit_profile_name')}
          dateOfBirthLabel={t('edit_profile_date_of_birth')}
          genderLabel={t('edit_profile_gender')}
          genderPlaceholder={t('edit_profile_gender_placeholder')}
          dayPlaceholder={t('edit_profile_day')}
          monthPlaceholder={t('edit_profile_month')}
          yearPlaceholder={t('edit_profile_year')}
          onNameChange={setName}
          onDobDayChange={setDobDay}
          onDobMonthChange={setDobMonth}
          onDobYearChange={setDobYear}
          onGenderChange={setGender}
        />
      </KeyboardAvoidingView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Button
          label={t('edit_profile_save')}
          onPress={handleSave}
          isLoading={isSaving}
          disabled={isSaving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: 16 },
  footer: { borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 12 },
  screen: { flex: 1 },
});
