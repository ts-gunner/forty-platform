import { useTranslation } from '../i18n/LanguageContext'
import './LanguageToggle.css'

function LanguageToggle() {
  const { lang, toggleLang } = useTranslation()

  return (
    <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span className="lang-toggle__text">{lang === 'en' ? '中文' : 'EN'}</span>
    </button>
  )
}

export default LanguageToggle