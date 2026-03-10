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
            backgroundColor: '#FFF3D6',
            borderBottomColor: '#F3D08B',
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <View style={styles.iconWrap}>
          <Icon type="Feather" name="wifi-off" size={16} color="#9A6700" />
        </View>
        <View style={styles.content}>
          <Text
            weight="semiBold"
            color="#7A4B00"
            style={[styles.title, { fontSize: typography.size.sm2 }]}
          >
            {t('offline_notice_title')}
          </Text>
          <Text
            color="rgba(122,75,0,0.84)"
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
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
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
