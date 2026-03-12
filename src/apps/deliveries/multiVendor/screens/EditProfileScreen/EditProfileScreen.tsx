import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  const { name: initialName, dateOfBirth: initialDob, gender: initialGender } = route.params;
  const initialParsed = parseDob(initialDob);

  const [name, setName] = useState(initialName);
  const [dobDay, setDobDay] = useState(initialParsed.day);
  const [dobMonth, setDobMonth] = useState(initialParsed.month);
  const [dobYear, setDobYear] = useState(initialParsed.year);
  const [gender, setGender] = useState<string | null>(initialGender);
  const [isSaving, setIsSaving] = useState(false);
  // keyboardOffset: how much the footer should lift above its natural bottom position
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      // endCoordinates.screenY is the top of the keyboard from the top of the screen
      // We want to push the footer up by however much the keyboard overlaps the bottom safe area
      setKeyboardOffset(e.endCoordinates.height - insets.bottom + 16);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, [insets.bottom]);

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 12,
            bottom: keyboardOffset,
          },
        ]}
      >
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
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  scrollView: { flex: 1 },
});
