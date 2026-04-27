import { useState, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useAppStore } from '../store'
import type { Word, WordStatus } from '../store'
import './Group.css'

const STATUS_LABELS: Record<WordStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  learned: 'Learned',
}

type TabFilter = 'all' | WordStatus

export function Group() {
  const { id } = useParams<{ id: string }>()
  const { groups, words, nativeLanguage, learningLanguage, addWord, updateWord, updateWordStatus, updateGroup, deleteWord } = useAppStore()

  const handleExport = () => {
    const data = { nativeLanguage, learningLanguage, isConfigured: true, groups, words }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quadlang-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const [editingGroupName, setEditingGroupName] = useState(false)
  const [groupNameDraft, setGroupNameDraft] = useState('')
  const [groupColorDraft, setGroupColorDraft] = useState('')

  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  // View modal
  const [viewingWord, setViewingWord] = useState<Word | null>(null)

  // Practice modal
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [practiceWords, setPracticeWords] = useState<Word[]>([])
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [practiceInput, setPracticeInput] = useState('')
  const [translationRevealed, setTranslationRevealed] = useState(false)
  const [practiceCorrectWords, setPracticeCorrectWords] = useState<Word[]>([])
  const [practiceWrongWords, setPracticeWrongWords] = useState<{ word: Word, userAnswer: string }[]>([])
  const [practiceFinished, setPracticeFinished] = useState(false)
  const [practiceFeedback, setPracticeFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [practiceMode, setPracticeMode] = useState<'type' | 'choose'>('choose')
  const [choiceOptions, setChoiceOptions] = useState<string[]>([])
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [learnedInSession, setLearnedInSession] = useState<Set<string>>(new Set())
  const practiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Modal close animation
  const [modalClosing, setModalClosing] = useState(false)
  const pendingCloseRef = useRef<(() => void) | null>(null)

  const triggerClose = (action: () => void) => {
    pendingCloseRef.current = action
    setModalClosing(true)
  }

  const handleModalAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (pendingCloseRef.current) {
      pendingCloseRef.current()
      pendingCloseRef.current = null
    }
    setModalClosing(false)
  }

  // Edit/Add modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [formOriginal, setFormOriginal] = useState('')
  const [formTranslation, setFormTranslation] = useState('')
  const [formExample, setFormExample] = useState('')

  const group = groups.find(g => g.id === id)
  const groupWords = words.filter(w => w.groupId === id)
  const inProgressWords = groupWords.filter(w => w.status === 'in_progress')
  const filteredWords = activeTab === 'all'
    ? groupWords
    : groupWords.filter(w => (w.status || 'new') === activeTab)

  if (!group) {
    return <Navigate to="/" replace />
  }

  const tabCounts: Record<TabFilter, number> = {
    all: groupWords.length,
    new: groupWords.filter(w => (w.status || 'new') === 'new').length,
    in_progress: groupWords.filter(w => w.status === 'in_progress').length,
    learned: groupWords.filter(w => w.status === 'learned').length,
  }

  // View modal
  const openViewModal = (word: Word) => {
    setViewingWord(word)
  }

  const closeViewModal = () => {
    triggerClose(() => setViewingWord(null))
  }

  const handleStatusChange = (status: WordStatus) => {
    if (viewingWord) {
      updateWordStatus(viewingWord.id, status)
      setViewingWord({ ...viewingWord, status })
    }
  }

  // Practice modal
  const shuffle = (arr: Word[]): Word[] => {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  const clearPracticeTimer = () => {
    if (practiceTimerRef.current !== null) {
      clearTimeout(practiceTimerRef.current)
      practiceTimerRef.current = null
    }
  }

  const generateOptions = (word: Word): string[] => {
    const correct = word.translation
    const pool = groupWords
      .filter(w => w.id !== word.id && w.translation.toLowerCase() !== correct.toLowerCase())
      .map(w => w.translation)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]]
    }
    const options = [correct, ...pool.slice(0, 2)]
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]
    }
    return options
  }

  const resetPracticeRound = (shuffled: Word[]) => {
    clearPracticeTimer()
    setPracticeWords(shuffled)
    setPracticeIndex(0)
    setPracticeInput('')
    setTranslationRevealed(false)
    setPracticeCorrectWords([])
    setPracticeWrongWords([])
    setPracticeFinished(false)
    setPracticeFeedback(null)
    setSelectedChoice(null)
    setLearnedInSession(new Set())
    if (practiceMode === 'choose' && shuffled.length > 0) {
      setChoiceOptions(generateOptions(shuffled[0]))
    }
  }

  const openPracticeModal = () => {
    resetPracticeRound(shuffle(inProgressWords))
    setPracticeModalOpen(true)
  }

  const closePracticeModal = () => {
    clearPracticeTimer()
    triggerClose(() => setPracticeModalOpen(false))
  }

  const repeatPractice = () => {
    resetPracticeRound(shuffle(inProgressWords))
  }

  const switchPracticeMode = (mode: 'type' | 'choose') => {
    setPracticeMode(mode)
    clearPracticeTimer()
    setPracticeFeedback(null)
    setSelectedChoice(null)
    setPracticeInput('')
    if (mode === 'choose' && practiceWords[practiceIndex]) {
      setChoiceOptions(generateOptions(practiceWords[practiceIndex]))
    }
  }

  const practiceAdvance = (index: number, total: number) => {
    clearPracticeTimer()
    if (index < total - 1) {
      const next = index + 1
      setPracticeIndex(next)
      setPracticeInput('')
      setTranslationRevealed(false)
      setPracticeFeedback(null)
      setSelectedChoice(null)
      if (practiceMode === 'choose' && practiceWords[next]) {
        setChoiceOptions(generateOptions(practiceWords[next]))
      }
    } else {
      setPracticeFinished(true)
    }
  }

  const evaluateAnswer = (answer: string) => {
    const currentWord = practiceWords[practiceIndex]
    const answerLower = answer.trim().toLowerCase()
    const variants = currentWord.translation.split(',').map(v => v.trim().toLowerCase()).filter(Boolean)
    const isCorrect = answerLower === currentWord.translation.trim().toLowerCase() || variants.includes(answerLower)
    if (isCorrect) {
      setPracticeCorrectWords(prev => [...prev, currentWord])
    } else {
      setPracticeWrongWords(prev => [...prev, { word: currentWord, userAnswer: answer.trim() }])
    }
    setPracticeFeedback(isCorrect ? 'correct' : 'wrong')
    setTranslationRevealed(true)
    practiceTimerRef.current = setTimeout(() => practiceAdvance(practiceIndex, practiceWords.length), 1000)
    return isCorrect
  }

  const practiceCheck = () => {
    if (!practiceInput.trim()) return
    evaluateAnswer(practiceInput)
  }

  const handleChoiceSelect = (option: string) => {
    if (practiceFeedback) return
    setSelectedChoice(option)
    evaluateAnswer(option);
    (document.activeElement as HTMLElement)?.blur()
  }

  const isCorrectOption = (option: string): boolean => {
    const currentWord = practiceWords[practiceIndex]
    if (!currentWord) return false
    const optionLower = option.trim().toLowerCase()
    const variants = currentWord.translation.split(',').map(v => v.trim().toLowerCase()).filter(Boolean)
    return optionLower === currentWord.translation.trim().toLowerCase() || variants.includes(optionLower)
  }

  const handlePracticeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') practiceCheck()
  }

  // Edit/Add modal
  const openAddModal = () => {
    setEditingWord(null)
    setFormOriginal('')
    setFormTranslation('')
    setFormExample('')
    setEditModalOpen(true)
  }

  const openEditModal = (word: Word) => {
    setViewingWord(null)
    setEditingWord(word)
    setFormOriginal(word.original)
    setFormTranslation(word.translation)
    setFormExample(word.example || '')
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    triggerClose(() => { setEditModalOpen(false); setEditingWord(null) })
  }

  const handleSave = () => {
    if (!formOriginal.trim() || !formTranslation.trim()) return
    if (editingWord) {
      updateWord(editingWord.id, formOriginal.trim(), formTranslation.trim(), formExample.trim())
    } else if (id) {
      addWord(id, formOriginal.trim(), formTranslation.trim(), formExample.trim())
    }
    closeEditModal()
  }

  // Group name editing
  const startEditingGroupName = () => {
    setGroupNameDraft(group.name)
    setGroupColorDraft(group.color || 'hsl(0, 65%, 55%)')
    setEditingGroupName(true)
  }

  const saveGroup = () => {
    if (groupNameDraft.trim() && id) {
      updateGroup(id, groupNameDraft.trim(), groupColorDraft)
    }
    setEditingGroupName(false)
  }

  const handleGroupNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && groupNameDraft.trim()) {
      saveGroup()
    }
    if (e.key === 'Escape') {
      setEditingGroupName(false)
    }
  }

  return (
    <div className="group-container">
      <header className="group-header">
        <Link to="/" className="back-link">&larr; Back</Link>
        {editingGroupName ? (
          <div className="group-name-edit">
            <div className="group-edit-row">
              <input
                type="color"
                className="group-color-picker"
                value={groupColorDraft}
                onChange={(e) => setGroupColorDraft(e.target.value)}
              />
              <input
                type="text"
                value={groupNameDraft}
                onChange={(e) => setGroupNameDraft(e.target.value)}
                onKeyDown={handleGroupNameKeyDown}
                autoFocus
              />
            </div>
            <div className="group-edit-actions">
              <button className="save-btn" onClick={saveGroup}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingGroupName(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="group-name-row">
            <span className="group-color-dot" style={{ background: group.color || 'hsl(0, 65%, 55%)' }} />
            <h1>{group.name}</h1>
            <button className="edit-btn" onClick={startEditingGroupName}>&#9998;</button>
          </div>
        )}
        <div className="group-subheader">
          <p className="word-count">{groupWords.length} words</p>
          <button className="add-word-btn" onClick={openAddModal}>+ Add Word</button>
          <button className="export-btn" onClick={handleExport}>&#8595; Export</button>
        </div>
      </header>

      <div className="status-tabs">
        {(['all', 'new', 'in_progress', 'learned'] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            className={`status-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All' : STATUS_LABELS[tab]}
            <span className="tab-count">{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="practice-btn-wrap">
        {inProgressWords.length > 0 ? (
          <button className="practice-btn" onClick={openPracticeModal}>
            <span className="practice-btn-icon">&#9654;</span>
            <span className="practice-btn-label">
              Start Practice
              <span className="practice-btn-count">{inProgressWords.length} words</span>
            </span>
          </button>
        ) : (
          <p className="practice-empty">
            No words in progress yet. Open a word and set its status to <strong>In Progress</strong> to start practicing.
          </p>
        )}
      </div>

      {filteredWords.length === 0 ? (
        <p className="empty-message">
          {groupWords.length === 0
            ? 'No words yet. Add your first word above.'
            : 'No words with this status.'}
        </p>
      ) : (
        <ul className="word-list">
          {filteredWords.map((word) => (
            <li key={word.id} className="word-item" style={{ borderLeft: `3px solid ${group.color || 'hsl(0, 65%, 55%)'}` }} onClick={() => openViewModal(word)}>
              <div className="word-content">
                <span className="word-original">{word.original}</span>
                <span className="word-translation">{word.translation}</span>
                {word.example && <span className="word-example">{word.example}</span>}
              </div>
              <div className="word-meta">
                <span className={`word-status-badge status-${word.status || 'new'}`}>
                  {STATUS_LABELS[word.status || 'new']}
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); deleteWord(word.id) }}
                >
                  &times;
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* View modal */}
      {viewingWord && (
        <div className={`modal-overlay${modalClosing ? ' closing' : ''}`} onClick={closeViewModal} onAnimationEnd={handleModalAnimationEnd}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeViewModal}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="view-modal-header">
              <h2>{viewingWord.original}</h2>
              <button className="edit-btn" onClick={() => openEditModal(viewingWord)}>&#9998;</button>
            </div>
            <p className="view-translation">{viewingWord.translation}</p>
            {viewingWord.example && (
              <div className="view-example-section">
                <h3>Example</h3>
                <p className="view-example">{viewingWord.example}</p>
              </div>
            )}
            <div className="view-status-section">
              <h3>Status</h3>
              <div className="status-buttons">
                {(['new', 'in_progress', 'learned'] as WordStatus[]).map((s) => (
                  <button
                    key={s}
                    className={`status-btn status-${s} ${(viewingWord.status || 'new') === s ? 'active' : ''}`}
                    onClick={() => handleStatusChange(s)}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Practice modal */}
      {practiceModalOpen && (
        <div className={`modal-overlay${modalClosing ? ' closing' : ''}`} onClick={closePracticeModal} onAnimationEnd={handleModalAnimationEnd}>
          <div className="modal practice-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closePracticeModal}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            {practiceFinished ? (
              <>
                <div className="practice-finished-title">Round complete</div>
                <div className="practice-stats">
                  <div className="practice-stat practice-stat-correct">
                    <span className="practice-stat-count">{practiceCorrectWords.length}</span>
                    <span className="practice-stat-label">Correct</span>
                  </div>
                  <div className="practice-stat practice-stat-wrong">
                    <span className="practice-stat-count">{practiceWrongWords.length}</span>
                    <span className="practice-stat-label">Wrong</span>
                  </div>
                </div>
                <p className="practice-accuracy">
                  {Math.round((practiceCorrectWords.length / practiceWords.length) * 100)}% accuracy
                </p>
                <div className="practice-results">
                  {practiceCorrectWords.length > 0 && (
                    <div className="practice-result-group">
                      <div className="practice-result-heading practice-result-heading-correct">Correct</div>
                      {practiceCorrectWords.map(w => {
                        const isLearned = learnedInSession.has(w.id)
                        return (
                          <div key={w.id} className={`practice-result-row practice-result-row-correct${isLearned ? ' result-learned' : ''}`}>
                            <span className="practice-result-original">{w.original}</span>
                            <span className="practice-result-sep">—</span>
                            <span className="practice-result-translation">{w.translation}</span>
                            {isLearned ? (
                              <span className="result-learned-badge">✓ Learned</span>
                            ) : (
                              <button
                                className="mark-learned-btn"
                                onClick={() => {
                                  updateWordStatus(w.id, 'learned')
                                  setLearnedInSession(prev => new Set([...prev, w.id]))
                                }}
                              >
                                Mark as learned
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {practiceWrongWords.length > 0 && (
                    <div className="practice-result-group">
                      <div className="practice-result-heading practice-result-heading-wrong">Wrong</div>
                      {practiceWrongWords.map(({ word: w, userAnswer }) => (
                        <div key={w.id} className="practice-result-row practice-result-row-wrong">
                          <div className="wrong-result-content">
                            <span className="practice-result-original">{w.original}</span>
                            <span className="wrong-answer-row">
                              <span className="wrong-answer-label">Your answer:</span>
                              <span className="wrong-answer-value">{userAnswer}</span>
                            </span>
                            <span className="wrong-answer-row">
                              <span className="wrong-answer-label">Correct:</span>
                              <span className="wrong-answer-correct">{w.translation}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={closePracticeModal}>Close</button>
                  <button className="save-btn" onClick={repeatPractice}>Repeat</button>
                </div>
              </>
            ) : practiceWords[practiceIndex] ? (
              <>
                <div className="practice-top-bar">
                  <span className="practice-progress">{practiceIndex + 1} / {practiceWords.length}</span>
                  <div className="practice-mode-toggle">
                    <button className={`practice-mode-btn${practiceMode === 'type' ? ' active' : ''}`} onClick={() => switchPracticeMode('type')}>Type</button>
                    <button className={`practice-mode-btn${practiceMode === 'choose' ? ' active' : ''}`} onClick={() => switchPracticeMode('choose')}>Choose</button>
                  </div>
                </div>
                <div key={practiceIndex} className="practice-slide">
                  <div className="practice-word">
                    {practiceWords[practiceIndex].original}
                  </div>
                  <div
                    className={`practice-translation ${translationRevealed ? '' : 'blurred'}`}
                    onClick={() => !practiceFeedback && setTranslationRevealed(true)}
                  >
                    {practiceWords[practiceIndex].translation}
                  </div>
                  <p className="practice-hint" style={{ visibility: (!translationRevealed && !practiceFeedback) ? 'visible' : 'hidden' }}>
                    Click to reveal
                  </p>
                  <div className="practice-answer-area">
                    {practiceMode === 'choose' ? (
                      <>
                        <div className={`practice-feedback practice-feedback-${practiceFeedback}`} style={{ visibility: practiceFeedback ? 'visible' : 'hidden' }}>
                          {practiceFeedback === 'correct' ? '✓ Correct!' : `✗ Wrong — correct: ${practiceWords[practiceIndex].translation}`}
                        </div>
                        <div className="practice-options">
                          {choiceOptions.map((option, i) => {
                            let cls = 'practice-option'
                            if (selectedChoice) {
                              if (option === selectedChoice) cls += practiceFeedback === 'correct' ? ' option-correct' : ' option-wrong'
                              else if (isCorrectOption(option)) cls += ' option-correct'
                              else cls += ' option-dim'
                            }
                            return (
                              <button key={i} className={cls} onClick={() => handleChoiceSelect(option)} disabled={!!practiceFeedback}>
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    ) : practiceFeedback ? (
                      <div className={`practice-feedback practice-feedback-${practiceFeedback}`}>
                        {practiceFeedback === 'correct' ? '✓ Correct!' : `✗ Wrong — correct: ${practiceWords[practiceIndex].translation}`}
                      </div>
                    ) : (
                      <input
                        key={practiceIndex}
                        type="text"
                        className="practice-input"
                        value={practiceInput}
                        onChange={(e) => setPracticeInput(e.target.value)}
                        onKeyDown={handlePracticeKeyDown}
                        placeholder="Type translation..."
                        autoFocus
                      />
                    )}
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={closePracticeModal}>Close</button>
                  {!practiceFeedback && practiceMode === 'type' && (
                    <button
                      className="save-btn"
                      onClick={practiceCheck}
                      disabled={!practiceInput.trim()}
                    >
                      Check
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Edit/Add modal */}
      {editModalOpen && (
        <div className={`modal-overlay${modalClosing ? ' closing' : ''}`} onClick={closeEditModal} onAnimationEnd={handleModalAnimationEnd}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeEditModal}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h2>{editingWord ? 'Edit Word' : 'Add Word'}</h2>
            <div className="modal-form">
              <label>
                Word in {learningLanguage?.name}
                <input
                  type="text"
                  value={formOriginal}
                  onChange={(e) => setFormOriginal(e.target.value)}
                  placeholder="e.g. hello"
                  autoFocus
                />
              </label>
              <label>
                Translation in {nativeLanguage?.name}
                <input
                  type="text"
                  value={formTranslation}
                  onChange={(e) => setFormTranslation(e.target.value)}
                  placeholder="e.g. hola"
                />
              </label>
              <label>
                Example
                <textarea
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  placeholder="e.g. Hello, how are you?"
                  rows={3}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={!formOriginal.trim() || !formTranslation.trim()}
              >
                {editingWord ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
