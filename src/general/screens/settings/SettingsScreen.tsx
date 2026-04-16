import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import Button from '../../components/Button';
import ProfileMenuSection from '../../components/profile/ProfileMenuSection';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';

export type SettingsMenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
};

type Props = {
  deleteActionLabel?: string;
  menuSections: SettingsMenuItem[][];
  onPressDeleteAccount?: () => void;
  title?: string;
  versionLabel?: string;
};

export default function SettingsScreen({
  deleteActionLabel,
  menuSections,
  onPressDeleteAccount,
  title,
  versionLabel,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={title ?? t('settings_title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {menuSections.map((section, sectionIndex) => (
          <ProfileMenuSection key={`settings-section-${sectionIndex}`}>
            {section.map((item) => (
              <ProfileMenuItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
              />
            ))}
          </ProfileMenuSection>
        ))}
      </ScrollView>

      {deleteActionLabel || versionLabel ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          {deleteActionLabel ? (
            <Button
              label={deleteActionLabel}
              onPress={onPressDeleteAccount}
              variant="danger"
            />
          ) : null}
          {versionLabel ? (
            <Text variant="caption" color={colors.mutedText} style={styles.version}>
              {versionLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  version: {
    textAlign: 'center',
  },
});
