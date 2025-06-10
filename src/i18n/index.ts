import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './translations';

// 初始化i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translations.en },
      zh: { translation: translations.zh }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// 获取初始语言
export const initLanguage = () => {
  const savedLang = localStorage.getItem('i18nextLng');
  return savedLang?.startsWith('zh') ? 'zh' : 'en';
};

export default i18n; 