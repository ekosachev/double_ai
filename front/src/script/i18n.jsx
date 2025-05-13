import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../../public/locales/en/translation.json';
import ruTranslations from '../../public/locales/ru/translation.json';


i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            ru: { translation: ruTranslations},
        },
        fallbackLng: 'ru',
    });

export default i18n;