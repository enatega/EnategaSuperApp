import generalEn from './general/en';
import generalFr from './general/fr';
import { APP_I18N_RESOURCES } from '../../apps/registry/generated/appI18nRegistry';

export const translations = {
  en: {
    general: generalEn,
    ...APP_I18N_RESOURCES.en,
  },
  fr: {
    general: generalFr,
    ...APP_I18N_RESOURCES.fr,
  },
} as const;

export type Language = keyof typeof translations;
export type Namespace = keyof typeof translations.en;
