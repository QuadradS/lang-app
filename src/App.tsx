import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, About, Config, Group } from './pages'
import { useAppStore } from './store'
import './App.css'

function App() {
  const isConfigured = useAppStore((state) => state.isConfigured)

  return (
    <Routes>
      <Route path="/config" element={<Config />} />
      <Route
        path="/"
        element={isConfigured ? <Home /> : <Navigate to="/config" replace />}
      />
      <Route
        path="/about"
        element={isConfigured ? <About /> : <Navigate to="/config" replace />}
      />
      <Route
        path="/group/:id"
        element={isConfigured ? <Group /> : <Navigate to="/config" replace />}
      />
    </Routes>
  )
}

export default App
