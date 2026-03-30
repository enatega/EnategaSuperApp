import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  riderName: string;
};

export default function RiderChatHeader({ riderName }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation('deliveries');

  return (
    <ScreenHeader
      showBack={false}
      leftSlot={(
        <View style={styles.leftContent}>
          <Pressable
            accessibilityLabel={t('support_back_action')}
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <View style={[styles.avatar, { backgroundColor: colors.cardBlue }]}>
            <Text weight="bold" style={styles.avatarLabel}>
              {riderName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text weight="medium" style={styles.name}>
            {riderName}
          </Text>
        </View>
      )}
      leftSlotContainerStyle={styles.leftSlotContainer}
      rightSlot={(
        <Pressable
          accessibilityLabel={t('rider_chat_call_action')}
          accessibilityRole="button"
          style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Ionicons name="call-outline" size={24} color={colors.text} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarLabel: {
    fontSize: 22,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  leftContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  leftSlotContainer: {
    width: 'auto',
  },
  name: {
    fontSize: 18,
  },
});
