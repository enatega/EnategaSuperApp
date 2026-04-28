import * as SecureStore from "expo-secure-store";

const REMEMBERED_CREDENTIALS_KEY = "super_app_remembered_credentials";

type RememberedCredentialsMap = Record<string, string>;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getCredentialsMap = async (): Promise<RememberedCredentialsMap> => {
  const raw = await SecureStore.getItemAsync(REMEMBERED_CREDENTIALS_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as RememberedCredentialsMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const setCredentialsMap = async (value: RememberedCredentialsMap) => {
  await SecureStore.setItemAsync(
    REMEMBERED_CREDENTIALS_KEY,
    JSON.stringify(value),
  );
};

export const rememberedCredentials = {
  async getPassword(email: string): Promise<string | null> {
    const map = await getCredentialsMap();
    return map[normalizeEmail(email)] ?? null;
  },

  async save(email: string, password: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) return;

    const map = await getCredentialsMap();
    map[normalizedEmail] = password;
    await setCredentialsMap(map);
  },

  async remove(email: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return;

    const map = await getCredentialsMap();
    if (!(normalizedEmail in map)) return;

    delete map[normalizedEmail];
    await setCredentialsMap(map);
  },
};
