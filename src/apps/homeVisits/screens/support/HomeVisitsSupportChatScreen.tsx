import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsStackParamList } from '../../navigation/types';

export default function HomeVisitsSupportChatScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const route = useRoute<RouteProp<HomeVisitsStackParamList, 'SupportChat'>>();
  const [draft, setDraft] = useState('');
  const title = route.params?.agentName ?? t('home_visits_support_chat_title');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('home_visits_support_back_action')}
        rightAccessibilityLabel={t('support_call_action')}
        title={title}
      />

      <View style={styles.emptyWrap}>
        <MaterialCommunityIcons
          color={colors.iconMuted}
          name="message-alert-outline"
          size={86}
        />
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.xl2,
            lineHeight: typography.lineHeight.xl2,
            marginTop: 18,
            textAlign: 'center',
          }}
          weight="semiBold"
        >
          {t('home_visits_support_chat_empty', { ns: 'homeVisits' })}
        </Text>
      </View>

      <View style={[styles.composerWrap, { borderTopColor: colors.border }]}>
        <TextInput
          onChangeText={setDraft}
          placeholder={t('home_visits_support_chat_input_placeholder', { ns: 'homeVisits' })}
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            {
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            },
          ]}
          value={draft}
        />
        <View style={styles.composerActions}>
          <Pressable style={styles.iconLeft}>
            <MaterialCommunityIcons color={colors.iconColor} name="plus" size={28} />
          </Pressable>
          <Pressable
            disabled={!draft.trim()}
            style={[styles.sendButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <MaterialCommunityIcons
              color={draft.trim() ? colors.iconColor : colors.iconDisabled}
              name="send-outline"
              size={22}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  composerWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 6,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  emptyWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconLeft: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  input: {
    minHeight: 44,
    paddingVertical: 8,
  },
  screen: {
    flex: 1,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
