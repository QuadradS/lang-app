import { Link } from 'react-router-dom'
import { useAppStore } from '../store'

export function About() {
  const words = useAppStore((state) => state.words)

  return (
    <div>
      <h1>About</h1>
      <p>This page demonstrates that state persists across routes.</p>
      <p>Words in store: {words.length}</p>
      <p>
        <Link to="/">Go to Home</Link>
      </p>
    </div>
  )
}
