import { useNavigate } from 'react-router-dom'
import { useAppStore, LANGUAGES } from '../store'
import './Config.css'

export function Config() {
  const navigate = useNavigate()
  const {
    nativeLanguage,
    learningLanguage,
    setNativeLanguage,
    setLearningLanguage,
    completeSetup
  } = useAppStore()

  const handleStart = () => {
    if (nativeLanguage && learningLanguage) {
      completeSetup()
      navigate('/')
    }
  }

  const canStart = nativeLanguage && learningLanguage && nativeLanguage.code !== learningLanguage.code

  return (
    <div className="config-container">
      <h1>Welcome to QuadLang</h1>
      <p className="config-subtitle">Set up your language pair to start learning</p>

      <div className="config-form">
        <div className="language-select">
          <label>I speak</label>
          <select
            value={nativeLanguage?.code || ''}
            onChange={(e) => {
              const lang = LANGUAGES.find(l => l.code === e.target.value)
              if (lang) setNativeLanguage(lang)
            }}
          >
            <option value="">Select your native language</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="language-select">
          <label>I want to learn</label>
          <select
            value={learningLanguage?.code || ''}
            onChange={(e) => {
              const lang = LANGUAGES.find(l => l.code === e.target.value)
              if (lang) setLearningLanguage(lang)
            }}
          >
            <option value="">Select language to learn</option>
            {LANGUAGES.filter(l => l.code !== nativeLanguage?.code).map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="start-button"
          onClick={handleStart}
          disabled={!canStart}
        >
          Start Learning
        </button>
      </div>
    </div>
  )
}
