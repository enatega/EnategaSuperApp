import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onPress?: () => void;
};

export const SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH = 64;

export default function SupportConversationDeleteAction({ onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <Pressable
      accessibilityLabel={t('support_conversations_delete_action')}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.action,
        {
          backgroundColor: colors.danger,
        },
      ]}
    >
      <Ionicons name="trash-outline" size={22} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    height: 74,
    justifyContent: 'center',
    width: SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH,
  },
});
