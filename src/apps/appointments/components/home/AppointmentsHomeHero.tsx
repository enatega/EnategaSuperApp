import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import BannerSwiper from "../../../../general/components/BannerSwiper";
import Image from "../../../../general/components/Image";
import Skeleton from "../../../../general/components/Skeleton";
import Text from "../../../../general/components/Text";
import { homePatterns } from "../../../../general/assets/images";
import { useTheme } from "../../../../general/theme/theme";
import type { AppointmentBanner } from "../../api/types";

type Props = {
  banners: AppointmentBanner[];
  isPending: boolean;
  title: string;
  body: string;
  bookingsLabel: string;
  onBookingsPress: () => void;
};

export default function AppointmentsHomeHero({
  banners,
  isPending,
  title,
  body,
  bookingsLabel,
  onBookingsPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { width } = useWindowDimensions();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerSidePadding = 4;
  const bannerWidth = width - 40;
  const activeBannerIndex =
    banners.length > 0 ? Math.min(bannerIndex, banners.length - 1) : 0;

  const fallbackBanner = useMemo<AppointmentBanner>(
    () => ({
      id: "fallback-banner",
      title,
      description: body,
      bannerImageLink: null,
      bannerVideoLink: null,
      relatedStore: null,
      store: null,
    }),
    [body, title],
  );

  const heroBanners = banners.length > 0 ? banners : [fallbackBanner];

  if (isPending) {
    return (
      <View style={styles.skeletonWrap}>
        <Skeleton borderRadius={28} height={184} width="100%">
          <View style={styles.skeletonContent}>
            <Skeleton borderRadius={6} height={14} width={84} />
            <Skeleton borderRadius={10} height={32} width="62%" />
            <Skeleton borderRadius={8} height={16} width="78%" />
            <Skeleton borderRadius={8} height={16} width="48%" />
          </View>
        </Skeleton>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <BannerSwiper
        data={heroBanners}
        onIndexChange={setBannerIndex}
        renderItem={({ item }) => {
          const imageUri =
            item.bannerImageLink?.trim() ??
            item.store?.coverImage?.trim() ??
            item.store?.storeImage?.trim() ??
            "";
          const description = item.description?.trim() || body;
          const locationLabel = item.store?.address?.trim();

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.backgroundTertiary,
                  marginHorizontal: bannerSidePadding,
                  width: bannerWidth,
                },
              ]}
            >
              {imageUri ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: imageUri }}
                  style={styles.media}
                />
              ) : (
                <LinearGradient
                  colors={[colors.warning, "#FFB648"]}
                  start={{ x: 0.1, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.media}
                />
              )}

              {!imageUri ? (
                <Image
                  resizeMode="stretch"
                  source={homePatterns.banner}
                  style={[styles.media, styles.fallbackMedia]}
                />
              ) : null}

              <LinearGradient
                colors={[
                  "rgba(0,0,0,0.62)",
                  "rgba(0,0,0,0.4)",
                  "rgba(0,0,0,0.7)",
                ]}
                end={{ x: 0.85, y: 1 }}
                locations={[0, 0.48, 1]}
                start={{ x: 0.1, y: 0 }}
                style={styles.overlay}
              />

              {locationLabel ? (
                <View style={styles.topRow}>
                  <Text
                    color={colors.white}
                    weight="bold"
                    style={styles.kicker}
                    numberOfLines={1}
                  >
                    {locationLabel}
                  </Text>
                </View>
              ) : null}

              <View style={styles.content}>
                <Text
                  color={colors.white}
                  weight="extraBold"
                  numberOfLines={2}
                  style={[
                    styles.title,
                    {
                      fontSize: typography.size.xxl,
                      lineHeight: typography.lineHeight.xl,
                    },
                  ]}
                >
                  {item.title || title}
                </Text>

                <Text
                  color={colors.white}
                  numberOfLines={3}
                  weight="medium"
                  style={styles.description}
                >
                  {description}
                </Text>

                <View style={styles.footerRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onBookingsPress}
                    style={({ pressed }) => [
                      styles.primaryAction,
                      { backgroundColor: "rgba(255,255,255,0.2)" },
                      pressed ? styles.primaryActionPressed : null,
                    ]}
                  >
                    <Text color={colors.white} weight="bold">
                      {bookingsLabel}
                    </Text>
                  </Pressable>

                  <View style={styles.pager}>
                    {heroBanners.map((banner, index) => (
                      <View
                        key={banner.id}
                        style={[
                          styles.pagerDot,
                          index === activeBannerIndex
                            ? styles.pagerDotActive
                            : styles.pagerDotInactive,
                          {
                            backgroundColor:
                              index === activeBannerIndex
                                ? colors.white
                                : "rgba(255,255,255,0.35)",
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    borderRadius: 28,
    height: 184,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 18,
    paddingHorizontal: 18,
    paddingTop: 42,
    zIndex: 1,
  },
  description: {
    marginTop: 8,
    maxWidth: "82%",
  },
  fallbackMedia: {
    opacity: 0.25,
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  kicker: {
    fontSize: 12,
    lineHeight: 16,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pager: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  pagerDot: {
    borderRadius: 999,
    height: 6,
  },
  pagerDotActive: {
    width: 18,
  },
  pagerDotInactive: {
    width: 6,
  },
  primaryAction: {
    borderRadius: 16,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryActionPressed: {
    opacity: 0.8,
  },
  skeletonContent: {
    gap: 12,
    justifyContent: "flex-end",
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  skeletonWrap: {
    paddingHorizontal: 16,
  },
  title: {
    letterSpacing: -0.8,
  },
  topRow: {
    left: 18,
    position: "absolute",
    right: 18,
    top: 18,
    zIndex: 1,
  },
  wrapper: {
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
});
