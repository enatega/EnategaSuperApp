import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'] as const;

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

type DropdownKey = 'day' | 'month' | 'year' | 'gender' | null;

type Props = {
  name: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string | null;
  nameLabel: string;
  dateOfBirthLabel: string;
  genderLabel: string;
  genderPlaceholder: string;
  dayPlaceholder: string;
  monthPlaceholder: string;
  yearPlaceholder: string;
  onNameChange: (value: string) => void;
  onDobDayChange: (value: string) => void;
  onDobMonthChange: (value: string) => void;
  onDobYearChange: (value: string) => void;
  onGenderChange: (value: string) => void;
};

export default function EditProfileForm({
  name,
  dobDay,
  dobMonth,
  dobYear,
  gender,
  nameLabel,
  dateOfBirthLabel,
  genderLabel,
  genderPlaceholder,
  dayPlaceholder,
  monthPlaceholder,
  yearPlaceholder,
  onNameChange,
  onDobDayChange,
  onDobMonthChange,
  onDobYearChange,
  onGenderChange,
}: Props) {
  const { colors } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  const toggleDropdown = (key: DropdownKey) =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  const dropdownStyle = [
    styles.dropdown,
    { backgroundColor: colors.surface, borderColor: colors.border },
  ];

  const genderDisplay = gender
    ? gender.charAt(0) + gender.slice(1).toLowerCase()
    : null;

  return (
    <View style={styles.container}>
      {/* Name */}
      <View style={styles.fieldGroup}>
        <Text weight="medium" style={styles.label}>{nameLabel}</Text>
        <TextInput
          value={name}
          onChangeText={onNameChange}
          style={inputStyle}
          placeholderTextColor={colors.mutedText}
          accessibilityLabel={nameLabel}
        />
      </View>

      {/* Date of birth — Day / Month / Year dropdowns */}
      <View style={styles.fieldGroup}>
        <Text weight="medium" style={styles.label}>{dateOfBirthLabel}</Text>
        <View style={styles.dobRow}>
          {/* Day */}
          <View style={styles.dobColumn}>
            <Pressable
              onPress={() => toggleDropdown('day')}
              style={inputStyle}
              accessibilityRole="button"
              accessibilityLabel={dayPlaceholder}
            >
              <Text
                weight="regular"
                color={dobDay ? colors.text : colors.mutedText}
                style={styles.inputText}
              >
                {dobDay || dayPlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.mutedText} />
            </Pressable>
            {openDropdown === 'day' && (
              <ScrollView style={[dropdownStyle, styles.dobDropdown]} nestedScrollEnabled>
                {DAYS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => { onDobDayChange(d); setOpenDropdown(null); }}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      { backgroundColor: pressed ? colors.backgroundTertiary : colors.surface },
                    ]}
                    accessibilityRole="button"
                  >
                    <Text weight={dobDay === d ? 'semiBold' : 'regular'} color={colors.text}>{d}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Month */}
          <View style={styles.dobColumn}>
            <Pressable
              onPress={() => toggleDropdown('month')}
              style={inputStyle}
              accessibilityRole="button"
              accessibilityLabel={monthPlaceholder}
            >
              <Text
                weight="regular"
                color={dobMonth ? colors.text : colors.mutedText}
                style={styles.inputText}
              >
                {dobMonth || monthPlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.mutedText} />
            </Pressable>
            {openDropdown === 'month' && (
              <ScrollView style={[dropdownStyle, styles.dobDropdown]} nestedScrollEnabled>
                {MONTHS.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => { onDobMonthChange(m); setOpenDropdown(null); }}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      { backgroundColor: pressed ? colors.backgroundTertiary : colors.surface },
                    ]}
                    accessibilityRole="button"
                  >
                    <Text weight={dobMonth === m ? 'semiBold' : 'regular'} color={colors.text}>{m}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Year */}
          <View style={styles.dobColumn}>
            <Pressable
              onPress={() => toggleDropdown('year')}
              style={inputStyle}
              accessibilityRole="button"
              accessibilityLabel={yearPlaceholder}
            >
              <Text
                weight="regular"
                color={dobYear ? colors.text : colors.mutedText}
                style={styles.inputText}
              >
                {dobYear || yearPlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.mutedText} />
            </Pressable>
            {openDropdown === 'year' && (
              <ScrollView style={[dropdownStyle, styles.dobDropdown]} nestedScrollEnabled>
                {YEARS.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => { onDobYearChange(y); setOpenDropdown(null); }}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      { backgroundColor: pressed ? colors.backgroundTertiary : colors.surface },
                    ]}
                    accessibilityRole="button"
                  >
                    <Text weight={dobYear === y ? 'semiBold' : 'regular'} color={colors.text}>{y}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      {/* Gender */}
      <View style={[styles.fieldGroup, { zIndex: 10, position: 'relative' }]}>
        <Text weight="medium" style={styles.label}>{genderLabel}</Text>
        <Pressable
          onPress={() => toggleDropdown('gender')}
          style={inputStyle}
          accessibilityRole="button"
          accessibilityLabel={genderLabel}
        >
          <Text
            weight="regular"
            color={gender ? colors.text : colors.mutedText}
            style={styles.inputText}
          >
            {genderDisplay || genderPlaceholder}
          </Text>
          <Ionicons
            name={openDropdown === 'gender' ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.mutedText}
          />
        </Pressable>
        {openDropdown === 'gender' && (
          <View style={[dropdownStyle, styles.genderDropdown]}>
            {GENDER_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => { onGenderChange(option); setOpenDropdown(null); }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  { backgroundColor: pressed ? colors.backgroundTertiary : colors.surface },
                ]}
                accessibilityRole="button"
              >
                <Text weight={gender === option ? 'semiBold' : 'regular'} color={colors.text}>
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingHorizontal: 16, paddingVertical: 12 },
  dobColumn: { flex: 1 },
  dobDropdown: { maxHeight: 180, marginTop: 4 },
  dobRow: { flexDirection: 'row', gap: 8 },
  dropdown: { borderRadius: 6, borderWidth: 1 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 10 },
  fieldGroup: { gap: 4 },
  genderDropdown: { position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 30 },
  input: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    fontSize: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputText: { flex: 1, fontSize: 16 },
  label: { fontSize: 14, lineHeight: 22 },
});
