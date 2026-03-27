import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import { useTheme } from '../../../../general/theme/theme';
import { SupportHomeNavigationProp } from '../../navigation/supportNavigationTypes';

type Props = {
  onPress?: () => void;
};

export default function SupportChatFooter({ onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SupportHomeNavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    navigation.navigate('SupportChat', {
      agentName: t('support_chat_agent_name'),
    });
  };

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <Button
        label={t('support_chat_cta')}
        onPress={handlePress}
        icon={<Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.white} />}
        style={styles.footerButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerButton: {
    borderRadius: 6,
    minHeight: 44,
  },
});
