import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import SupportFaqHelpfulActions from '../../components/support/SupportFaqHelpfulActions';
import { SupportFaqArticleRouteProp, type SupportFaqNavigationProp } from '../../navigation/supportNavigationTypes';
import { getSupportFaqArticleById } from '../../utils/supportFaqArticles';

export default function SupportFaqArticleScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<SupportFaqNavigationProp>();
  const route = useRoute<SupportFaqArticleRouteProp>();
  const article = getSupportFaqArticleById(route.params.articleId);

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
          {t(article.titleKey)}
        </Text>

        <View style={styles.body}>
          {article.bodyKeys.map((bodyKey) => (
            <Text
              key={bodyKey}
              color={colors.mutedText}
              style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
            >
              {t(bodyKey)}
            </Text>
          ))}
        </View>

        <SupportFaqHelpfulActions />
      </ScrollView>

      <SupportChatFooter
        ctaLabel={t('support_chat_cta')}
        onPress={() => navigation.navigate('SupportChat', { agentName: t('support_chat_agent_name') })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 20,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },
});
