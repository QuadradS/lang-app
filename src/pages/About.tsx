import { Link } from 'react-router-dom'
import { useAppStore } from '../store'

export function About() {
  const count = useAppStore((state) => state.count)

  return (
    <div>
      <h1>About</h1>
      <p>This page demonstrates that state persists across routes.</p>
      <p>Current count from store: {count}</p>
      <p>
        <Link to="/">Go to Home</Link>
      </p>
    </div>
  )
}
