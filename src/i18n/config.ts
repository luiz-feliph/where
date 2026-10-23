import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import common from './locales/pt-BR/common.json'
import validation from './locales/pt-BR/validation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        common,
        validation,
      },
    },
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
    ns: ['common', 'validation'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
