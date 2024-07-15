import { useEffect,useState } from 'react'
import axios from 'axios';
import './App.css'
import HomePage from './pages/HomePage/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <HomePage />
    </div>
  )
}

export default App