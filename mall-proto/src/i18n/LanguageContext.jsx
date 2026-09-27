import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'))
  }, [])

  /**
   * Translate a key like 'home.searchPlaceholder' for the current language
   * Falls back to the key itself if not found
   */
  const t = useCallback(
    (key) => {
      const parts = key.split('.')
      let result = translations[lang]
      for (const part of parts) {
        if (result == null) break
        result = result[part]
      }
      return result != null ? result : key
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access language state and translation function
 * @returns {{ lang: string, setLang: Function, toggleLang: Function, t: Function }}
 */
export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return ctx
}