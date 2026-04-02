import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Language {
  code: string
  name: string
}

export interface Group {
  id: string
  name: string
  color: string
  isDefault: boolean
}

export type WordStatus = 'new' | 'in_progress' | 'learned'

export interface Word {
  id: string
  groupId: string
  original: string
  translation: string
  example: string
  status: WordStatus
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'uk', name: 'Ukrainian' },
]

function pickColor(groups: Group[]): string {
  const used = new Set(groups.map(g => g.color))
  const hueStep = 37
  let hue = (groups.length * hueStep) % 360
  for (let i = 0; i < 360; i++) {
    const color = `hsl(${hue}, 65%, 55%)`
    if (!used.has(color)) return color
    hue = (hue + hueStep) % 360
  }
  return `hsl(${hue}, 65%, 55%)`
}

const DEFAULT_GROUP: Group = {
  id: 'main',
  name: 'Main',
  color: 'hsl(0, 65%, 55%)',
  isDefault: true,
}

interface AppState {
  nativeLanguage: Language | null
  learningLanguage: Language | null
  isConfigured: boolean
  groups: Group[]
  words: Word[]
  setNativeLanguage: (lang: Language) => void
  setLearningLanguage: (lang: Language) => void
  completeSetup: () => void
  resetConfig: () => void
  addGroup: (name: string) => void
  updateGroup: (id: string, name: string, color: string) => void
  deleteGroup: (id: string) => void
  addWord: (groupId: string, original: string, translation: string, example: string) => void
  updateWord: (id: string, original: string, translation: string, example: string) => void
  updateWordStatus: (id: string, status: WordStatus) => void
  deleteWord: (id: string) => void
  getWordsByGroup: (groupId: string) => Word[]
  importData: (data: { nativeLanguage: Language | null; learningLanguage: Language | null; isConfigured: boolean; groups: Group[]; words: Word[] }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      nativeLanguage: null,
      learningLanguage: null,
      isConfigured: false,
      groups: [DEFAULT_GROUP],
      words: [],
      setNativeLanguage: (lang) => set({ nativeLanguage: lang }),
      setLearningLanguage: (lang) => set({ learningLanguage: lang }),
      completeSetup: () => set({ isConfigured: true }),
      resetConfig: () => set({
        nativeLanguage: null,
        learningLanguage: null,
        isConfigured: false
      }),
      addGroup: (name) => set((state) => ({
        groups: [
          ...state.groups,
          {
            id: crypto.randomUUID(),
            name,
            color: pickColor(state.groups),
            isDefault: false,
          }
        ]
      })),
      updateGroup: (id, name, color) => set((state) => ({
        groups: state.groups.map(g => g.id === id ? { ...g, name, color } : g)
      })),
      deleteGroup: (id) => set((state) => ({
        groups: state.groups.filter(g => g.id !== id || g.isDefault),
        words: state.words.filter(w => w.groupId !== id)
      })),
      addWord: (groupId, original, translation, example) => set((state) => ({
        words: [
          ...state.words,
          {
            id: crypto.randomUUID(),
            groupId,
            original,
            translation,
            example,
            status: 'new' as WordStatus,
          }
        ]
      })),
      updateWord: (id, original, translation, example) => set((state) => ({
        words: state.words.map(w => w.id === id ? { ...w, original, translation, example } : w)
      })),
      updateWordStatus: (id, status) => set((state) => ({
        words: state.words.map(w => w.id === id ? { ...w, status } : w)
      })),
      deleteWord: (id) => set((state) => ({
        words: state.words.filter(w => w.id !== id)
      })),
      getWordsByGroup: (groupId) => get().words.filter(w => w.groupId === groupId),
      importData: (data) => set({
        nativeLanguage: data.nativeLanguage,
        learningLanguage: data.learningLanguage,
        isConfigured: data.isConfigured,
        groups: data.groups,
        words: data.words,
      }),
    }),
    {
      name: 'quad-lang-storage',
    }
  )
)
