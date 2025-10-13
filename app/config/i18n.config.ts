import en from './locales/en.json'
import tr from './locales/tr.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    tr,
    de,
    fr,
    es,
  }
}))
