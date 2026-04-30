import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportChatFooter from '../../../../general/components/support/SupportChatFooter';
import SupportFaqListItem from '../../../../general/components/support/SupportFaqListItem';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsStackParamList } from '../../navigation/types';

export default function HomeVisitsSupportFaqScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NavigationProp<HomeVisitsStackParamList>>();

  const faqLabels = useMemo(
    () => [
      t('home_visits_support_faq_item_1'),
      t('home_visits_support_faq_item_2'),
      t('home_visits_support_faq_item_3'),
      t('home_visits_support_faq_item_4'),
      t('home_visits_support_faq_item_5'),
      t('home_visits_support_faq_item_6'),
    ],
    [t],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Text
          color={colors.text}
          style={[styles.title, { fontSize: typography.size.h5, lineHeight: 38 }]}
          weight="extraBold"
        >
          {t('home_visits_support_faq_title')}
        </Text>

        <View style={styles.list}>
          {faqLabels.map((item, index) => (
            <SupportFaqListItem
              key={`${item}-${index}`}
              label={item}
              onPress={() => navigation.navigate('SupportChat')}
            />
          ))}
        </View>
      </ScrollView>

      <SupportChatFooter
        ctaLabel={t('home_visits_support_chat_cta')}
        onPress={() => navigation.navigate('SupportChat')}
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
