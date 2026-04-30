import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import SupportFaqListItem from '../../../../general/components/support/SupportFaqListItem';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { SupportFaqNavigationProp } from '../../navigation/supportNavigationTypes';
import { supportFaqArticles } from '../../utils/supportFaqArticles';

export default function SupportFaqScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<SupportFaqNavigationProp>();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          color={colors.text}
          weight="extraBold"
          style={[styles.title, { fontSize: typography.size.h5, lineHeight: 38 }]}
        >
          {t('support_faq_title')}
        </Text>

        <View style={styles.list}>
          {supportFaqArticles.map((item) => (
            <SupportFaqListItem
              key={item.id}
              label={t(item.titleKey)}
              onPress={() => navigation.navigate('SupportFaqArticle', { articleId: item.id })}
            />
          ))}
        </View>
      </ScrollView>

      <SupportChatFooter
        ctaLabel={t('support_chat_cta')}
        onPress={() => navigation.navigate('SupportChat', { agentName: t('support_chat_agent_name') })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  list: {
    paddingBottom: 16,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  title: {
    marginBottom: 18,
    maxWidth: 340,
  },
});
