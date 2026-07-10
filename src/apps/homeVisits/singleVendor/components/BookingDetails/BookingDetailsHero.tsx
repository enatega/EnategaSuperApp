import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  heroImage?: string | null;
  topInset: number;
  onBack: () => void;
  onClose: () => void;
};

export default function BookingDetailsHero({ heroImage, topInset, onBack, onClose }: Props) {
  const { colors } = useTheme();
  const hasHeroImage = Boolean(heroImage);

  return (
    <View style={[styles.hero, { backgroundColor: colors.backgroundTertiary }]}>
      {hasHeroImage ? (
        <ImageBackground
          resizeMode="contain"
          source={{ uri: heroImage! }}
          style={styles.heroImage}
        >
          <View
            style={[
              styles.heroOverlay,
              { backgroundColor: colors.overlayDark20 },
            ]}
          />
        </ImageBackground>
      ) : null}

      <View style={[styles.heroOverlay, { backgroundColor: colors.overlayDark20 }]} />
      <View style={[styles.heroActions, { paddingTop: topInset + 8 }]}>
        <Pressable
          onPress={onBack}
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            color={colors.text}
            name="arrow-left"
            size={22}
          />
        </Pressable>
        <Pressable
          onPress={onClose}
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialCommunityIcons
            color={colors.text}
            name="close"
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  hero: {
    height: 212,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
