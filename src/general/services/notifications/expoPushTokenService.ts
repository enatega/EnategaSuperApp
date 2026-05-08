import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let cachedToken: string | null = null;
let inFlightTokenPromise: Promise<string | null> | null = null;

function getEasProjectId(): string | undefined {
  const expoConfigProjectId = Constants.expoConfig?.extra?.eas?.projectId;
  const easConfigProjectId = Constants.easConfig?.projectId;
  const envProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  return easConfigProjectId ?? expoConfigProjectId ?? envProjectId;
}

async function ensureAndroidNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
  });
}

async function getPushTokenInternal(): Promise<string | null> {
  try {
    await ensureAndroidNotificationChannel();

    const permissions = await Notifications.getPermissionsAsync();
    let status = permissions.status;

    if (status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }

    if (status !== "granted") {
      return null;
    }

    const projectId = getEasProjectId();
    const response = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();

    return response.data ?? null;
  } catch {
    return null;
  }
}

export async function getExpoPushTokenForAuth(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }

  inFlightTokenPromise = getPushTokenInternal();

  try {
    const token = await inFlightTokenPromise;
    if (token) {
      cachedToken = token;
    }
    console.log("Expo Push Token for Auth:", token);
    return token;
  } finally {
    inFlightTokenPromise = null;
  }
}

