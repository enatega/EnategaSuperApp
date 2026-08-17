import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import Icon from './Icon';
import Text from './Text';

type Props = {
  forceVisible?: boolean;
};

export default function OfflineNotice({ forceVisible = false }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const insets = useSafeAreaInsets();
  const [isOffline, setIsOffline] = useState(false);
  const isVisible = forceVisible || isOffline;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      const reachable = state.isInternetReachable ?? connected;
      setIsOffline(!(connected && reachable));
    });

    return unsubscribe;
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.warningSoft,
            borderBottomColor: colors.warning,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.warningSoft }]}>
          <Icon type="Feather" name="wifi-off" size={16} color={colors.warningText} />
        </View>
        <View style={styles.content}>
          <Text
            weight="semiBold"
            color={colors.warningText}
            style={[styles.title, { fontSize: typography.size.sm2 }]}
          >
            {t('offline_notice_title')}
          </Text>
          <Text
            color={colors.warningText}
            style={[styles.subtitle, { fontSize: typography.size.xs2 }]}
          >
            {t('offline_notice_description')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    lineHeight: 18,
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 16,
  },
});
