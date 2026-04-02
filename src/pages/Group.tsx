import { useState } from 'react'
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

  const [editingGroupName, setEditingGroupName] = useState(false)
  const [groupNameDraft, setGroupNameDraft] = useState('')
  const [groupColorDraft, setGroupColorDraft] = useState('')

  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  // View modal
  const [viewingWord, setViewingWord] = useState<Word | null>(null)

  // Edit/Add modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingWord, setEditingWord] = useState<Word | null>(null)
  const [formOriginal, setFormOriginal] = useState('')
  const [formTranslation, setFormTranslation] = useState('')
  const [formExample, setFormExample] = useState('')

  const group = groups.find(g => g.id === id)
  const groupWords = words.filter(w => w.groupId === id)
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
    setViewingWord(null)
  }

  const handleStatusChange = (status: WordStatus) => {
    if (viewingWord) {
      updateWordStatus(viewingWord.id, status)
      setViewingWord({ ...viewingWord, status })
    }
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
    setEditModalOpen(false)
    setEditingWord(null)
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
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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

      {/* Edit/Add modal */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
