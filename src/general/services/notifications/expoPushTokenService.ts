import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let cachedToken: string | null = null;
let inFlightTokenPromise: Promise<string | null> | null = null;
const PUSH_TOKEN_TIMEOUT_MS = 4000;

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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.warn("Expo Push Token request timed out for Auth.");
      resolve(null);
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error("Expo Push Token request failed for Auth:", error);
        resolve(null);
      });
  });
}

async function getPushTokenInternal(): Promise<string | null> {
  try {
    if (!Constants.isDevice) {
      console.log("Skipping Expo Push Token for Auth on simulator/emulator.");
      return null;
    }

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
    const response = await withTimeout(
      projectId
        ? Notifications.getExpoPushTokenAsync({ projectId })
        : Notifications.getExpoPushTokenAsync(),
      PUSH_TOKEN_TIMEOUT_MS,
    );

    if (!response) {
      return null;
    }

    return response.data ?? null;
  } catch (error) {
    console.error("Unexpected Expo Push Token error for Auth:", error);
    return null;
  }
}

export async function getExpoPushTokenForAuth(): Promise<string | null> {
  console.log("Requesting Expo Push Token for Auth...");
  if (cachedToken) return cachedToken;

  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }

  inFlightTokenPromise = getPushTokenInternal();
  console.log("Fetching new Expo Push Token for Auth...");

  try {
    console.log("Waiting for new Expo Push Token for Auth...");
    const token = await inFlightTokenPromise;
    console.log("Fetched Expo Push Token for Auth:", token);
    if (token) {
      cachedToken = token;
    }
    console.log("Expo Push Token for Auth:", token);
    return token;
  } finally {
    console.log("Clearing in-flight token promise for Auth.");
    inFlightTokenPromise = null;
  }
}
