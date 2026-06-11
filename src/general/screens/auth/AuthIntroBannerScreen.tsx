import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import StartupPromotionalBannerModal from '../../components/promotionalBanner/StartupPromotionalBannerModal';
import { useIntroBannerQuery } from '../../hooks/useIntroBannerQuery';
import { useTheme } from '../../theme/theme';
import { authSession } from '../../auth/authSession';
import { resetToSharedRoute } from '../../navigation/rootNavigation';

type Props = {
  navigation: {
    replace: (screen: string) => void;
  };
};

export default function AuthIntroBannerScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [hasResolvedAuthState, setHasResolvedAuthState] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const introBannerQuery = useIntroBannerQuery('deliveries');

  useEffect(() => {
    let isMounted = true;

    async function resolveAuthState() {
      const token = await authSession.getAccessToken();

      if (!isMounted) {
        return;
      }

      setHasToken(Boolean(token));
      setHasResolvedAuthState(true);
    }

    void resolveAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasResolvedAuthState) {
      return;
    }

    if (introBannerQuery.isLoading || introBannerQuery.isFetching) {
      return;
    }

    if (!introBannerQuery.data?.mediaUri) {
      if (hasToken) {
        resetToSharedRoute('Deliveries');
        return;
      }

      navigation.replace('login');
    }
  }, [
    hasResolvedAuthState,
    hasToken,
    introBannerQuery.data?.mediaUri,
    introBannerQuery.isFetching,
    introBannerQuery.isLoading,
    navigation,
  ]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {introBannerQuery.data?.mediaUri ? (
        <StartupPromotionalBannerModal
          visible
          mediaUri={introBannerQuery.data.mediaUri}
          onClose={() => {
            if (hasToken) {
              resetToSharedRoute('Deliveries');
              return;
            }

            navigation.replace('login');
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
