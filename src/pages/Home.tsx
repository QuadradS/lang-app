import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import './Home.css'

export function Home() {
  const { nativeLanguage, learningLanguage, groups, words, addGroup, deleteGroup, importData } = useAppStore()
  const [newGroupName, setNewGroupName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim())
      setNewGroupName('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroup()
    }
  }

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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.groups && data.words) {
          importData(data)
        } else {
          alert('Invalid file format')
        }
      } catch {
        alert('Failed to parse file')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>QuadLang</h1>
        <p className="language-pair">
          {nativeLanguage?.name} &rarr; {learningLanguage?.name}
          <Link to="/config" className="change-link">change</Link>
        </p>
      </header>

      <section className="groups-section">
        <h2>Groups</h2>

        <div className="add-group">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New group name"
          />
          <button onClick={handleAddGroup} disabled={!newGroupName.trim()}>
            Add
          </button>
        </div>

        <div className="group-grid">
          {groups.map((group) => {
            const wordCount = words.filter(w => w.groupId === group.id).length
            return (
              <div key={group.id} className="group-card" style={{ borderLeft: `3px solid ${group.color || 'hsl(0, 65%, 55%)'}` }}>
                <Link to={`/group/${group.id}`} className="group-card-link">
                  <span className="group-card-name">
                    {group.name}
                    {group.isDefault && <span className="default-badge">default</span>}
                  </span>
                  <span className="group-card-count">{wordCount} words</span>
                </Link>
                {!group.isDefault && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteGroup(group.id)}
                  >
                    &times;
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="data-section">
        <button className="data-btn" onClick={handleExport}>Export Data</button>
        <button className="data-btn" onClick={() => fileInputRef.current?.click()}>Import Data</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          hidden
        />
      </section>
    </div>
  )
}
