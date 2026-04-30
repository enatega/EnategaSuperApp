import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import type { ProfileAddress } from "../../../../../../general/api/profileService";
import HomeVisitsAddressHeader from "../../../../components/HomeVisitsAddressHeader";
import HomeVisitsSearchInputWithFilter from "../../../../components/search/HomeVisitsSearchInputWithFilter";
import HomeVisitsSelectedFilterChips from "../../../../components/filters/HomeVisitsSelectedFilterChips";
import Text from "../../../../../../general/components/Text";
import Icon from "../../../../../../general/components/Icon";
import { useTheme } from "../../../../../../general/theme/theme";

type Props = {
  addresses: ProfileAddress[];
  avatarUri?: string;
  clearAllLabel: string;
  greetingName: string;
  onAddressPress: () => void;
  onOpenNotifications: () => void;
  searchFlow: any;
  searchPlaceholder: string;
  tGeneralNotificationsTitle: string;
};

export default function HomeHeroSection({
  addresses,
  avatarUri,
  clearAllLabel,
  greetingName,
  onAddressPress,
  onOpenNotifications,
  searchFlow,
  searchPlaceholder,
  tGeneralNotificationsTitle,
}: Props) {
  const { colors, typography } = useTheme();
  const greetingLabel = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <View style={styles.heroSection}>
      <HomeVisitsAddressHeader
        addresses={addresses}
        addressVariant="label"
        onAddressPress={onAddressPress}
        horizontalPadding={0}
        rightAccessory={
          <View style={styles.heroActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={tGeneralNotificationsTitle}
              onPress={onOpenNotifications}
              style={({ pressed }) => [
                styles.iconCircle,
                {
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.84 : 1,
                },
              ]}
            >
              <Icon
                type="Ionicons"
                name="notifications-outline"
                size={24}
                color={colors.text}
              />
            </Pressable>
            <View
              style={[
                styles.avatarShell,
                { backgroundColor: colors.backgroundTertiary },
              ]}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Icon
                  type="Ionicons"
                  name="person"
                  size={20}
                  color={colors.iconMuted}
                />
              )}
            </View>
          </View>
        }
      />

      <View style={styles.greetingSection}>
        <Text
          weight="semiBold"
          style={[
            styles.greetingText,
            {
              color: colors.text,
              fontSize: typography.size.xl2,
              lineHeight: typography.lineHeight.xl,
            },
          ]}
        >
          {greetingLabel},{" "}
          <Text
            weight="extraBold"
            style={[
              styles.greetingText,
              {
                color: colors.primary,
                fontSize: typography.size.xl2,
                lineHeight: typography.lineHeight.xl,
              },
            ]}
          >
            {greetingName}
          </Text>
          {" "}👋
        </Text>
        <Text
          style={[
            styles.greetingSubtitle,
            {
              color: colors.mutedText,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md,
            },
          ]}
        >
          What service do you need today?
        </Text>
      </View>

      <HomeVisitsSearchInputWithFilter
        searchValue={searchFlow.searchQuery}
        onSearchChangeText={searchFlow.handleChangeText}
        searchPlaceholder={searchPlaceholder}
        onOpenFilters={searchFlow.openFilters}
        isFilterVisible={
          searchFlow.services.length > 0 || searchFlow.hasAppliedFilters
        }
        onSubmitEditing={searchFlow.handleSubmitEditing}
        onClear={searchFlow.handleClear}
        onFocus={searchFlow.handleFocus}
        onBlur={searchFlow.handleBlur}
      />

      {searchFlow.hasAppliedFilters ? (
        <HomeVisitsSelectedFilterChips
          chips={searchFlow.chips}
          clearAllLabel={clearAllLabel}
          onRemoveChip={searchFlow.removeChip}
          onClearAll={searchFlow.clearAllFilters}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    alignItems: "center",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  avatarShell: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
    width: 40,
  },
  avatarImage: {
    height: "100%",
    width: "100%",
  },
  greetingSection: {
    gap: 4,
  },
  greetingText: {
    letterSpacing: -0.2,
  },
  greetingSubtitle: {
    letterSpacing: -0.1,
  },
});
