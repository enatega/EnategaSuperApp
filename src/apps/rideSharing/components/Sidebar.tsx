import React, { useCallback } from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Pressable,
  ScrollView,
  Image,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../../general/components/Text";
import SidebarItem from "./SidebarItem";
import Icon from "../../../general/components/Icon";
import { useTheme } from "../../../general/theme/theme";
import { useTranslation } from "react-i18next";

export type UserProfile = {
  name: string;
  email: string;
  rating?: number;
  reviewCount?: number;
  avatarUri?: string;
};

export type MenuItem = {
  id: string;
  icon: string;
  iconLibrary?:
    | "Ionicons"
    | "MaterialIcons"
    | "MaterialCommunityIcons"
    | "Feather"
    | "AntDesign";
  titleKey: string;
  subtitleKey?: string;
  showChevron?: boolean;
  onPress?: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  menuItems?: MenuItem[];
  onLogout?: () => void;
  onProfilePress?: () => void;
};

export default function Sidebar({
  visible,
  onClose,
  userProfile,
  menuItems = [],
  onLogout,
  onProfilePress,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("rideSharing");
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const sidebarWidth = React.useMemo(
    () => Math.min(420, Math.max(280, windowWidth * 0.86)),
    [windowWidth]
  );
  const slideAnim = React.useRef(new Animated.Value(-sidebarWidth)).current;
  const overlayAnim = React.useRef(new Animated.Value(0)).current;
  const visibleRef = React.useRef(visible);

  React.useEffect(() => {
    if (!visibleRef.current && !visible) {
      slideAnim.setValue(-sidebarWidth);
    }

    // If opening and was previously closed, reset position first
    if (visible && !visibleRef.current) {
      slideAnim.setValue(-sidebarWidth);
      overlayAnim.setValue(0);
    }
    visibleRef.current = visible;

    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -sidebarWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [overlayAnim, sidebarWidth, slideAnim, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOverlayPress = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: overlayAnim,
            },
          ]}
        >
          <Pressable
            style={styles.overlayPressable}
            onPress={handleOverlayPress}
          />
        </Animated.View>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              backgroundColor: colors.surface,
              width: sidebarWidth,
              transform: [{ translateX: slideAnim }],
              paddingTop: Math.max(insets.top, 20),
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* User Profile Header */}
            {userProfile ? (
              <TouchableOpacity
                onPress={() => {
                  onProfilePress?.();
                  handleClose();
                }}
                style={styles.profileHeader}
              >
                <View style={styles.avatarContainer}>
                  {userProfile.avatarUri ? (
                    <Image
                      source={{ uri: userProfile.avatarUri }}
                      style={styles.avatarImage}
                    />
                  ) : userProfile.name ? (
                    <View style={styles.avatarPlaceholder}>
                      <Text variant="title" weight="bold">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <Icon
                      type="Ionicons"
                      name="person"
                      size={32}
                      color={colors.mutedText}
                    />
                  )}
                </View>
                <View style={styles.profileInfo}>
                  <Text variant="subtitle" weight="semiBold" color={colors.text}>
                    {userProfile.name}
                  </Text>
                  {userProfile.email && (
                    <Text variant="body" color={colors.mutedText}>
                      {userProfile.email}
                    </Text>
                  )}
                  {userProfile.rating ? (
                    <View style={styles.ratingContainer}>
                      <Icon
                        type="Ionicons"
                        name="star"
                        size={16}
                        color="#FFC107"
                      />
                      <Text
                        variant="caption"
                        weight="medium"
                        color={colors.mutedText}
                      >
                        {userProfile.rating.toFixed(2)} (
                        {userProfile.reviewCount || 0})
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Icon
                  type="Ionicons"
                  name="chevron-forward"
                  size={24}
                  color={colors.mutedText}
                />
              </TouchableOpacity>
            ) : null}

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  iconLibrary={item.iconLibrary}
                  title={t(item.titleKey)}
                  subtitle={item.subtitleKey ? t(item.subtitleKey) : undefined}
                  showChevron={item.showChevron}
                  onPress={() => {
                    item.onPress?.();
                    handleClose();
                  }}
                />
              ))}
            </View>

            {/* Logout Button */}
            {onLogout ? (
              <View style={styles.logoutContainer}>
                <View
                  style={[styles.logoutDivider, { backgroundColor: colors.border }]}
                />
                <TouchableOpacity
                  onPress={onLogout}
                  style={[styles.logoutButton, { borderColor: colors.danger }]}
                >
                  <Text
                    variant="body"
                    weight="semiBold"
                    color={colors.danger}
                  >
                    {t("logout")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
  },
  overlayPressable: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 12,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
  },
  logoutContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  logoutDivider: {
    width: "100%",
    height: 1,
    marginBottom: 14,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
