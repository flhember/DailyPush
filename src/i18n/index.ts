// src/i18n/index.ts
import { createInstance, InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import en from './en-US/translation.json';
import fr from './fr-FR/translation.json';

export const resources = {
  'en-US': { translation: en },
  'fr-FR': { translation: fr },
} as const;
export type Lang = keyof typeof resources;

export const i18n = createInstance();

const deviceLang = (): Lang =>
  (Localization.getLocales?.()[0]?.languageTag?.toLowerCase() ?? 'en-us').startsWith('fr')
    ? 'fr-FR'
    : 'en-US';

export async function initI18n() {
  if (i18n.isInitialized) return i18n;
  const saved = (await AsyncStorage.getItem('language')) as Lang | null;
  const lng: Lang = saved || deviceLang();

  const options: InitOptions = {
    resources,
    lng,
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
  };
  await i18n.use(initReactI18next).init(options);
  return i18n;
}

export async function changeLanguage(lng: Lang) {
  await i18n.changeLanguage(lng);
  await AsyncStorage.setItem('language', lng);
}

export default i18n;
