import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { translations } from './translations';

const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;

const normalizeLanguage = (languageTag: string) => {
  console.log('Device language:', languageTag);
  const short =  languageTag?.split('-')?.[0];
  return SUPPORTED_LANGUAGES.includes(short as (typeof SUPPORTED_LANGUAGES)[number]) ? short : 'en';
};

const deviceLocale = Localization.getLocales?.()?.[0]?.languageTag ?? 'en';
const defaultLanguage = normalizeLanguage(deviceLocale);

void i18n
  .use(initReactI18next)
  .init({
    lng: defaultLanguage,
    fallbackLng: 'en',
    resources: {
      en: translations.en,
      fr: translations.fr,
    },
    ns: ['general', 'deliveries', 'rideSharing', 'homeVisits', 'appointments'],
    defaultNS: 'general',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
